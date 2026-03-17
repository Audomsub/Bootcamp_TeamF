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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatCard, PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AdminDashboardStats } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

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
    { date: '2025-03-01', amount: 12000, profit: 2400 },
    { date: '2025-03-02', amount: 18000, profit: 3600 },
    { date: '2025-03-03', amount: 15000, profit: 3000 },
    { date: '2025-03-04', amount: 22000, profit: 4400 },
    { date: '2025-03-05', amount: 28000, profit: 5600 },
    { date: '2025-03-06', amount: 25000, profit: 5000 },
    { date: '2025-03-07', amount: 32000, profit: 6400 },
    { date: '2025-03-08', amount: 29000, profit: 5800 },
    { date: '2025-03-09', amount: 35000, profit: 7000 },
    { date: '2025-03-10', amount: 31000, profit: 6200 },
    { date: '2025-03-11', amount: 38000, profit: 7600 },
    { date: '2025-03-12', amount: 42000, profit: 8400 },
  ],
  reseller_leaderboard: [
    { name: 'John Doe', shop: 'JD Store', sales: 85200, orders: 42 },
    { name: 'Jane Smith', shop: 'JS Shop', sales: 64500, orders: 31 },
    { name: 'Bob Wilson', shop: 'BW Mart', sales: 42100, orders: 19 },
    { name: 'Alice Brown', shop: 'AB Collection', sales: 38900, orders: 18 },
  ],
  category_distribution: [
    { name: 'Apparel', value: 45 },
    { name: 'Electronics', value: 25 },
    { name: 'Accessories', value: 20 },
    { name: 'Footwear', value: 10 },
  ],
};

const COLORS = ['oklch(0.52 0.25 260)', 'oklch(0.62 0.17 180)', 'oklch(0.72 0.15 80)', 'oklch(0.55 0.2 30)'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getAdminStats();
      setStats(response.data.data);
    } catch {
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-12">
      <PageHeader
        title={`Dashboard Overview`}
        subtitle={`Welcome back, ${user?.name || 'Administrator'}. Here is your current business performance summary.`}
      >
        <div className="flex items-center gap-3 px-6 py-3 glass-card !rounded-2xl border-white/60">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-neutral-900 uppercase tracking-[0.2em] pt-0.5">
            System Status: Active
          </span>
        </div>
      </PageHeader>

      {/* Stats Grid - High Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Total Sales (Delivered)"
          value={formatCurrency(stats.total_sales)}
          icon={DollarSign}
          iconColor="text-primary-500"
          iconBg="bg-primary-500/5"
          subtitle="Orders Shipped/Completed"
        />
        <StatCard
          title="Total Profit Paid"
          value={formatCurrency(stats.total_reseller_profit)}
          icon={TrendingUp}
          iconColor="text-accent-500"
          iconBg="bg-accent-500/5"
          subtitle="Sum of all Reseller Wallets"
        />
        <StatCard
          title="Grand Total Orders"
          value={stats.total_orders}
          icon={ShoppingCart}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/5"
          subtitle="Total volume in system"
        />
        <StatCard
          title="Pending Process"
          value={stats.pending_orders}
          icon={Clock}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/5"
          subtitle="Orders awaiting shipment"
        />
        <StatCard
          title="Active Resellers"
          value={stats.total_resellers}
          icon={Users}
          iconColor="text-neutral-900"
          iconBg="bg-neutral-900/5"
          subtitle="Approved partners"
        />
        <StatCard
          title="Approval Queue"
          value={stats.pending_resellers}
          icon={UserCheck}
          iconColor="text-accent-600"
          iconBg="bg-accent-500/5"
          subtitle="Applicants awaiting review"
        />
      </div>

      {/* Advanced Analytics Board */}
      <div className="relative group">
        {/* Visual Gimmick: Blurred background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

        <div className="card !p-0 overflow-hidden !bg-white/90 backdrop-blur-xl border-white/60 shadow-2xl relative">
          <div className="p-10 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tighter uppercase italic">Sales Analytics</h2>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mt-2 italic">Revenue Growth Trends</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Total Volume</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Growth Rate</span>
              </div>
            </div>
          </div>

          <div className="p-10 pt-6">
            <div className="h-[480px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.sales_chart} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.52 0.25 260)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="oklch(0.52 0.25 260)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.91 0.01 240)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    }}
                    tick={{ fontSize: 10, fill: 'oklch(0.42 0.02 240)', fontWeight: 900, letterSpacing: '0.05em' }}
                    axisLine={false}
                    tickLine={false}
                    dy={20}
                  />
                  <YAxis
                    tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 10, fill: 'oklch(0.42 0.02 240)', fontWeight: 900 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-15}
                  />
                  <Tooltip
                    cursor={{ stroke: 'oklch(0.52 0.25 260)', strokeWidth: 2, strokeDasharray: '8 8' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-card !bg-neutral-900/95 !p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border-white/10">
                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{formatDate(label as string)}</p>
                            <div className="flex items-end gap-3">
                              <p className="text-3xl font-black text-white tracking-tighter">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                              <div className="mb-1 text-accent-500 text-[10px] font-black uppercase tracking-widest bg-accent-500/10 px-2 py-0.5 rounded-md italic">
                                +12% Growth
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="oklch(0.52 0.25 260)"
                    strokeWidth={6}
                    fill="url(#primaryGradient)"
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                    activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4, fill: 'oklch(0.52 0.25 260)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-neutral-50/50 p-10 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex gap-16">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Current Peak</p>
                <p className="text-xl font-black text-neutral-900 tracking-tight">฿42,000.00</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Efficiency Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black text-accent-600 tracking-tight">98.4% Success</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-ping"></div>
                </div>
              </div>
            </div>
            <button className="btn-secondary !px-10">Export Sales Report</button>
          </div>
        </div>
      </div>
      {/* Secondary Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Reseller Leaderboard */}
        <div className="glass-card !bg-white/80 border-white/60 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-neutral-100">
            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter italic">Top Resellers</h3>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">Leading Partner Performance</p>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {(stats as any).reseller_leaderboard?.map((reseller: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50/50 hover:bg-white hover:shadow-lg transition-all duration-500 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center font-black text-primary-600">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 tracking-tight">{reseller.name}</h4>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{reseller.shop}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-neutral-900">{formatCurrency(reseller.sales)}</p>
                  <p className="text-[10px] font-black text-accent-600 uppercase tracking-widest">{reseller.orders} Orders</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-neutral-50 border-t border-neutral-100">
            <button className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-primary-600 transition-colors">View All Partners</button>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card !bg-white/80 border-white/60 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-neutral-100">
            <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tighter italic">Market Share</h3>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">Sales Distribution by Category</p>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[350px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={(stats as any).category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={2000}
                >
                  {(stats as any).category_distribution?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 px-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="p-8 bg-neutral-50/50 border-t border-neutral-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-100">
                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Primary Driver</p>
                <p className="text-sm font-black text-neutral-900">Apparel (45%)</p>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-100">
                <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">Emerging Sector</p>
                <p className="text-sm font-black text-accent-600">Electronics (+12%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
