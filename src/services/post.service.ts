import {api} from '@/lib/api';
import type { ApiResponse, Post } from '@/types';

export async function fetchPosts() {
    return api.get<ApiResponse<Post[]>>("/posts");    
}