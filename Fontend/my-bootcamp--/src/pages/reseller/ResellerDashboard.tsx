import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { ResellerDashboardStats } from '@/types';

const mockStats: ResellerDashboardStats = {
  total_profit: 24500,
  total_orders: 45,
  pending_orders: 5,
  shop_link: '',
  recent_orders: [
    { id: 1, order_number: 'ORD-123456', shop_id: 1, customer_name: 'สมชาย', customer_phone: '', shipping_address: '', total_amount: 1500, reseller_profit: 300, status: 'pending', created_at: '2025-03-12' },
    { id: 2, order_number: 'ORD-789012', shop_id: 1, customer_name: 'สมหญิง', customer_phone: '', shipping_address: '', total_amount: 800, reseller_profit: 150, status: 'shipped', created_at: '2025-03-11' },
    { id: 3, order_number: 'ORD-345678', shop_id: 1, customer_name: 'วินัย', customer_phone: '', shipping_address: '', total_amount: 2200, reseller_profit: 400, status: 'completed', created_at: '2025-03-10' },
  ],
};

export default function ResellerDashboard() {
  const { shop } = useAuth();
  const [stats, setStats] = useState<ResellerDashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getResellerStats();
      setStats(response.data.data);
    } catch {
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const shopUrl = `${window.location.origin}/shop/${shop?.shop_slug}`;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store performance" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats.total_profit)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending_orders}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <div className="card p-6 bg-primary-600 text-white border-0">
          <p className="text-primary-100 text-sm font-medium mb-2">Your Shop Link</p>
          <p className="text-lg font-bold mb-4 truncate" title={shopUrl}>
            {shop?.shop_name}
          </p>
          <a
            href={shopUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors w-full justify-center"
          >
            Visit Shop <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-0.5">Latest transactions from your shop</p>
          </div>
          <Link to="/reseller/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                    +{formatCurrency(order.reseller_profit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
