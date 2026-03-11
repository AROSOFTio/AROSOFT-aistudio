import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import multer from 'multer';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// MySQL Connection Pool
let pool: mysql.Pool | null = null;

function getDbPool() {
  if (!pool) {
    if (!process.env.DB_HOST || !process.env.DB_USER) {
      console.warn("MySQL credentials not found in environment variables. Database features will be disabled.");
      return null;
    }
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Initialize Database Schema
async function initDb() {
  const db = getDbPool();
  if (!db) return;

  try {
    // Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        institution VARCHAR(255),
        system_name VARCHAR(255),
        system_repo VARCHAR(255),
        package_type VARCHAR(50),
        extra_notes TEXT,
        amount INT,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin if no users exist
    const [users]: any = await db.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [uuidv4(), 'admin@arosoft.io', hashedPassword, 'admin']
      );
      console.log('Default admin created: admin@arosoft.io / admin123');
    }

    // Posts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author_id VARCHAR(36),
        status VARCHAR(50) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
}

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: getDbPool() !== null });
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [users]: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Blog Routes
app.get('/api/posts', async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [posts] = await db.query('SELECT * FROM posts WHERE status = "published" ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [posts]: any = await db.query('SELECT * FROM posts WHERE slug = ?', [req.params.slug]);
    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(posts[0]);
  } catch (error) {
    console.error('Fetch post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Admin Blog Routes (Protected)
app.post('/api/admin/posts', authenticateToken, async (req: any, res) => {
  const { title, content, excerpt, status } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const id = uuidv4();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    await db.query(
      'INSERT INTO posts (id, title, slug, content, excerpt, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, slug, content, excerpt, req.user.id, status || 'published']
    );
    res.json({ success: true, id, slug });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Pesapal Mock Implementation
app.post('/api/orders', upload.single('systemZip'), async (req, res) => {
  try {
    const { fullName, email, phone, institution, systemName, systemRepo, packageType, extraNotes } = req.body;
    const file = req.file;

    if (!fullName || !email || !phone || !systemName || !packageType || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = uuidv4();
    const amount = packageType === 'hosting_only' ? 50000 : 86000;

    // Save to database if available
    const db = getDbPool();
    if (db) {
      await db.query(
        'INSERT INTO orders (id, full_name, email, phone, institution, system_name, system_repo, package_type, extra_notes, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, fullName, email, phone, institution, systemName, systemRepo, packageType, extraNotes, amount]
      );
    }

    // Generate a mock Pesapal redirect URL
    const pesapalRedirectUrl = \`https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=\${orderId}\`;

    res.json({ 
      success: true, 
      orderId, 
      redirectUrl: pesapalRedirectUrl,
      message: 'Order created successfully. Redirecting to Pesapal...'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Vite middleware for development
async function startServer() {
  await initDb(); // Initialize database schema on startup

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();
