import { api } from '@/lib/api';
import type { ApiResponse, CreatePostPayload, Post, UpdatePostPayload } from '@/types';

export async function fetchPosts() {
  const response = await api.get<ApiResponse<Post[]>>('/posts');
  return response;
}

export async function fetchPostById(id: string) {
  const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return response;
}

export async function deletePostById(id: string) {
  return api.delete<ApiResponse<void>>(`/posts/${id}`);
}

export async function createPost(payload: CreatePostPayload) {
  const response = await api.post<ApiResponse<Post>>(`/posts`, payload);
  return response;
}

export async function updatePostById(id: string, payload: UpdatePostPayload) {
  const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, payload);
  return response;
}

export async function fetchMyPosts() {
  const response = await api.get<ApiResponse<Post[]>>(`/posts/mine`);
  return response;
}
