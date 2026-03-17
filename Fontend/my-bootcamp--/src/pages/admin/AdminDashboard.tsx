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
        title={`ภาพรวมแดชบอร์ด`}
        subtitle={`ยินดีต้อนรับกลับ ${user?.name || 'ผู้ดูแลระบบ'} นี่คือสรุปผลประกอบการทางธุรกิจปัจจุบันของคุณ`}
      >
        <div className="flex items-center gap-3 px-6 py-3 glass-card !rounded-2xl border-white/60">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-s font-medium text-neutral-700 pt-0.5">
            สถานะระบบ: ทำงานปกติ
          </span>
        </div>
      </PageHeader>

      {/* Stats Grid - High Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="ยอดขายรวม (จัดส่งแล้ว)"
          value={formatCurrency(stats.total_sales)}
          icon={DollarSign}
          iconColor="text-primary-500"
          iconBg="bg-primary-500/5"
          subtitle="คำสั่งซื้อที่จัดส่งและเสร็จสมบูรณ์"
        />
        <StatCard
          title="จ่ายกำไรแล้วรวม"
          value={formatCurrency(stats.total_reseller_profit)}
          icon={TrendingUp}
          iconColor="text-accent-500"
          iconBg="bg-accent-500/5"
          subtitle="ผลรวมกระเป๋าเงินตัวแทนจำหน่ายทั้งหมด"
        />
        <StatCard
          title="คำสั่งซื้อรวมทั้งหมด"
          value={stats.total_orders}
          icon={ShoppingCart}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/5"
          subtitle="ปริมาณออเดอร์ทั้งหมดในระบบ"
        />
        <StatCard
          title="รอดำเนินการ"
          value={stats.pending_orders}
          icon={Clock}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/5"
          subtitle="คำสั่งซื้อที่กำลังรอการจัดส่ง"
        />
        <StatCard
          title="ตัวแทนจำหน่ายที่ใช้งานอยู่"
          value={stats.total_resellers}
          icon={Users}
          iconColor="text-neutral-900"
          iconBg="bg-neutral-900/5"
          subtitle="พาร์ทเนอร์ที่ได้รับการอนุมัติแล้ว"
        />
        <StatCard
          title="คิวรออนุมัติ"
          value={stats.pending_resellers}
          icon={UserCheck}
          iconColor="text-accent-600"
          iconBg="bg-accent-500/5"
          subtitle="ผู้สมัครที่กำลังรอการตรวจสอบ"
        />
      </div>

      {/* Advanced Analytics Board */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

        <div className="card !p-0 overflow-hidden !bg-white/90 backdrop-blur-xl border-white/60 shadow-xl relative rounded-[2rem]">
          <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">การวิเคราะห์ยอดขาย</h2>
              <p className="text-sm font-medium text-neutral-500 mt-1">แนวโน้มการเติบโตของรายได้ในระบบ</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100/80 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                <span className="text-xs font-semibold text-neutral-600">ปริมาณรวม</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100/80 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500"></div>
                <span className="text-xs font-semibold text-neutral-600">อัตราการเติบโต</span>
              </div>
            </div>
          </div>

          <div className="p-8 pt-6">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.sales_chart} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.52 0.25 260)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="oklch(0.52 0.25 260)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
                    }}
                    tick={{ fontSize: 12, fill: '#737373', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dy={15}
                  />
                  <YAxis
                    tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 12, fill: '#737373', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-15}
                  />
                  <Tooltip
                    cursor={{ stroke: 'oklch(0.52 0.25 260)', strokeWidth: 2, strokeDasharray: '6 6' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 p-5 shadow-xl border border-neutral-100 rounded-2xl">
                            <p className="text-xs font-medium text-neutral-500 mb-2">{formatDate(label as string)}</p>
                            <div className="flex items-end gap-3">
                              <p className="text-2xl font-bold text-neutral-800 tracking-tight">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                              <div className="mb-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                                เติบโต +12%
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
                    strokeWidth={4}
                    fill="url(#primaryGradient)"
                    animationDuration={1500}
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: 'oklch(0.52 0.25 260)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-neutral-50/70 p-8 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex gap-16">
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-500">ยอดสูงสุดปัจจุบัน</p>
                <p className="text-xl font-bold text-neutral-800 tracking-tight">฿42,000.00</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-500">อัตราความสำเร็จ</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-emerald-600 tracking-tight">98.4%</p>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
            </div>
            <button className="btn-secondary !px-8 font-medium">ส่งออกรายงานยอดขาย</button>
          </div>
        </div>
      </div>

      {/* Secondary Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Reseller Leaderboard */}
        <div className="glass-card !bg-white/80 border-white/60 shadow-xl overflow-hidden flex flex-col rounded-[2rem]">
          <div className="p-8 border-b border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-800 tracking-tight">สุดยอดตัวแทนจำหน่าย</h3>
            <p className="text-sm font-medium text-neutral-500 mt-1">ผลการดำเนินงานของพาร์ทเนอร์ชั้นนำ</p>
          </div>
          <div className="flex-1 p-6 space-y-3">
            {(stats as any).reseller_leaderboard?.map((reseller: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-neutral-50 hover:shadow-md hover:border-neutral-100 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center font-bold text-primary-600 text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800">{reseller.name}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{reseller.shop}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-800">{formatCurrency(reseller.sales)}</p>
                  <p className="text-xs font-medium text-accent-600 mt-0.5">{reseller.orders} คำสั่งซื้อ</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 bg-neutral-50 border-t border-neutral-100">
            <button className="w-full py-2 text-sm font-semibold text-neutral-600 hover:text-primary-600 transition-colors">
              ดูพาร์ทเนอร์ทั้งหมด
            </button>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-card !bg-white/80 border-white/60 shadow-xl overflow-hidden flex flex-col rounded-[2rem]">
          <div className="p-8 border-b border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-800 tracking-tight">สัดส่วนยอดขาย</h3>
            <p className="text-sm font-medium text-neutral-500 mt-1">ส่วนแบ่งการตลาดแบ่งตามหมวดหมู่สินค้า</p>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[350px]">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={(stats as any).category_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  stroke="none"
                >
                  {(stats as any).category_distribution?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 500, fontSize: '12px', fontFamily: 'inherit' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm font-medium text-neutral-600 px-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="p-6 bg-neutral-50/70 border-t border-neutral-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 mb-1">หมวดหมู่หลัก</p>
                <p className="text-sm font-bold text-neutral-800">เครื่องแต่งกาย (45%)</p>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-sm border border-neutral-100">
                <p className="text-xs font-medium text-neutral-500 mb-1">กลุ่มที่กำลังเติบโต</p>
                <p className="text-sm font-bold text-emerald-600">อิเล็กทรอนิกส์ (+12%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}