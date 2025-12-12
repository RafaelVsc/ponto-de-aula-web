import type { User } from '@/types';
import { createContext } from 'react';

type AuthContextValue = {
  user: User | null;
  isAuthenticating: boolean;
  isInitializing: boolean;
  login(identifier: string, password: string): Promise<void>;
  logout(): void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
