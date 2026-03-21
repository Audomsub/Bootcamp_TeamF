import api from '@/lib/axios';
import type { ShopProduct, Product, Shop, ApiResponse } from '@/types';

export const shopService = {
  // ─── Customer / Public APIs ──────────────────────────────────

  getApprovedShops: async () => {
    const res = await api.get('customer/approved-shops');
    return Array.isArray(res.data) ? res.data : [];
  },

  /** Get basic shop info by slug */
  getBySlug: async (slug: string) => {
    try {
      const res = await api.get(`customer/shop/${slug}`);
      return res.data;
    } catch (error) {
      console.error(`[shopService] Error fetching shop info for ${slug}:`, error);
      throw error;
    }
  },

  /** Get products of a specific approved shop by slug (for shop detail page) */
  getApprovedShopProducts: async (slug: string, page: number = 0, size: number = 15) => {
    try {
      const res = await api.get(`customer/approved-shops/${slug}/products`, { params: { page, size } });
      console.log(`[shopService] Response for ${slug}:`, res.data);
      return res.data || null;
    } catch (error) {
      console.error(`[shopService] Error fetching products for ${slug}:`, error);
      throw error;
    }
  },

  // ─── Reseller Protected APIs ──────────────────────────────────

  // Get catalog (all products for reseller to browse)
  getCatalog: (page: number = 0, size: number = 20) =>
    api.get<any>(`reseller/catalog?page=${page}&size=${size}`),

  // Get my shop products
  getMyProducts: (page: number = 0, size: number = 100) =>
    api.get<any>(`reseller/products?page=${page}&size=${size}`),

  // Add product to shop
  addProduct: (data: { productId: number; sellingPrice: number }) =>
    api.post<any>('reseller/catalog/select', data),

  // Update selling price
  updatePrice: (id: number, selling_price: number) =>
    api.patch<ApiResponse<ShopProduct>>(`reseller/products/${id}`, { selling_price }),

  // Remove product from shop
  removeProduct: (id: number) =>
    api.delete<ApiResponse<null>>(`reseller/products/${id}`),
};
