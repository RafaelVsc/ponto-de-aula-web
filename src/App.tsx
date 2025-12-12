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
                  <ProtectedRoute>
                    <Layout>
                      <PostDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/mine"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MyPosts />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreatePost />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/edit/:id"
                element={
                  <ProtectedRoute>
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
                  <ProtectedRoute>
                    <Layout>
                      <Users />
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
