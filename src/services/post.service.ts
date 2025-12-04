import { api } from '@/lib/api';
import type {
  ApiResponse,
  CreatePostPayload,
  Post,
  PostSearchParams,
  UpdatePostPayload,
} from '@/types';

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

// Buscar posts com filtros e paginação
export async function searchPosts(params: PostSearchParams = {}): Promise<Post[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `/posts/search?${queryString}` : '/posts';

  const response = await api.get<Post[]>(url);
  return response.data;
}

// Buscar meus posts com filtros e paginação
export async function searchMyPosts(params: PostSearchParams = {}): Promise<ApiResponse<Post[]>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `/posts/mine/search?${queryString}` : '/posts/mine';

  const response = await api.get<ApiResponse<Post[]>>(url);
  return response;
}
