import { api } from '@/lib/api';
import type {
  ApiResponse,
  CreateUserPayload,
  UpdateUserPayload,
  ChangePasswordPayload,
  User,
} from '@/types';

// ADMIN
export function createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
  return api.post<ApiResponse<User>>('/users', payload);
}

// ADMIN/SECRETARY
export function listUsers(): Promise<ApiResponse<User[]>> {
  return api.get<ApiResponse<User[]>>('/users');
}

// qualquer usuário autenticado
export function getMe(): Promise<ApiResponse<User>> {
  return api.get<ApiResponse<User>>('/users/me');
}

export function updateMe(payload: UpdateUserPayload): Promise<ApiResponse<User>> {
  return api.patch<ApiResponse<User>>('/users/me', payload);
}

export function changeMyPassword(
  payload: ChangePasswordPayload,
): Promise<ApiResponse<{ status?: string; message?: string }>> {
  return api.put<ApiResponse<{ status?: string; message?: string }>>('/users/me/password', payload);
}

// ADMIN
export function getUserById(id: string): Promise<ApiResponse<User>> {
  return api.get<ApiResponse<User>>(`/users/${id}`);
}

export function updateUserById(id: string, payload: UpdateUserPayload): Promise<ApiResponse<User>> {
  return api.patch<ApiResponse<User>>(`/users/${id}`, payload);
}

export function deleteUserById(id: string): Promise<ApiResponse<void>> {
  return api.delete<ApiResponse<void>>(`/users/${id}`);
}
