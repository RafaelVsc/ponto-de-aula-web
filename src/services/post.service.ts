import { api } from '@/lib/api';
import type { ApiResponse, Post } from '@/types';

export async function fetchPosts() {
  const response = await api.get<ApiResponse<Post[]>>('/posts');
  return response;
}

export async function fetchPostById(id: string) {
  const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return response;
}

export async function deletePost(id: string) {
  return api.delete<ApiResponse<void>>(`/posts/${id}`);
}
