import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ChevronLeft,
  Store,
  Loader2,
  Plus,
  Minus,
  ShoppingCart,
  Lock
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency, getImageUrl } from '../../lib/utils';
import { shopService } from '../../services/shop.service';
import { orderService } from '../../services/order.service';
import type { Shop } from '../../types';
import { LoadingSpinner } from '../../components/ui/shared';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'กรุณาระบุชื่อ-นามสกุล'),
  customer_phone: z.string().regex(/^[0-9]{10}$/, 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'),
  shipping_address: z.string().min(10, 'กรุณาระบุที่อยู่จัดส่งให้ครบถ้วน'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart, updateQuantity, totalItems } = useCart();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderCreated, setIsOrderCreated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (slug) loadShopData(slug);
  }, [slug]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate(`/shop/${slug}`);
    }
  }, [loading, cartItems.length, navigate, slug]);

  const loadShopData = async (shopSlug: string) => {
    try {
      setLoading(true);
      const response = await shopService.getBySlug(shopSlug);
      
      // Handle potential response.data wrapping
      const data = response?.data || response;
      if (!data) throw new Error('No shop data received');

      setShop({
        id: data.id || 1,
        user_id: 0,
        shop_name: data.shopName || "ร้านค้า",
        shop_slug: shopSlug
      });
    } catch (err) {
      console.error('[CheckoutPage] Error loading shop data:', err);
      setError("ไม่พบข้อมูลร้านค้าในระบบ กรุณาลองใหม่อีกครั้ง");
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = (shopProductId: number, newQuantity: number) => {
    const item = cartItems.find(i => i.shopProduct.id === shopProductId);
    if (!item || !item.shopProduct.product) return;

    if (newQuantity > item.shopProduct.product.stock) {
      setError(`ขออภัย สินค้า "${item.shopProduct.product.name}" มีสต็อกไม่พอ (สั่งได้สูงสุด: ${item.shopProduct.product.stock} ชิ้น)`);
      return;
    }

    if (newQuantity < 1) return; // ป้องกันการปรับจำนวนติดลบหรือเท่ากับ 0

    setError(null);
    updateQuantity(shopProductId, newQuantity);
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!shop || cartItems.length === 0) return;

    // ตรวจสอบสต๊อกสินค้าครั้งสุดท้ายก่อนยืนยันออเดอร์
    for (const item of cartItems) {
      if (item.shopProduct.product && item.quantity > item.shopProduct.product.stock) {
        setError(`ขออภัย สินค้า "${item.shopProduct.product.name}" มีสต็อกเหลือเพียง ${item.shopProduct.product.stock} ชิ้น กรุณาปรับยอดสั่งซื้อใหม่`);
        return;
      }
    }

    try {
      setError(null);

      const orderData = {
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerAddress: data.shipping_address,
        totalAmount: totalAmount + 50,
        items: cartItems.map(item => ({
          productId: item.shopProduct.product?.id || item.shopProduct.product_id,
          product_name: item.shopProduct.product?.name,
          selling_price: item.shopProduct.selling_price,
          quantity: item.quantity,
        }))
      };

      navigate(`/shop/${slug}/payment`, { state: { orderData, cartItems } });
    } catch (err) {
      setError('ไม่สามารถทำรายการได้ในขณะนี้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (cartItems.length === 0) return null;

  const shippingCost = 50; // ค่าจัดส่งคงที่ (ตัวอย่าง)
  const grandTotal = totalAmount + shippingCost;

  return (
    <div className="pb-32 px-4 sm:px-0 animate-in fade-in duration-1000 font-sans">
      {/* Visual background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.03),transparent_40%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ย้อนกลับ */}
        <div className="mb-8 pt-8 lg:mb-12">
          <Link
            to={`/shop/${slug}`}
            className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-primary-600 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-200 transition-all duration-500">
              <ChevronLeft className="h-5 w-5 text-neutral-500 group-hover:text-primary-600" />
            </div>
            <span>เลือกซื้อสินค้าต่อ</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Checkout Section */}
          <div className="lg:col-span-7 space-y-10">
            <div className="glass-card !bg-white/80 backdrop-blur-3xl !rounded-[2.5rem] border-white/60 shadow-xl overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-12 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-primary-100 flex items-center justify-center shadow-inner">
                    <Store className="h-5 w-5 sm:h-7 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">ข้อมูลการจัดส่ง</h1>
                    <p className="text-[10px] sm:text-sm font-medium text-neutral-500 mt-1">กรุณาระบุที่อยู่สำหรับจัดส่งสินค้า</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-12">
                {error && (
                  <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm font-bold text-rose-600 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0"></div>
                    {error}
                  </div>
                )}

                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-neutral-500 ml-1">ชื่อ-นามสกุลผู้รับ</label>
                      <input
                        {...register('customer_name')}
                        className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400"
                        placeholder="เช่น สมชาย รักดี"
                      />
                      {errors.customer_name && <p className="text-xs font-semibold text-rose-500 ml-1">{errors.customer_name.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-neutral-500 ml-1">เบอร์โทรศัพท์ติดต่อ</label>
                      <input
                        {...register('customer_phone')}
                        className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400"
                        placeholder="08X-XXX-XXXX (10 หลัก)"
                      />
                      {errors.customer_phone && <p className="text-xs font-semibold text-rose-500 ml-1">{errors.customer_phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-500 ml-1">ที่อยู่จัดส่ง</label>
                    <textarea
                      {...register('shipping_address')}
                      rows={4}
                      className="w-full px-5 py-4 sm:px-6 sm:py-5 rounded-2xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400 resize-none leading-relaxed"
                      placeholder="บ้านเลขที่, อาคาร/หมู่บ้าน, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
                    />
                    {errors.shipping_address && <p className="text-xs font-semibold text-rose-500 ml-1">{errors.shipping_address.message}</p>}
                    <p className="text-[11px] text-neutral-400 font-medium ml-1 mt-1">* โปรดตรวจสอบที่อยู่ให้ถูกต้อง เพื่อการจัดส่งที่รวดเร็ว</p>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold text-neutral-500">ข้อมูลของคุณถูกเข้ารหัสอย่างปลอดภัย</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="glass-card !bg-white/95 backdrop-blur-3xl !rounded-[2rem] sm:!rounded-[2.5rem] shadow-2xl p-6 sm:p-8 lg:p-10 sticky top-10 border-white/60">
              <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">สรุปคำสั่งซื้อ</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                        <span className="text-[10px] font-bold uppercase text-primary-600">Secure Payment</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* รายละเอียด */}
                <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-8 border-y border-neutral-100 py-6">
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">จำนวนสินค้า</p>
                    <p className="text-sm sm:text-base font-black text-neutral-900">{totalItems} ชิ้น</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">ร้านค้า</p>
                    <p className="text-sm sm:text-base font-black text-neutral-900 truncate pr-2" title={slug?.toUpperCase()}>
                      {slug?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">การจัดส่ง</p>
                    <p className="text-sm sm:text-base font-black text-emerald-600">Express Delivery</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">สถานะ</p>
                    <p className="text-sm sm:text-base font-black text-neutral-900">พร้อมดำเนินการ</p>
                  </div>
                </div>

                {/* รายการสินค้าในตะกร้า */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-neutral-900">รายการสินค้า</h3>
                  </div>

                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {[...cartItems].sort((a, b) => {
                      const stockA = a.shopProduct.product?.stock ?? 0;
                      const stockB = b.shopProduct.product?.stock ?? 0;
                      // สินค้าที่มีสต็อก (stock > 0) แสดงก่อน, สินค้าหมด (stock === 0) แสดงหลัง
                      if (stockA > 0 && stockB === 0) return -1;
                      if (stockA === 0 && stockB > 0) return 1;
                      return 0;
                    }).map((item) => (
                      <div key={item.shopProduct.id} className="group/item relative bg-white rounded-2xl border border-neutral-100 p-3 hover:border-primary-200 hover:shadow-md transition-all duration-300">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-100">
                            <img
                              src={getImageUrl(item.shopProduct.product?.image_url)}
                              alt={item.shopProduct.product?.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <h4 className="font-bold text-neutral-800 text-sm leading-tight line-clamp-2" title={item.shopProduct.product?.name}>
                                {item.shopProduct.product?.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1.5">
                                <p className="text-primary-600 font-bold text-xs">
                                  {formatCurrency(item.shopProduct.selling_price)} / ชิ้น
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {/* ปุ่มปรับจำนวน */}
                              <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200/60 p-0.5 scale-90 sm:scale-100 origin-left">
                                <button
                                  onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.shopProduct.id, item.quantity - 1); }}
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
                                >
                                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) {
                                      handleUpdateQuantity(item.shopProduct.id, val);
                                    }
                                  }}
                                  className="w-8 sm:w-10 text-center text-[10px] sm:text-xs font-bold text-neutral-900 bg-transparent border-none p-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={(e) => { e.preventDefault(); handleUpdateQuantity(item.shopProduct.id, item.quantity + 1); }}
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-md hover:bg-white flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
                                >
                                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </button>
                              </div>
                              <p className="text-[13px] sm:text-sm font-black text-neutral-900">
                                {formatCurrency(item.shopProduct.selling_price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* สรุปยอดเงิน */}
                <div className="space-y-6 pt-6 border-t border-neutral-100">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-neutral-500">มูลค่าสินค้า</span>
                      <span className="text-neutral-900">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-neutral-500">ค่าจัดส่ง</span>
                      <span className="text-neutral-900">{formatCurrency(shippingCost)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-200">
                    <div className="flex justify-between items-end gap-2">
                      <span className="text-sm sm:text-lg font-bold text-neutral-900 pb-1">ยอดรวมทั้งสิ้น</span>
                      <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-primary-600 tracking-tight">{formatCurrency(grandTotal)}</p>
                    </div>
                  </div>
                </div>

                {/* ปุ่มยืนยันชำระเงิน */}
                <div className="pt-2">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="group relative w-full"
                  >
                    <div className="absolute -inset-1 bg-primary-500/30 rounded-[1.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative w-full py-5 bg-neutral-900 text-white rounded-[1.5rem] font-bold text-base lg:text-lg flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-neutral-800 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          กำลังดำเนินการ...
                        </>
                      ) : (
                        <>
                          ยืนยันคำสั่งซื้อ
                          <ShoppingCart className="h-5 w-5" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}