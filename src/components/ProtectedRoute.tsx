import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types'; // ← IMPORTA AQUI

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
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Tudo OK - renderiza o conteúdo
  return <>{children}</>;
}
