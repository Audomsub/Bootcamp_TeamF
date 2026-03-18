import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { Link, useParams } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
  const { slug } = useParams();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] animate-in slide-in-from-right">
          <div className="h-full flex flex-col bg-white shadow-2xl relative overflow-hidden">
            {/* Mesh Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

            {/* Header */}
            <div className="relative p-8 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">รถเข็นสั่งซื้อสินค้า</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    มีสินค้าทั้งหมด {totalItems} รายการในรถเข็น
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-neutral-50 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-neutral-200" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">ยังไม่มีรายการสินค้าในรถเข็น</h3>
                    <p className="text-sm text-neutral-400 mt-2 font-medium">เลือกสรรสินค้าคุณภาพเพื่อเริ่มรายการสั่งซื้อของคุณ</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="btn-primary !px-8"
                  >
                    เลือกชมสินค้า
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.shopProduct.id} className="group relative bg-white rounded-3xl border border-neutral-100 p-4 hover:border-primary-100 transition-all duration-300">
                    <div className="flex gap-5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0">
                        <img
                          src={getImageUrl(item.shopProduct.product?.image_url)}
                          alt={item.shopProduct.product?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-neutral-900 truncate pr-2">
                              {item.shopProduct.product?.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.shopProduct.id)}
                              className="text-neutral-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-emerald-500 font-bold text-sm mt-1">
                            {formatCurrency(item.shopProduct.selling_price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200/50 p-1">
                            <button
                              onClick={() => updateQuantity(item.shopProduct.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1) {
                                  const maxStock = item.shopProduct.product?.stock || val;
                                  updateQuantity(item.shopProduct.id, Math.min(val, maxStock));
                                }
                              }}
                              className="w-10 text-center text-xs font-black text-neutral-900 bg-transparent border-none p-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => {
                                const maxStock = item.shopProduct.product?.stock || (item.quantity + 1);
                                if (item.quantity + 1 <= maxStock) {
                                  updateQuantity(item.shopProduct.id, item.quantity + 1);
                                }
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-all"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs font-black text-neutral-900">
                            {formatCurrency(item.shopProduct.selling_price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-neutral-50/50 border-t border-neutral-100 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">ยอดรวมคำสั่งซื้อ</span>
                    <span className="text-lg font-bold text-neutral-900">{formatCurrency(totalAmount)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium">ค่าจัดส่งและภาษีจะถูกคำนวณในขั้นตอนการชำระเงิน</p>
                </div>

                <Link
                  to={`/shop/${slug}/checkout`}
                  onClick={onClose}
                  className="w-full relative group block"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative w-full py-5 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-black group-hover:scale-[1.02] active:scale-[0.98]">
                    ดำเนินการสั่งซื้อสินค้า
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
