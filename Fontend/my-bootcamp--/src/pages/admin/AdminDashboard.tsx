import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard, PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AdminDashboardStats } from '@/types';

// Mock data for demo
const mockStats: AdminDashboardStats = {
  total_sales: 285400,
  total_reseller_profit: 42600,
  total_orders: 156,
  pending_orders: 12,
  total_resellers: 24,
  pending_resellers: 3,
  recent_orders: [],
  sales_chart: [
    { date: '2025-03-01', amount: 12000 },
    { date: '2025-03-02', amount: 18000 },
    { date: '2025-03-03', amount: 15000 },
    { date: '2025-03-04', amount: 22000 },
    { date: '2025-03-05', amount: 28000 },
    { date: '2025-03-06', amount: 25000 },
    { date: '2025-03-07', amount: 32000 },
    { date: '2025-03-08', amount: 29000 },
    { date: '2025-03-09', amount: 35000 },
    { date: '2025-03-10', amount: 31000 },
    { date: '2025-03-11', amount: 38000 },
    { date: '2025-03-12', amount: 42000 },
  ],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getAdminStats();
      setStats(response.data.data);
    } catch {
      // Use mock data on error
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your reseller management system"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.total_sales)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          trend={{ value: 12.5, label: 'vs last month' }}
        />
        <StatCard
          title="Total Reseller Profit"
          value={formatCurrency(stats.total_reseller_profit)}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          trend={{ value: 8.2, label: 'vs last month' }}
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          trend={{ value: 15.3, label: 'vs last month' }}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending_orders}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Total Resellers"
          value={stats.total_resellers}
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Pending Resellers"
          value={stats.pending_resellers}
          icon={UserCheck}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Sales Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Daily sales for the last 12 days</p>
        </div>
        <div className="card-body">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales_chart}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value as number), 'Sales']}
                  labelFormatter={(label) => formatDate(label)}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
