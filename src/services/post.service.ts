import {api} from '@/lib/api';
import type { ApiResponse, Post } from '@/types';

export async function fetchPosts() {
    return api.get<ApiResponse<Post[]>>("/posts");    
}

export async function fetchPostById(id:string) {
    return api.get<ApiResponse<Post>>(`/posts/${id}`)    
}

export async function deletePost(id: string) {
    return api.delete<ApiResponse<void>>(`/posts/${id}`)
}