import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Store, ArrowRight, ShoppingBag, User, UserPlus, Package } from 'lucide-react';
import { orderService } from '@/services/order.service';

interface Shop {
  id: number;
  shopName: string;
  shopSlug: string;
  ownerName: string;
  productCount: number;
}

export default function LandingPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Use new API that only returns approved reseller shops
        const data = await orderService.getApprovedShops();
        setShops(data || []);
      } catch (error) {
        console.error('Failed to fetch approved shops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] selection:bg-rose-100 selection:text-rose-600">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-100 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
            <ShoppingBag className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900 hidden sm:block">RMS <span className="text-rose-600 underline decoration-4 underline-offset-4">MARKET</span></span>
        </div>

        {/* Search Bar - Shopee Style */}
        <div className="flex-1 max-w-2xl relative group hidden md:block">
          <input
            type="text"
            placeholder="ค้นหาร้านค้าที่ต้องการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all group-hover:bg-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-rose-500 transition-colors" />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-neutral-900 text-neutral-900 text-sm font-bold hover:bg-neutral-50 transition-all active:scale-95"
          >
            <UserPlus className="h-4 w-4" />
            สมัครสมาชิก
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition-all shadow-md active:scale-95"
          >
            <User className="h-4 w-4" />
            เข้าสู่ระบบ
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-rose-600 mt-4 mx-4 sm:mx-8 rounded-3xl group">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-16 max-w-4xl">
          <h2 className="text-[10px] font-black tracking-[0.4em] text-white/70 uppercase mb-4 animate-in fade-in slide-in-from-left duration-700">Reseller Management System</h2>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-8 animate-in fade-in slide-in-from-left duration-1000">
            เลือกช้อปสินค้า <br /> จาก <span className="text-rose-200">ร้านค้าพรีเมียม</span>
          </h1>
          <p className="text-white/80 text-lg max-w-lg mb-10 hidden sm:block">
            พบกับร้านค้าตัวแทนจำหน่ายคุณภาพที่ผ่านการคัดสรรมาอย่างดี พร้อมโปรโมชั่นและสินค้าหลากหลายรายการ
          </p>
        </div>
      </section>

      {/* Shop Grid Section */}
      <main className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">ร้านค้าที่แนะนำ</h3>
            <p className="text-neutral-500 text-sm mt-1">สำรวจร้านค้าทั้งหมดในระบบของเรา</p>
          </div>
          <div className="h-px flex-1 bg-neutral-200 mx-8 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 px-4 py-2 rounded-full">
            <span>ทั้งหมด {filteredShops.length} ร้าน</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-neutral-100"></div>
            ))}
          </div>
        ) : filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.shopSlug}`}
                className="group bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="aspect-square bg-neutral-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-rose-50 transition-colors">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-rose-500/5 to-transparent transition-opacity"></div>
                  <Store className="h-16 w-16 text-neutral-200 group-hover:text-rose-500 group-hover:scale-110 transition-all duration-500" />
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-black text-lg text-neutral-900 group-hover:text-rose-600 transition-colors truncate">
                    {shop.shopName}
                  </h4>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest truncate">
                    @{shop.shopSlug}
                  </p>
                  {shop.ownerName && (
                    <p className="text-xs text-neutral-500 mt-1">
                      โดย {shop.ownerName}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      {shop.productCount} สินค้า
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                    <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300">
            <Store className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">ไม่พบร้านค้าที่ตรงกับการค้นหา</p>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-neutral-100 py-12 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-rose-600 h-6 w-6" />
            <span className="text-xl font-black text-neutral-900">RMS MARKET</span>
          </div>
          <p className="text-neutral-400 text-sm font-medium italic">© 2026 Reseller Management System. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
            <a href="#" className="hover:text-rose-600 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-rose-600 transition-colors">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
