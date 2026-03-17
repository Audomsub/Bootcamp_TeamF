import api from '@/lib/axios';
import type { AdminDashboardStats, ResellerDashboardStats, ApiResponse } from '@/types';

export const dashboardService = {
  getAdminStats: () =>
    api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard'),

  getResellerStats: () =>
    api.get<ApiResponse<ResellerDashboardStats>>('/reseller/dashboard'),
};
