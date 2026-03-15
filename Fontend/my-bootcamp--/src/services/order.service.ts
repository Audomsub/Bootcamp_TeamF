import api from '@/lib/axios';
import type { Order, ApiResponse, PaginatedResponse } from '@/types';

export const orderService = {
  // Admin
  getAllOrders: (params?: { page?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Order>>>('/orders', { params }),

  updateStatus: (id: number, status: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),

  // Reseller
  getMyOrders: (params?: { page?: number }) =>
    api.get<ApiResponse<PaginatedResponse<Order>>>('/reseller/orders', { params }),

  // Customer
  createOrder: (data: {
    shop_id: number;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post<ApiResponse<Order>>('/orders', data),

  trackOrder: (orderNumber: string) =>
    api.get<ApiResponse<Order>>(`/orders/track/${orderNumber}`),

  simulatePayment: (orderId: number) =>
    api.post<ApiResponse<Order>>(`/orders/${orderId}/pay`),
};
