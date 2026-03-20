import api from '@/lib/axios';
import type { User } from '@/types';

// Backend UsersEntity structure (camelCase from Spring Boot JSON)
interface BackendUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  address: string;
  createdAt: string;
  shop?: {
    shop_name: string;
  };
}

interface ResellerUser extends User {
  shop?: { shop_name: string };
}

const mapUser = (u: any): ResellerUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone || '-',
  role: (u.role?.toLowerCase() || 'reseller') as 'admin' | 'reseller',
  status: (u.status?.toLowerCase() || 'pending') as 'pending' | 'approved' | 'rejected',
  address: u.address || '',
  created_at: u.createdAt || u.created_at || '',
  shop: u.shop ? {
    shop_name: u.shop.shop_name
  } : undefined
});

export const resellerService = {
  // GET /admin/resellers
  getAll: async (_params?: { page?: number; status?: string }) => {
    const res = await api.get<BackendUser[]>('/admin/resellers');
    const mapped = res.data.map(mapUser);
    return { data: { data: { data: mapped } } };
  },

  // POST /admin/reseller/{id}/status?status=approved
  approve: (id: number) =>
    api.post(`/admin/reseller/${id}/status`, null, { params: { status: 'approved' } }),

  // POST /admin/reseller/{id}/status?status=rejected
  reject: (id: number) =>
    api.post(`/admin/reseller/${id}/status`, null, { params: { status: 'rejected' } }),
};
