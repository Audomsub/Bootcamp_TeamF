// ─── User ────────────────────────────────────────
export type UserRole = 'admin' | 'reseller';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  address: string;
  created_at: string;
}

// ─── Shop ────────────────────────────────────────
export interface Shop {
  id: number;
  user_id: number;
  shop_name: string;
  shop_slug: string;
}

// ─── Product ─────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  cost_price: number;
  min_price: number;
  stock: number;
  is_added?: boolean;
  created_at: string;
}

// ─── Shop Product ────────────────────────────────
export interface ShopProduct {
  id: number;
  shop_id: number;
  product_id: number;
  selling_price: number;
  product?: Product;
}

// ─── Order ───────────────────────────────────────
export type OrderStatus = 'pending' | 'shipped' | 'completed';

export interface Order {
  id: number;
  order_number: string;
  shop_id: number;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  reseller_profit: number;
  status: OrderStatus;
  created_at: string;
  shop?: Shop;
  items?: OrderItem[];
}

// ─── Order Item ──────────────────────────────────
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
}

// ─── Wallet ──────────────────────────────────────
export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
}

export interface WalletLog {
  id: number;
  wallet_id: number;
  order_id: number;
  amount: number;
  created_at: string;
  order?: Order;
}

// ─── Auth ────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  shopName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  shop?: Shop;
}

// ─── Dashboard Stats ─────────────────────────────
export interface AdminDashboardStats {
  total_sales: number;
  total_reseller_profit: number;
  total_orders: number;
  pending_orders: number;
  total_resellers: number;
  pending_resellers: number;
  recent_orders: Order[];
  sales_chart: { date: string; amount: number; profit?: number }[];
  reseller_leaderboard?: { name: string; shop: string; sales: number; orders: number }[];
  category_distribution?: { name: string; value: number }[];
}

export interface ResellerDashboardStats {
  total_profit: number;
  total_orders: number;
  pending_orders: number;
  shop_link: string;
  recent_orders: Order[];
  sales_chart?: { date: string; amount: number; profit?: number }[];
}

// ─── API Response ────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
