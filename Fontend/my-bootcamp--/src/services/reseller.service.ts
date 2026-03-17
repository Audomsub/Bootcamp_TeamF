import api from '@/lib/axios';
import type { User, ApiResponse, PaginatedResponse } from '@/types';

export const resellerService = {
  getAll: (params?: { page?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<User & { shop?: { shop_name: string } }>>>(
      '/resellers',
      { params }
    ),

  approve: (id: number) =>
    api.patch<ApiResponse<User>>(`/resellers/${id}/approve`),

  reject: (id: number) =>
    api.patch<ApiResponse<User>>(`/resellers/${id}/reject`),
};
