import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { StudentOffer } from './pages/StudentOffer';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AdminLogin } from './pages/admin/Login';
import { AdminRegister } from './pages/admin/Register';
import { AdminLayout } from './pages/admin/Layout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminPosts } from './pages/admin/Posts';
import { AdminPostEditor } from './pages/admin/PostEditor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-offer" element={<StudentOffer />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<AdminPostEditor />} />
          <Route path="posts/:id/edit" element={<AdminPostEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}
