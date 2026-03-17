import api from '@/lib/axios';
import type { Product, ApiResponse, PaginatedResponse } from '@/types';

export const productService = {
  getAll: (params?: { page?: number; search?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  create: (data: FormData) =>
    api.post<ApiResponse<Product>>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, data: FormData) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/products/${id}`),
};
