// src/types/index.ts
export type Role = 'ADMIN' | 'SECRETARY' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  registeredAt?: string;
  updatedAt?: string;
}

export type CreateUserPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role; // 'ADMIN' | 'SECRETARY' | 'TEACHER' | 'STUDENT'
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

// Genérico para respostas no formato { data: T }
export interface ApiResponse<T> {
  data: T;
}

// Resposta do login: { status, message, data: { token } }
export type LoginResponse = {
  status: string;
  message: string;
  data: {
    token: string;
  };
};

export type Session = {
  token: string;
};

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LoginPayload = {
  email?: string;
  username?: string;
  password: string;
};

export type PostSearchParams = {
  search?: string;
  title?: string;
  tag?: string;
  authorId?: string;
  authorName?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
};

export type CreatePostPayload = {
  title: string;
  content: string;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
};

export type UpdatePostPayload = {
  title?: string;
  content?: string;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
};
