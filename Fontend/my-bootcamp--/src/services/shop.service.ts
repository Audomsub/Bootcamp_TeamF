import api from '@/lib/axios';
import type { ShopProduct, Product, Shop, ApiResponse } from '@/types';

export const shopService = {
  // Get shop by slug (public)
  getBySlug: (slug: string, page: number = 0, size: number = 12) =>
    api.get<ApiResponse<{
      shopName: string,
      productResponses: any[],
      totalPages: number,
      totalElements: number,
      currentPage: number
    }>>(
      `/shop/${slug}?page=${page}&size=${size}`
    ),

  // Get catalog (all products for reseller to browse)
  getCatalog: (page: number = 0, size: number = 20) =>
    api.get<any>(`/reseller/catalog?page=${page}&size=${size}`),

  // Get my shop products
  getMyProducts: (page: number = 0, size: number = 100) =>
    api.get<any>(`/reseller/products?page=${page}&size=${size}`),

  // Add product to shop
  addProduct: (data: { productId: number; sellingPrice: number }) =>
    api.post<any>('/reseller/catalog/select', data),

  // Update selling price
  updatePrice: (id: number, selling_price: number) =>
    api.patch<ApiResponse<ShopProduct>>(`/reseller/products/${id}`, { selling_price }),

  // Remove product from shop
  removeProduct: (id: number) =>
    api.delete<ApiResponse<null>>(`/reseller/products/${id}`),
};
