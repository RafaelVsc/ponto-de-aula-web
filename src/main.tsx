import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Layout from '@/components/Layout';
import MyPosts from '@/pages/MyPosts';
import './index.css';
import PostDetail from './pages/PostDetail';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota pública */}
            <Route path="/" element={<Login />} />

            {/* Rota protegida */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PostDetail />
                  </Layout>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/posts/mine"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyPosts />
                  </Layout>
                </ProtectedRoute>
              }
            ></Route>
            {/* <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePost />
                  </Layout>
                </ProtectedRoute>
              }
            /> */}
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
