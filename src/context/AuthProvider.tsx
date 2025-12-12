import { api } from '@/lib/api';
import { clearToken, getToken, login as loginService } from '@/services/auth.service';
import type { ApiResponse, User } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Carrega perfil se houver token ao montar
  useEffect(() => {
    let mounted = true;
    const token = getToken();

    if (!token) {
      setIsInitializing(false);
      return;
    }

    (async () => {
      try {
        // graças ao interceptor, api.get<ApiResponse<User>> retorna o body { data: User }
        const profile = await api.get<ApiResponse<User>>('/users/me');
        if (!mounted) return;
        setUser(profile.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        clearToken();
      } finally {
        if (mounted) setIsInitializing(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Escuta evento de logout do interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      clearToken();
      window.location.href = '/';
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const payload = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };

      const token = await loginService(payload);
      if (!token) throw new Error('Token não recebido do servidor');

      const profile = await api.get<ApiResponse<User>>('/users/me');
      setUser(profile.data);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('pda:token');
    setUser(null);
    window.location.href = '/';
  };

  const value = useMemo(
    () => ({ user, isAuthenticating, isInitializing, login, logout }),
    [user, isAuthenticating, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
