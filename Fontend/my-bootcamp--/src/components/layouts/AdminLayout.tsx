import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/resellers', icon: Users, label: 'Resellers' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Deep Executive Look */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-80 bg-neutral-900 border-r border-white/5 transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0 shadow-[0_0_100px_rgba(0,0,0,0.5)]' : '-translate-x-full'
        )}
      >
        {/* Logo & Brand */}
        <div className="h-32 flex flex-col justify-center px-10">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-primary-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tighter text-white leading-none">ADMIN PORTAL</span>
              <span className="text-[9px] font-black tracking-[0.3em] text-primary-400 uppercase mt-1.5">Management Suite</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Brand Separator */}
        <div className="px-10 mb-8">
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        {/* Navigation - Elite High-Contrast Look */}
        <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto custom-scrollbar pt-4">
          <div className="px-6 mb-6">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none mb-1">Operations</p>
            <div className="h-0.5 w-8 bg-primary-500/30 rounded-full"></div>
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
                    ? 'bg-primary-500/10 text-white' 
                    : 'text-neutral-400 hover:text-white'
                )}
              >
                {/* Laser Active Indicator */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary-500 rounded-r-full shadow-[0_0_15px_oklch(0.52_0.25_260)] animate-in slide-in-from-left duration-700"></div>
                    <div className="absolute right-6 w-1 h-1 rounded-full bg-primary-400 shadow-[0_0_8px_oklch(0.52_0.25_260)]"></div>
                  </>
                )}
                
                <item.icon className={cn(
                   "h-5 w-5 transition-all duration-500",
                   isActive 
                    ? "text-primary-400 scale-110 drop-shadow-[0_0_10px_oklch(0.52_0.25_260_/_0.5)]" 
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

        {/* User Footer - Command Center Status Card */}
        <div className="p-6 mt-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="relative glass-card !bg-white/5 !border-white/5 !rounded-[2rem] p-5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-primary-500/50 transition-colors duration-500">
                    <span className="text-sm font-black text-white relative z-10 transition-transform duration-500 group-hover:scale-125">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-accent-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-neutral-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-white truncate tracking-tight">{user?.name || 'Administrator'}</p>
                    <Shield className="h-3 w-3 text-primary-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate leading-none mt-1.5 font-black uppercase tracking-tighter">System Administrator</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full mt-5 flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-white hover:bg-rose-600 transition-all duration-500 group/logout"
              >
                <span>Sign Out</span>
                <LogOut className="h-3.5 w-3.5 group-hover/logout:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
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
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">System Status: Online</h2>
              </div>
              <h1 className="text-lg font-black text-neutral-900 tracking-tight mt-1 capitalize leading-none">
                {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">System Time</span>
              <span className="text-xs font-bold text-neutral-900 mt-1">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="h-10 w-px bg-neutral-200/50 hidden sm:block"></div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">Security Protocol</span>
              <span className="text-[11px] font-bold text-neutral-900 mt-1 uppercase">Encrypted</span>
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
