import api from '@/lib/axios';
import type { Order } from '@/types';

// Backend AdminOrderResponse structure
interface BackendOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  shopName: string;
  items: string[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const mapOrder = (o: BackendOrder): Order => ({
  id: o.id,
  order_number: o.orderNumber,
  shop_id: 0,
  customer_name: o.customerName,
  customer_phone: '',
  shipping_address: '',
  total_amount: o.totalAmount,
  reseller_profit: 0,
  status: (o.status?.toLowerCase() || 'pending') as 'pending' | 'shipped' | 'completed',
  created_at: o.createdAt,
  shop: { id: 0, user_id: 0, shop_name: o.shopName || '-', shop_slug: '' },
  items: o.items?.map((name, i) => ({
    id: i,
    order_id: o.id,
    product_id: 0,
    product_name: name,
    cost_price: 0,
    selling_price: 0,
    quantity: 1,
  })) || [],
});

export const orderService = {
  // Admin - GET /admin/orders
  getAllOrders: async (_params?: { page?: number; status?: string }) => {
    // Backend returns Page<AdminOrderResponse>
    const res = await api.get<{ content: BackendOrder[] }>('/admin/orders');
    const mapped = (res.data.content || []).map(mapOrder);
    return { data: { data: { data: mapped } } };
  },

  // Admin - POST /admin/orders/status?status=SHIPPED
  updateStatus: (id: number, status: string) =>
    api.post('/admin/orders/status', { orderId: id }, { params: { status: status.toUpperCase() } }),

  // Reseller
  getMyOrders: async (params?: { page?: number; size?: number }) => {
    const res = await api.get('/reseller/orders', { params });
    // Spring Data Page structure: { content: [], totalElements: ..., ... }
    const content = res.data.content || [];
    const mapped = content.map((o: any) => ({
      id: o.orderId,
      order_number: o.orderNumber,
      customer_name: o.customerName,
      customer_phone: '', // Not provided by reseller order response for privacy or simplicity
      total_amount: o.totalAmount,
      reseller_profit: o.myProfit,
      status: o.status.toLowerCase(),
      created_at: o.orderDate,
      items: (o.productDescription || '').split(' , ').map((desc: string, i: number) => {
        const parts = desc.split(' (');
        const name = parts[0];
        const qty = parts[1] ? parseInt(parts[1].replace(')', '')) : 1;
        return {
          product_name: name,
          quantity: qty,
        };
      }),
    }));
    
    return { data: { data: { data: mapped } } }; // Keep the expected wrapper for now to minimize frontend changes
  },

  // Customer
  createOrder: (data: {
    shop_id: number;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post('/shop/orders', data),

  trackOrder: (orderNumber: string) =>
    api.get(`/shop/orders/track/${orderNumber}`),

  getOrderById: (id: number) =>
    api.get(`/orders/${id}`),

  simulatePayment: (orderId: number) =>
    api.post(`/orders/${orderId}/pay`),
};
