import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Clock, ArrowRight, Calendar, ChevronDown, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { ResellerDashboardStats } from '@/types';


export default function ResellerDashboard() {
  const { shop } = useAuth();
  const [stats, setStats] = useState<ResellerDashboardStats>({
    total_profit: 0,
    total_orders: 0,
    pending_orders: 0,
    shop_link: '',
    recent_orders: []
  });
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30days');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  useEffect(() => {
    loadStats();
  }, [period, customDates]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const params: any = { period };
      if (period === 'custom' && customDates.start && customDates.end) {
        params.startDate = customDates.start;
        params.endDate = customDates.end;
      }
      const response = await dashboardService.getResellerStats(params);
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Ensure we use the latest slug from the shop object
  const shopUrl = shop?.shop_slug
    ? `${window.location.origin}/shop/${shop.shop_slug}`
    : `${window.location.origin}/shop/not-found`;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="ภาพรวมร้านค้า"
        subtitle="ตรวจสอบยอดขาย สรุปกำไร และสถานะการสั่งซื้อทั้งหมดของคุณ"
      >
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          {period === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <input
                type="date"
                value={customDates.start}
                onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 bg-white/50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <span className="text-neutral-400 text-xs font-bold">ถึง</span>
              <input
                type="date"
                value={customDates.end}
                onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 bg-white/50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          )}

          <div className="relative group/select">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white/80 border border-neutral-200/50 rounded-2xl text-xs font-black uppercase tracking-widest text-neutral-600 hover:text-neutral-900 hover:border-primary-500/30 transition-all cursor-pointer focus:outline-none shadow-sm"
            >
              <option value="today">วันนี้</option>
              <option value="yesterday">เมื่อวาน</option>
              <option value="7days">7 วันล่าสุด</option>
              <option value="30days">30 วันล่าสุด</option>
              <option value="thisMonth">เดือนนี้</option>
              <option value="thisYear">ปีนี้</option>
              <option value="custom">กำหนดช่วงเวลาเอง</option>
            </select>
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-hover/select:text-primary-500 transition-colors pointer-events-none" />
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-hover/select:text-primary-500 transition-colors pointer-events-none" />
          </div>
        </div>
      </PageHeader>

      {/* Stats Grid - Optimized for Tablet & Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="กำไรคาดการณ์"
          value={formatCurrency(stats.total_profit)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="คำสั่งซื้อทั้งหมด"
          value={stats.total_orders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <StatCard
          title="รอดำเนินการ"
          value={stats.pending_orders}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          className="glass-card bg-white/80 border-white/60 shadow-md"
        />
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-[2rem] p-6 shadow-lg relative overflow-hidden flex flex-col justify-between border border-primary-400/30">
          <div className="relative z-10">
            <p className="text-primary-100 text-sm font-medium mb-1.5">ลิงก์ร้านค้าของคุณ</p>
            <p className="text-lg font-bold mb-4 truncate" title={shopUrl}>
              {shop?.shop_name || 'ไม่ได้ตั้งชื่อร้าน'}
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <a
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2.5 rounded-xl transition-all w-full justify-center active:scale-95 border border-white/10"
            >
              ไปที่หน้าร้าน <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(shopUrl);
                  const btn = document.getElementById('copy-btn');
                  const iconCopy = document.getElementById('icon-copy');
                  const iconCheck = document.getElementById('icon-check');
                  const text = document.getElementById('copy-text');

                  if (btn && iconCopy && iconCheck && text) {
                    iconCopy.classList.add('hidden');
                    iconCheck.classList.remove('hidden');
                    text.innerText = 'คัดลอกแล้ว!';
                    btn.classList.add('bg-emerald-500/40');

                    setTimeout(() => {
                      iconCopy.classList.remove('hidden');
                      iconCheck.classList.add('hidden');
                      text.innerText = 'คัดลอกลิงก์';
                      btn.classList.remove('bg-emerald-500/40');
                    }, 2000);
                  }
                } else {
                  // Fallback for browsers that don't support navigator.clipboard
                  const textArea = document.createElement("textarea");
                  textArea.value = shopUrl;
                  document.body.appendChild(textArea);
                  textArea.select();
                  try {
                    document.execCommand('copy');
                    const text = document.getElementById('copy-text');
                    if (text) text.innerText = 'เข้าร้านค้ากันเลย!';
                    setTimeout(() => {
                      if (text) text.innerText = 'คัดลอกลิงก์';
                    }, 2000);
                  } catch (err) {
                    console.error('Fallback copy failed', err);
                  }
                  document.body.removeChild(textArea);
                }
              }}
              id="copy-btn"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all w-full justify-center active:scale-95 border border-white/5"
            >
              <Copy id="icon-copy" className="h-4 w-4" />
              <Check id="icon-check" className="h-4 w-4 hidden" />
              <span id="copy-text">คัดลอกลิงก์</span>
            </button>
          </div>
          {/* Decorative Background */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Sales Chart */}
      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">ภาพรวมยอดขายและกำไรคาดการณ์ 7 วันล่าสุด</h2>
            <p className="text-sm font-medium text-neutral-500 mt-1">ติดตามการเติบโตของร้านค้าคุณได้อย่างใกล้ชิด (รวมออเดอร์รอดำเนินการ)</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.sales_chart || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `฿${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `฿${value}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                formatter={(value: any, name: any) => [`฿${Number(value).toLocaleString()}`, name]}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
                name="ยอดขายสุทธิ"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="profit"
                stroke="#34d399"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
                name="กำไรของคุณ"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">คำสั่งซื้อล่าสุด</h2>
            <p className="text-sm font-medium text-neutral-500 mt-1">รายการสั่งซื้อใหม่จากหน้าร้านของคุณ</p>
          </div>
          <Link to="/reseller/orders" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            ดูทั้งหมด
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-100/80">
                <th className="px-4 py-4 text-left text-xs font-bold text-neutral-500 whitespace-nowrap">รหัสออเดอร์</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-neutral-500 whitespace-nowrap">ลูกค้า</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-neutral-500 whitespace-nowrap">วันที่</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-neutral-500 whitespace-nowrap">กำไร</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-neutral-500 whitespace-nowrap">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/80">
              {stats.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-neutral-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    +{formatCurrency(order.reseller_profit)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={cn(
                      "inline-flex px-3 py-1.5 rounded-full text-xs font-medium border",
                      order.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        order.status === 'shipped' ? "bg-primary-50 text-primary-700 border-primary-100" :
                          "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {order.status === 'completed' ? 'เสร็จสิ้น' : order.status === 'shipped' ? 'จัดส่งแล้ว' : 'รอดำเนินการ'}
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