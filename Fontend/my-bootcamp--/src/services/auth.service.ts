import api from '@/lib/axios';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from '@/types';

export const authService = {
  loginAdmin: (data: LoginCredentials) =>
    api.post<{ token: string; email: string; role: string; message: string; user?: any; shop?: any }>('/admin/login', data),

  loginReseller: (data: LoginCredentials) =>
    api.post<{ token: string; email: string; role: string; message: string; user?: any; shop?: any }>('/login', data),

  register: (data: RegisterData) =>
    api.post<string>('/register', data),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('shop');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getShop: () => {
    const shop = localStorage.getItem('shop');
    return shop ? JSON.parse(shop) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};
