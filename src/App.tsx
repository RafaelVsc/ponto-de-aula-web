import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/context/AuthProvider';
import CreatePost from '@/pages/CreatePost';
import Dashboard from '@/pages/Dashboard';
import EditPost from '@/pages/EditPost';
import Login from '@/pages/Login';
import MyPosts from '@/pages/MyPosts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import { ThemeProvider } from './components/theme-provider';
import Profile from './pages/Profile';
import Users from './pages/Users';
import UserForm from './pages/UserForm';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pda-theme">
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Rota pública */}
              <Route path="/" element={<Login />} />

              {/* Rotas protegidas */}
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
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY', 'TEACHER']}>
                    <Layout>
                      <PostDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/mine"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY', 'TEACHER']}>
                    <Layout>
                      <MyPosts />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY', 'TEACHER']}>
                    <Layout>
                      <CreatePost />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY', 'TEACHER']}>
                    <Layout>
                      <EditPost />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY']}>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY']}>
                    <Layout>
                      <UserForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY']}>
                    <Layout>
                      <UserForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
