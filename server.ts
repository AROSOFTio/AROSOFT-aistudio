import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import multer from 'multer';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { promises as dns } from 'node:dns';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const UPLOADS_ROOT = path.resolve(process.cwd(), 'uploads');
const EDITOR_UPLOADS_DIR = path.join(UPLOADS_ROOT, 'editor');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
fs.mkdirSync(EDITOR_UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_ROOT));

// Multer setup for student order uploads (zip)
const orderUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

const editorStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, EDITOR_UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const originalName = file.originalname || 'file';
    const extension = path.extname(originalName).toLowerCase();
    cb(null, `${Date.now()}-${uuidv4()}${extension}`);
  },
});

const editorUpload = multer({
  storage: editorStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function generateUniqueSlug(db: mysql.Pool, title: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const query = excludeId
      ? 'SELECT id FROM posts WHERE slug = ? AND id <> ? LIMIT 1'
      : 'SELECT id FROM posts WHERE slug = ? LIMIT 1';
    const params = excludeId ? [candidate, excludeId] : [candidate];
    const [rows]: any = await db.query(query, params);

    if (rows.length === 0) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

function normalizeDomainInput(rawDomain: string): string {
  let value = (rawDomain || '').trim().toLowerCase();
  value = value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  return value;
}

function isValidDomain(domain: string): boolean {
  return /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain);
}

async function checkDomainAvailability(domain: string): Promise<{ status: 'available' | 'taken' | 'unknown'; source: string }> {
  // Primary check via RDAP: registered domains should return 200.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const rdapResponse = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (rdapResponse.ok) return { status: 'taken', source: 'rdap' };
    if (rdapResponse.status === 404) return { status: 'available', source: 'rdap' };
  } catch {
    clearTimeout(timeout);
    // Fall through to DNS check.
  }

  // Fallback DNS check: if resolvable, likely already taken.
  try {
    await dns.resolveAny(domain);
    return { status: 'taken', source: 'dns' };
  } catch (error: any) {
    const code = error?.code || '';
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'SERVFAIL') {
      return { status: 'available', source: 'dns' };
    }
    return { status: 'unknown', source: 'dns' };
  }
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

    // Ensure a default admin account exists.
    const defaultAdminEmail = String(process.env.DEFAULT_ADMIN_EMAIL || 'admin@arosoft.io').trim().toLowerCase();
    const defaultAdminPassword = String(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123');
    const resetDefaultPassword = process.env.RESET_DEFAULT_ADMIN_PASSWORD === 'true';

    const [existingDefaultAdmins]: any = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [defaultAdminEmail]
    );

    if (existingDefaultAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
      await db.query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [uuidv4(), defaultAdminEmail, hashedPassword, 'admin']
      );
      console.log(`Default admin created: ${defaultAdminEmail}`);
    } else if (resetDefaultPassword) {
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
      await db.query(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', defaultAdminEmail]
      );
      console.log(`Default admin password reset for ${defaultAdminEmail}`);
    }

    // Posts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        author_id VARCHAR(36),
        status VARCHAR(50) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ensure rich HTML content can be stored even on older schemas.
    await db.query('ALTER TABLE posts MODIFY content LONGTEXT NOT NULL');
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

const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: getDbPool() !== null });
});

app.get('/api/domain/check', async (req, res) => {
  try {
    const requested = normalizeDomainInput(String(req.query.domain || ''));
    if (!requested) {
      return res.status(400).json({ error: 'Domain is required' });
    }
    if (!isValidDomain(requested)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    const result = await checkDomainAvailability(requested);
    res.json({ domain: requested, ...result });
  } catch (error) {
    console.error('Domain check error:', error);
    res.status(500).json({ error: 'Failed to check domain availability' });
  }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [users]: any = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
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

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existingUsers]: any = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(String(password), 10);

    await db.query(
      'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
      [userId, normalizedEmail, hashedPassword, 'admin']
    );

    res.status(201).json({ success: true, id: userId, email: normalizedEmail });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [users]: any = await db.query(
      'SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    const user = users[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('Fetch auth user error:', error);
    res.status(500).json({ error: 'Failed to fetch current user' });
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
app.get('/api/admin/posts', authenticateToken, requireAdmin, async (req: any, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    console.error('Fetch admin posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/admin/posts/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [posts]: any = await db.query('SELECT * FROM posts WHERE id = ? LIMIT 1', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(posts[0]);
  } catch (error) {
    console.error('Fetch admin post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req: any, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [postsRows]: any = await db.query('SELECT COUNT(*) as count FROM posts');
    const [ordersRows]: any = await db.query('SELECT COUNT(*) as count FROM orders');
    const [usersRows]: any = await db.query('SELECT COUNT(*) as count FROM users');
    const [revenueRows]: any = await db.query('SELECT COALESCE(SUM(amount), 0) as total FROM orders');

    res.json({
      posts: Number(postsRows[0]?.count || 0),
      orders: Number(ordersRows[0]?.count || 0),
      users: Number(usersRows[0]?.count || 0),
      revenue: Number(revenueRows[0]?.total || 0),
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

app.post('/api/admin/posts', authenticateToken, requireAdmin, async (req: any, res) => {
  const { title, content, excerpt, status } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const id = uuidv4();
    const slug = await generateUniqueSlug(db, title);
    const normalizedStatus = status === 'draft' ? 'draft' : 'published';
    
    await db.query(
      'INSERT INTO posts (id, title, slug, content, excerpt, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, slug, content, excerpt, req.user.id, normalizedStatus]
    );
    res.status(201).json({ success: true, id, slug });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/admin/posts/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  const { title, content, excerpt, status } = req.body;
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const slug = await generateUniqueSlug(db, title, req.params.id);
    const normalizedStatus = status === 'draft' ? 'draft' : 'published';
    
    const [result]: any = await db.query(
      'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, status = ? WHERE id = ?',
      [title, slug, content, excerpt, normalizedStatus, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, id: req.params.id, slug });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/admin/posts/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  const db = getDbPool();
  if (!db) return res.status(500).json({ error: 'Database not connected' });

  try {
    const [result]: any = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.post('/api/admin/uploads/image', authenticateToken, requireAdmin, editorUpload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    if (!String(req.file.mimetype || '').startsWith('image/')) {
      return res.status(400).json({ error: 'Only image uploads are allowed' });
    }
    const url = `/uploads/editor/${req.file.filename}`;
    res.status(201).json({
      success: true,
      url,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.post('/api/admin/uploads/file', authenticateToken, requireAdmin, editorUpload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    const url = `/uploads/editor/${req.file.filename}`;
    res.status(201).json({
      success: true,
      url,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Attachment upload error:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
});

// Pesapal Mock Implementation
app.post('/api/orders', orderUpload.single('systemZip'), async (req, res) => {
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
    const pesapalRedirectUrl = `https://pay.pesapal.com/iframe/PesapalIframe3/Index?OrderTrackingId=${orderId}`;

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

  const useViteDevServer =
    process.env.NODE_ENV === 'development' || process.env.USE_VITE_DEV_SERVER === 'true';

  if (useViteDevServer) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    const distIndex = path.join(distDir, 'index.html');

    if (!fs.existsSync(distIndex)) {
      console.error('Missing dist/index.html. Run "npm run build" before starting production server.');
    }

    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(distIndex);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
