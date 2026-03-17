import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ShoppingCart,
  Wallet,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/reseller/dashboard', icon: LayoutDashboard, label: 'แดชบอร์ด' },
  { to: '/reseller/catalog', icon: ShoppingBag, label: 'แคตตาล็อกสินค้า' },
  { to: '/reseller/my-products', icon: Package, label: 'สินค้าของฉัน' },
  { to: '/reseller/orders', icon: ShoppingCart, label: 'รายการสั่งซื้อ' },
  { to: '/reseller/wallet', icon: Wallet, label: 'กระเป๋าเงิน' },
];

const pageTitles: Record<string, string> = {
  'dashboard': 'แดชบอร์ด',
  'catalog': 'แคตตาล็อกสินค้า',
  'my-products': 'สินค้าของฉัน',
  'orders': 'รายการสั่งซื้อ',
  'wallet': 'กระเป๋าเงิน',
};

export default function ResellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, shop, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /*system time*/
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen mesh-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Emerald Executive Look */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-80 bg-neutral-900 border-r border-accent-500/10 transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.5)]' : '-translate-x-full'
        )}
      >
        {/* Shop Branding Section - High Fidelity */}
        <div className="h-44 flex flex-col justify-center px-10 relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-500/5 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="relative">
              <div className="absolute -inset-3 bg-accent-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative w-16 h-16 bg-neutral-800 border border-white/5 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">
                <Store className="h-8 w-8 text-accent-400 group-hover:text-accent-300 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent rounded-3xl"></div>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-display font-black text-xl tracking-tighter text-white truncate leading-none group-hover:text-accent-400 transition-colors">
                {shop?.shop_name || 'ร้านค้าของฉัน'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse"></div>
                <p className="text-[10px] font-black tracking-[0.3em] text-accent-600 uppercase leading-none">
                  ระบบตัวแทนจำหน่าย
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Separator */}
        <div className="px-10 mb-8">
          <div className="h-px w-full bg-gradient-to-r from-accent-500/20 via-white/5 to-transparent"></div>
        </div>

        {/* Navigation - Emerald Elite Look */}
        <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
          <div className="px-6 mb-6">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-1">เมนูหลัก</p>
            <div className="h-0.5 w-8 bg-accent-500/30 rounded-full"></div>
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  'hover:bg-white/5 active:scale-[0.98]',
                  isActive
                    ? 'bg-accent-500/10 text-white'
                    : 'text-neutral-400 hover:text-white'
                )}
              >
                {/* Laser Active Indicator - Emerald */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-accent-500 rounded-r-full shadow-[0_0_15px_oklch(0.62_0.25_160)] animate-in slide-in-from-left duration-700"></div>
                    <div className="absolute right-6 w-1 h-1 rounded-full bg-accent-400 shadow-[0_0_8px_oklch(0.62_0.25_160)]"></div>
                  </>
                )}

                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isActive
                    ? "text-accent-400 scale-110 drop-shadow-[0_0_10px_oklch(0.62_0.25_160_/_0.5)]"
                    : "text-neutral-500 group-hover:text-neutral-300 group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-[13px] font-black uppercase tracking-widest transition-colors",
                  isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-200"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Public Store Quick Link */}
        {shop && (
          <div className="px-6 mb-4">
            <a
              href={`/shop/${shop.shop_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[2rem] p-6 border border-white/5 hover:border-accent-500/30 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-accent-500 uppercase tracking-widest">ดูตัวอย่างร้านค้า</span>
                <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-accent-500/20 transition-all">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-white font-black text-sm tracking-tight leading-tight">ร้านค้าออนไลน์ของคุณ</p>
              <p className="text-neutral-500 text-[10px] mt-1.5 font-bold truncate">/shop/{shop.shop_slug}</p>
            </a>
          </div>
        )}

        {/* User Footer - Command Center Status Card */}
        <div className="p-6 mt-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-primary-500 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="relative glass-card !bg-white/5 !border-white/5 !rounded-[2rem] p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-accent-500/50 transition-colors duration-500">
                    <span className="text-sm font-black text-white relative z-10 transition-transform duration-500 group-hover:scale-125">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent-600/20 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 border-2 border-neutral-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-accent-600 truncate tracking-tight">{user?.name || 'ผู้ดูแลระบบ'}</p>
                    <Store className="h-3 w-3 text-accent-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate leading-none mt-1.5 font-black uppercase tracking-tighter">ตัวแทนจำหน่ายที่ได้รับการรับรอง</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-5 flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 text-[12px] font-black text-neutral-400 hover:text-white hover:bg-rose-600 transition-all duration-500 group/logout"
              >
                <span>ออกจากระบบ</span>
                <LogOut className="h-3.5 w-3.5 group-hover/logout:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto custom-scrollbar">
        {/* Top Header - Glass Effect */}
        <header className="h-20 bg-white/30 backdrop-blur-2xl border-b border-neutral-200/30 flex items-center px-10 sticky top-0 z-30 justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-white rounded-2xl shadow-sm border border-neutral-200/50 hover:bg-neutral-50 transition-colors"
            >
              <Menu className="h-6 w-6 text-neutral-900" />
            </button>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
                <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">สถานะร้านค้า: ออนไลน์</h2>
              </div>
              <h1 className="text-lg font-black text-neutral-900 tracking-tight mt-1 capitalize leading-none">
                {pageTitles[location.pathname.split('/').pop() || ''] || location.pathname.split('/').pop()?.replace(/-/g, ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {shop && (
              <a
                href={`/shop/${shop.shop_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-accent-600 bg-accent-50 border border-accent-100 px-6 py-3 rounded-2xl hover:bg-accent-100 transition-all duration-300 shadow-sm active:scale-95"
              >
                เปิดหน้าเว็บไซต์
              </a>
            )}
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">เวลา</span>
              <span className="text-xs font-bold text-neutral-900 mt-1">{time.toLocaleTimeString()}</span>
            </div>
            <div className="h-10 w-px bg-neutral-200/50 hidden sm:block"></div>
            <div className="flex flex-col items-end ">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">โหมดการทำงาน</span>
              <span className="text-[11px] font-bold text-neutral-900 mt-1 uppercase">ปกติ</span>
            </div>
          </div>
        </header>

        {/* Global Page Entrance Animation */}
        <main className="p-8 lg:p-12 max-w-[1600px] w-full mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
