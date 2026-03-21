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
  resellerProfit: number;
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
  reseller_profit: o.resellerProfit || 0,
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
  getAllOrders: async (params?: { page?: number; size?: number; status?: string }) => {
    // Backend returns Page<AdminOrderResponse>
    const res = await api.get('/admin/orders', { params });
    const content = res.data.content || [];
    const mapped = content.map(mapOrder);

    return {
      data: {
        content: mapped,
        totalPages: res.data.totalPages || 0,
        totalElements: res.data.totalElements || 0,
        number: res.data.number || 0,
        size: res.data.size || 10
      }
    };
  },

  // Admin - POST /admin/orders/status?status=shipped
  updateStatus: (id: number, status: string) =>
    api.post('/admin/orders/status', { orderId: id }, { params: { status: status.toLowerCase() } }),

  // Reseller
  getMyOrders: async (params?: { page?: number; size?: number }) => {
    const res = await api.get('/reseller/orders', { params });
    // Spring Data Page structure: { content: [], totalElements: ..., ... }
    const content = res.data.content || [];
    const mapped = content.map((o: any) => ({
      id: o.orderId,
      order_number: o.orderNumber,
      customer_name: o.customerName,
      customer_phone: o.customerPhone || '',
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

    return {
      data: {
        content: mapped,
        totalPages: res.data.totalPages || 0,
        totalElements: res.data.totalElements || 0,
        number: res.data.number || 0,
        size: res.data.size || 10
      }
    };
  },

  // Customer
  createOrder: (slug: string, data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: { productId: number; quantity: number }[];
  }) => api.post(`/customer/shop/${slug}/checkout`, data),

  trackOrder: async (orderNumber: string) => {
    const res = await api.get('/customer/track-order', { params: { orderNumber } });
    const o = res.data;
    if (!o) return res;

    // Map TrackOrderResponse to Frontend Order type
    const mapped: Order = {
      id: 0,
      order_number: o.orderNumber,
      shop_id: 0,
      customer_name: o.customerName || '-',
      customer_phone: o.customerPhone || '-',
      shipping_address: o.shippingAddress,
      total_amount: o.totalAmount,
      reseller_profit: 0,
      status: (o.status?.toLowerCase() || 'pending') as any,
      created_at: o.createdAt,
      items: (o.items || []).map((item: any, i: number) => {
        // Now it's an object from TrackOrderItemResponse
        return {
          id: i,
          order_id: 0,
          product_id: 0,
          product_name: item.productName || '-',
          cost_price: 0,
          selling_price: item.sellingPrice || 0,
          quantity: item.quantity || 1,
        };
      }),
    };

    return { data: { data: mapped } };
  },

  getOrderById: (slug: string, id: number) =>
    api.get(`/customer/shop/${slug}/order/${id}`),

  simulatePayment: (slug: string, orderId: number) =>
    api.post(`/customer/shop/${slug}/payment/${orderId}`),

  getShops: async () => {
    const res = await api.get('/customer/shop');
    return res.data;
  },

  /** API #1: Get all reseller shops with approved status (for landing page) */
  getApprovedShops: async () => {
    const res = await api.get('/customer/approved-shops');
    return res.data;
  },

  /** API #2: Get products of a specific approved shop by slug (for shop detail page) */
  getApprovedShopProducts: async (slug: string, page: number = 0, size: number = 15) => {
    const res = await api.get(`/customer/approved-shops/${slug}/products`, { params: { page, size } });
    return res.data;
  },

  getUnreadNotificationsCount: async () => {
    const res = await api.get('/reseller/orders/unread-count');
    return res.data as number;
  },

  markNotificationsAsRead: () =>
    api.post('/reseller/orders/mark-read'),
};
