import api from '@/lib/axios';
import type { ShopProduct, Product, Shop, ApiResponse } from '@/types';

export const shopService = {
  // Get shop by slug (public)
  getBySlug: (slug: string) =>
    api.get<ApiResponse<Shop & { products: (ShopProduct & { product: Product })[] }>>(
      `/shops/${slug}`
    ),

  // Get catalog (all products for reseller to browse)
  getCatalog: () =>
    api.get<ApiResponse<Product[]>>('/catalog'),

  // Get my shop products
  getMyProducts: () =>
    api.get<ApiResponse<(ShopProduct & { product: Product })[]>>('/reseller/products'),

  // Add product to shop
  addProduct: (data: { product_id: number; selling_price: number }) =>
    api.post<ApiResponse<ShopProduct>>('/reseller/products', data),

  // Update selling price
  updatePrice: (id: number, selling_price: number) =>
    api.patch<ApiResponse<ShopProduct>>(`/reseller/products/${id}`, { selling_price }),

  // Remove product from shop
  removeProduct: (id: number) =>
    api.delete<ApiResponse<null>>(`/reseller/products/${id}`),
};
