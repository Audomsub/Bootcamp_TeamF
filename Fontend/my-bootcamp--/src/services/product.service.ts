import api from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import type { Product, ApiResponse, PaginatedResponse } from '@/types';

export interface BackendProduct {
  id: number;
  productName: string;
  description: string;
  imageUrl: string;
  costPrice: number;
  minSellPrice: number;
  stock: number;
  createdAt: string;
}

const mapProduct = (p: BackendProduct): Product => ({
  id: p.id,
  name: p.productName,
  description: p.description,
  image_url: getImageUrl(p.imageUrl) || 'https://placehold.co/100x100',
  cost_price: p.costPrice,
  min_price: p.minSellPrice,
  stock: p.stock,
  created_at: p.createdAt,
});

export const productService = {
  getAll: async (params?: { page?: number; size?: number }) => {
    // Spring Boot returns a Page object when paginated
    const res = await api.get<{ content: BackendProduct[] }>('admin/products', { 
      params: {
        page: params?.page || 0,
        size: params?.size || 100 // Load 100 per page for admin for better UX without too much clicking
      }
    });

    const products = Array.isArray(res.data) 
      ? res.data.map(mapProduct) 
      : (res.data.content?.map(mapProduct) || []);

    return { 
      data: { 
        data: { 
          data: products 
        } 
      } 
    };
  },

  getById: async (id: number) => {
    // Since admin API doesn't have get by id, fetch all and filter
    const res = await api.get<{ content?: BackendProduct[] }>('admin/products');
    const productsArray = Array.isArray(res.data) ? res.data : (res.data.content || []);
    const product = productsArray.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { data: { data: mapProduct(product) } };
  },

  create: (data: FormData) => {
    return api.post('admin/products/add', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  update: (id: number, data: FormData) => {
    return api.put(`admin/products/edit/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: (id: number) =>
    api.delete(`admin/products/delete/${id}`),
};
