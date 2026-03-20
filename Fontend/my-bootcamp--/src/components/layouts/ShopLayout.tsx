import React, { useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { Store, ShoppingBag, Truck, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../../pages/shop/CartDrawer';
import { cn } from '@/lib/utils';

export default function ShopLayout() {
  const { slug } = useParams();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Shop Header - Refined Consumer Experience */}
      <header className="bg-white/60 backdrop-blur-2xl border-b border-neutral-200/30 sticky top-0 z-50 h-20 lg:h-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-full">
          <div className="h-full flex items-center justify-between">
            {/* Logo area */}
            <Link
              to={slug ? `/shop/${slug}` : '/'}
              className="group flex items-center gap-4"
            >
              <div className="relative">
                <div className="absolute -inset-1.5 bg-primary-500 rounded-2xl blur-lg opacity-10 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Store className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tighter text-neutral-900 leading-none">
                  {slug?.replace(/-/g, ' ').toUpperCase() || 'ร้านค้าตัวแทนจำหน่าย'}
                </span>
                <span className="text-[12px] font-black  text-primary-500 uppercase mt-2">
                  ประสบการณ์ระดับพรีเมียม
                </span>
              </div>
            </Link>

            {/* Navigation & Cart */}
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center gap-2 pr-2 lg:pr-4 border-r border-neutral-100">
                {slug && (
                  <Link
                    to={`/shop/${slug}`}
                    className="hidden sm:px-6 sm:py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-all"
                  >
                    สินค้า
                  </Link>
                )}

                {/* Cart Toggle Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative group p-2.5 lg:p-3 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-primary-500 transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5 text-neutral-600 group-hover:text-primary-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg animate-in zoom-in duration-300">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              <Link
                to="/track-order"
                className="hidden md:flex btn-primary !px-8 !py-3 font-black text-[14px]"
              >
                ติดตามสถานะ
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 rounded-2xl bg-white border border-neutral-100 shadow-sm text-neutral-600 hover:text-primary-600 transition-all"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={cn(
          "lg:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-xl border-b border-neutral-100 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden z-40",
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-6 py-8 flex flex-col gap-4">
            {slug && (
              <Link
                to={`/shop/${slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-6 py-4 rounded-2xl bg-neutral-50 text-sm font-black uppercase tracking-widest text-neutral-900"
              >
                <span>เลือกซื้อสินค้า</span>
                <ShoppingBag className="h-5 w-5 text-neutral-400" />
              </Link>
            )}
            <Link
              to="/track-order"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between px-6 py-4 rounded-2xl bg-primary-600 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-primary-600/20"
            >
              <span>ติดตามสถานะออเดอร์</span>
              <Truck className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 lg:py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
          <Outlet />
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Digital Footer */}
      <footer className="bg-white border-t border-neutral-100 py-20 mt-auto">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center grayscale opacity-20 group-hover:opacity-100 transition-all duration-500">
              <Store className="h-6 w-6 text-neutral-900" />
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.4em]">
                ร้านค้าพาณิชย์ระดับพรีเมียมที่ได้รับการยืนยัน
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-200 to-transparent mx-auto"></div>
              <p className="text-[11px] font-bold text-neutral-500 max-w-sm leading-relaxed">
                สัมผัสประสบการณ์คอมเมิร์ซประสิทธิภาพสูง ขับเคลื่อนด้วยเทคโนโลยีโลจิสติกส์แห่งอนาคตและการจัดจำหน่ายสินค้าระดับพรีเมียม
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}