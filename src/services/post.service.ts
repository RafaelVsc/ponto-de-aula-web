import { api } from '@/lib/api';
import type {
  ApiResponse,
  CreatePostPayload,
  Post,
  PostSearchParams,
  UpdatePostPayload,
} from '@/types';

export async function fetchPosts(): Promise<ApiResponse<Post[]>> {
  return api.get<ApiResponse<Post[]>>('/posts');
}

export async function fetchPostById(id: string): Promise<ApiResponse<Post>> {
  return api.get<ApiResponse<Post>>(`/posts/${id}`);
}

export async function deletePostById(id: string): Promise<ApiResponse<void>> {
  return api.delete<ApiResponse<void>>(`/posts/${id}`);
}

export async function createPost(payload: CreatePostPayload): Promise<ApiResponse<Post>> {
  return api.post<ApiResponse<Post>>(`/posts`, payload);
}

export async function updatePostById(
  id: string,
  payload: UpdatePostPayload,
): Promise<ApiResponse<Post>> {
  return api.put<ApiResponse<Post>>(`/posts/${id}`, payload);
}

export async function fetchMyPosts(): Promise<ApiResponse<Post[]>> {
  return api.get<ApiResponse<Post[]>>(`/posts/mine`);
}

// Buscar posts com filtros e paginação
export async function searchPosts(params: PostSearchParams = {}): Promise<ApiResponse<Post[]>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `/posts/search?${queryString}` : '/posts';

  return api.get<ApiResponse<Post[]>>(url);
}

// Buscar meus posts
export async function searchMyPosts(params: PostSearchParams = {}): Promise<ApiResponse<Post[]>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `/posts/mine/search?${queryString}` : '/posts/mine';

  return api.get<ApiResponse<Post[]>>(url);
}
