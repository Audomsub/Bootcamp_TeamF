import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  UserPlus,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { PageHeader, LoadingSpinner, StatCard } from '@/components/ui/shared';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardData {
  total_sales: number;
  total_reseller_profit: number;
  total_orders: number;
  pending_orders: number;
  total_resellers: number;
  pending_resellers: number;
}

const PIE_COLORS = ['#4F46E5', '#06B6D4'];
const BAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardService.getAdminStats();
      if (response?.data?.data) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader title="ภาพรวมระบบ" subtitle="Dashboard" />
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
          <p className="text-red-500 font-medium">{error || 'ไม่พบข้อมูล'}</p>
          <button onClick={loadStats} className="mt-4 px-6 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors">
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // คำนวณข้อมูลสรุป
  const completedOrders = stats.total_orders - stats.pending_orders;
  const avgOrderValue = stats.total_orders > 0 ? stats.total_sales / stats.total_orders : 0;
  const completionRate = stats.total_orders > 0 ? (completedOrders / stats.total_orders) * 100 : 0;
  const profitRate = stats.total_sales > 0 ? (stats.total_reseller_profit / stats.total_sales) * 100 : 0;
  const adminRevenue = stats.total_sales - stats.total_reseller_profit;

  const revenueBreakdown = [
    { name: 'รายได้แอดมิน', value: adminRevenue },
    { name: 'กำไรตัวแทน', value: stats.total_reseller_profit },
  ];

  const overviewBarData = [
    { name: 'ยอดขาย', value: stats.total_sales, fill: BAR_COLORS[0] },
    { name: 'กำไรตัวแทน', value: stats.total_reseller_profit, fill: BAR_COLORS[1] },
    { name: 'รายได้แอดมิน', value: adminRevenue, fill: BAR_COLORS[2] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="ภาพรวมระบบ"
        subtitle={`ยินดีต้อนรับ ${user?.name || 'ผู้ดูแลระบบ'} — ข้อมูลสรุปจากระบบจริง`}
      />

      {/* ── Stat Cards optimized for Tablet/Desktop ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="ยอดขายรวม"
          value={formatCurrency(stats.total_sales)}
          subtitle="ออเดอร์ที่จัดส่ง/เสร็จสมบูรณ์"
          icon={DollarSign}
          color="emerald"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="กำไรตัวแทนรวม"
          value={formatCurrency(stats.total_reseller_profit)}
          subtitle="ผลรวมกระเป๋าเงินตัวแทนทั้งหมด"
          icon={TrendingUp}
          color="primary"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="คำสั่งซื้อทั้งหมด"
          value={stats.total_orders.toLocaleString()}
          subtitle="ออเดอร์ทั้งหมดในระบบ"
          icon={ShoppingCart}
          color="indigo"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="รอดำเนินการ"
          value={stats.pending_orders.toLocaleString()}
          subtitle="คำสั่งซื้อรอจัดส่ง"
          icon={Clock}
          color="amber"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="ตัวแทนที่อนุมัติ"
          value={stats.total_resellers.toLocaleString()}
          subtitle="พาร์ทเนอร์ที่ใช้งานอยู่"
          icon={Users}
          color="primary"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="รออนุมัติ"
          value={stats.pending_resellers.toLocaleString()}
          subtitle="ผู้สมัครรอการตรวจสอบ"
          icon={UserPlus}
          color="rose"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart - เปรียบเทียบรายได้ */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-800">เปรียบเทียบรายได้</h3>
            <p className="text-sm text-neutral-500 mt-1">ยอดขาย vs กำไรตัวแทน vs รายได้แอดมิน</p>
          </div>
          <div className="p-6">
            <div className="h-[250px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewBarData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(val: any) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 shadow-xl border border-neutral-100 rounded-xl">
                            <p className="text-xs text-neutral-500 mb-1">{payload[0].payload.name}</p>
                            <p className="text-lg font-bold text-neutral-800">{formatCurrency(payload[0].value)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {overviewBarData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Donut Chart - สัดส่วนรายได้ */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-bold text-neutral-800">สัดส่วนรายได้</h3>
            <p className="text-sm text-neutral-500 mt-1">แอดมิน vs ตัวแทนจำหน่าย</p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[280px]">
            {stats.total_sales > 0 ? (
              <>
                <div className="h-[180px] sm:h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        animationDuration={1000}
                        stroke="none"
                      >
                        {revenueBreakdown.map((_, index) => (
                          <Cell key={`pie-${index}`} fill={PIE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }: any) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 shadow-lg border border-neutral-100 rounded-xl text-sm">
                                <p className="font-medium text-neutral-700">{payload[0].name}</p>
                                <p className="font-bold text-neutral-900">{formatCurrency(payload[0].value)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-3 mt-2 w-full">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[0] }} />
                      <span className="text-sm text-neutral-600">รายได้แอดมิน</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-800">{(100 - profitRate).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[1] }} />
                      <span className="text-sm text-neutral-600">กำไรตัวแทน</span>
                    </div>
                    <span className="text-sm font-bold text-neutral-800">{profitRate.toFixed(1)}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-400 py-10">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">ยังไม่มีข้อมูลรายได้</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard icon={ArrowUpRight} color="emerald" label="ค่าเฉลี่ยต่อออเดอร์" value={formatCurrency(avgOrderValue)} />
        <SummaryCard icon={TrendingUp} color="primary" label="อัตรากำไรตัวแทน" value={`${profitRate.toFixed(1)}%`} />
        <SummaryCard icon={Package} color="indigo" label="ออเดอร์สำเร็จ" value={`${completedOrders.toLocaleString()} (${completionRate.toFixed(1)}%)`} />
        <SummaryCard icon={Clock} color="amber" label="ออเดอร์ค้างส่ง" value={`${stats.pending_orders.toLocaleString()} รายการ`} />
      </div>
    </div>
  );
}

// ── Sub Components ──

function SummaryCard({ icon: Icon, color, label, value }: {
  icon: any; color: 'primary' | 'emerald' | 'amber' | 'rose' | 'indigo'; label: string; value: string;
}) {
  const bgMap: Record<string, string> = {
    primary: 'bg-primary-50', emerald: 'bg-emerald-50', indigo: 'bg-indigo-50', amber: 'bg-amber-50',
  };
  const textMap: Record<string, string> = {
    primary: 'text-primary-500', emerald: 'text-emerald-500', indigo: 'text-indigo-500', amber: 'text-amber-500',
  };

  return (
    <div className="glass-card bg-white/80 border-white/60 p-5 shadow-md rounded-[1.5rem] group hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3", bgMap[color] || 'bg-neutral-100')}>
          <Icon className={cn("w-4 h-4", textMap[color] || 'text-neutral-500')} />
        </div>
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <p className="text-xl font-black text-neutral-900 tracking-tight">{value}</p>
    </div>
  );
}