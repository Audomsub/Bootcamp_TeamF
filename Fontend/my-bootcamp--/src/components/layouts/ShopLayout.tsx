import React, { useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { Store, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../shop/CartDrawer';

export default function ShopLayout() {
  const { slug } = useParams();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Shop Header - Refined Consumer Experience */}
      <header className="bg-white/60 backdrop-blur-2xl border-b border-neutral-200/30 sticky top-0 z-50 h-24">
        <div className="max-w-[1440px] mx-auto px-10 h-full">
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
                  {slug?.replace(/-/g, ' ').toUpperCase() || 'RESELLER SHOP'}
                </span>
                <span className="text-[10px] font-black tracking-[0.3em] text-primary-500 uppercase mt-2">
                  Premium Experience
                </span>
              </div>
            </Link>

            {/* Navigation & Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 pr-4 border-r border-neutral-100">
                {slug && (
                  <Link
                    to={`/shop/${slug}`}
                    className="px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-all"
                  >
                    Products
                  </Link>
                )}

                {/* Cart Toggle Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative group p-3 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-primary-500 transition-all duration-300"
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
                className="btn-primary !px-8 !py-3 font-black text-[10px] tracking-[0.2em]"
              >
                Track Journey
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <div className="max-w-[1440px] mx-auto px-10">
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
                Verified Premium Commercial Node
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-neutral-200 to-transparent mx-auto"></div>
              <p className="text-[11px] font-bold text-neutral-500 max-w-sm leading-relaxed">
                Experience high-performance commerce. Powered by the next generation of logistics technology and premium unit distribution.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
