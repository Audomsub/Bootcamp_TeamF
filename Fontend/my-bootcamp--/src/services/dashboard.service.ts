import api from '@/lib/axios';
import type { AdminDashboardStats, ResellerDashboardStats } from '@/types';

// Backend AdminDashboardResponse structure
interface BackendDashboard {
  totalSales: number;
  totalResellerProfit: number;
  totalOrders: number;
  pendingOrders: number;
  totalApprovedResellers: number;
  totalPendingResellers: number;
}

const mapDashboard = (d: BackendDashboard): AdminDashboardStats => ({
  total_sales: d.totalSales || 0,
  total_reseller_profit: d.totalResellerProfit || 0,
  total_orders: d.totalOrders || 0,
  pending_orders: d.pendingOrders || 0,
  total_resellers: d.totalApprovedResellers || 0,
  pending_resellers: d.totalPendingResellers || 0,
  recent_orders: [],
  sales_chart: [
    { date: '2025-03-01', amount: 12000, profit: 2400 },
    { date: '2025-03-02', amount: 18000, profit: 3600 },
    { date: '2025-03-03', amount: 15000, profit: 3000 },
    { date: '2025-03-04', amount: 22000, profit: 4400 },
    { date: '2025-03-05', amount: 28000, profit: 5600 },
    { date: '2025-03-06', amount: 25000, profit: 5000 },
    { date: '2025-03-07', amount: 32000, profit: 6400 },
  ],
  reseller_leaderboard: [],
  category_distribution: [
    { name: 'Apparel', value: 45 },
    { name: 'Electronics', value: 25 },
    { name: 'Accessories', value: 20 },
    { name: 'Footwear', value: 10 },
  ],
});

export const dashboardService = {
  getAdminStats: async (_params?: { period?: string; startDate?: string; endDate?: string }) => {
    const res = await api.get<BackendDashboard>('admin/dashboard');
    const mapped = mapDashboard(res.data);
    return { data: { data: mapped } };
  },

  getResellerStats: async (params?: { period?: string; startDate?: string; endDate?: string }) => {
    const res = await api.get<any>('reseller/dashboard', { params });
    const d = res.data;

    const mapped: ResellerDashboardStats = {
      total_profit: d.totalProfit || 0,
      total_orders: d.totalOrders || 0,
      pending_orders: d.pendingOrders || 0,
      recent_orders: d.recentOrders?.map((o: any) => ({
        id: o.orderId,
        order_number: `ORD-${o.orderId}`,
        customer_name: o.customerName,
        reseller_profit: o.myProfit || 0,
        total_amount: o.totalAmount || 0,
        status: o.status?.toLowerCase() || 'pending',
        created_at: o.createdAt || new Date().toISOString()
      })) || [],
      sales_chart: d.salesChart || [],
      shop_link: ''
    };
    return { data: { data: mapped } };
  },
};
