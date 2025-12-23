import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types'; // ← IMPORTA AQUI
import Layout from './Layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isInitializing } = useAuth();

  // Loading inicial - verificando token
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground" role="status">
          Carregando...
        </div>
      </div>
    );
  }

  // Não está logado - redireciona para login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logado mas sem permissão
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md text-center space-y-2">
            <h2 className="text-xl font-semibold">Acesso negado</h2>
            <p className="text-sm text-muted-foreground">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Tudo OK - renderiza o conteúdo
  return <>{children}</>;
}
