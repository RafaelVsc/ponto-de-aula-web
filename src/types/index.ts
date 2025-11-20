// src/types/index.ts
export type Role = "ADMIN" | "SECRETARY" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  registeredAt?: string;
  updatedAt?: string;
}

// Genérico para respostas no formato { data: T }
export interface ApiResponse<T> {
  data: T;
}

// Resposta do login: { status, message, data: { token } }
export interface LoginResponse {
  status: string;
  message?: string;
  data: {
    token: string;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
}