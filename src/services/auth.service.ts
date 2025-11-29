import { api } from '@/lib/api';
import type { ApiResponse, LoginPayload } from '@/types';

const TOKEN_KEY = 'pda:token';

export async function login(payload: LoginPayload): Promise<string> {
  // o interceptor do axios já retorna response.data, portanto resp é o body { status, message, data: { token } }
  const { data } = await api.post<ApiResponse<{ token: string }>>('/auth/login', payload);
  const token = data.token;
  if (!token) throw new Error('Token ausente');
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
