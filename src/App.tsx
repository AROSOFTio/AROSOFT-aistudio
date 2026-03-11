import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { StudentOffer } from './pages/StudentOffer';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';

const AdminLogin = lazy(() => import('./pages/admin/Login').then((module) => ({ default: module.AdminLogin })));
const AdminRegister = lazy(() => import('./pages/admin/Register').then((module) => ({ default: module.AdminRegister })));
const AdminLayout = lazy(() => import('./pages/admin/Layout').then((module) => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then((module) => ({ default: module.AdminDashboard })));
const AdminPosts = lazy(() => import('./pages/admin/Posts').then((module) => ({ default: module.AdminPosts })));
const AdminPostEditor = lazy(() => import('./pages/admin/PostEditor').then((module) => ({ default: module.AdminPostEditor })));

export default function App() {
  const loadingFallback = (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading...</div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-offer" element={<StudentOffer />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <Suspense fallback={loadingFallback}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={loadingFallback}>
              <AdminRegister />
            </Suspense>
          }
        />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin/register" element={<Navigate to="/register" replace />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={loadingFallback}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={loadingFallback}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="posts"
            element={
              <Suspense fallback={loadingFallback}>
                <AdminPosts />
              </Suspense>
            }
          />
          <Route
            path="posts/new"
            element={
              <Suspense fallback={loadingFallback}>
                <AdminPostEditor />
              </Suspense>
            }
          />
          <Route
            path="posts/:id/edit"
            element={
              <Suspense fallback={loadingFallback}>
                <AdminPostEditor />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
