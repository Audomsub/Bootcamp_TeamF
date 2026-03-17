import api from '@/lib/axios';
import type { AdminDashboardStats, ResellerDashboardStats, ApiResponse } from '@/types';

export const dashboardService = {
  getAdminStats: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard', { params }),

  getResellerStats: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get<ApiResponse<ResellerDashboardStats>>('/reseller/dashboard', { params }),
};
