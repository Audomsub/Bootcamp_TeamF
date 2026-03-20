import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, MapPin, Truck, CheckCircle2, AlertCircle, ShieldCheck, Hash, Clock, ArrowLeft } from 'lucide-react';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';
import { LoadingSpinner } from '@/components/ui/shared';

export default function TrackOrder() {
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (location.state?.success && location.state?.orderId) {
      const orderNum = String(location.state.orderId);
      setSuccessMsg('ยืนยันการชำระเงินแล้ว คำสั่งซื้อของคุณกำลังดำเนินการ');
      setOrderNumber(orderNum);
      handleSearch(orderNum);
    }
  }, [location]);

  const handleSearch = async (queryNumber: string = orderNumber) => {
    // Sanitize input: Remove "#", "Order", spaces and convert to uppercase
    const sanitizedQuery = queryNumber
      .trim()
      .replace(/^#\s*/, '')           // Remove leading # and any space after it
      .replace(/^order\s+/i, '')      // Remove "Order " prefix (case insensitive)
      .replace(/\s+/g, '')            // Remove all other spaces
      .toUpperCase();

    if (!sanitizedQuery) return;

    try {
      setLoading(true);
      setError('');
      setOrder(null);

      console.log('🔍 Searching order:', sanitizedQuery);
      const response = await orderService.trackOrder(sanitizedQuery);
      console.log('🔍 Track order response:', response);

      if (response && response.data?.data) {
        setOrder(response.data.data);
      } else {
        setError('ค้นหาไม่สำเร็จ ไม่พบคำสั่งซื้อนี้ในระบบของเรา');
      }
    } catch (err: any) {
      console.error('🔍 Track order error:', err?.response?.status, err?.response?.data, err?.message);
      const backendMsg = err?.response?.data?.message;
      setError(backendMsg || 'ค้นหาไม่สำเร็จ ไม่พบคำสั่งซื้อนี้ในระบบของเรา');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'shipped': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-32 px-10 animate-in fade-in duration-1000">
      {/* Visual background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.02),transparent_40%)] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-10 sm:mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" />
            <span className="text-[12px] sm:text-[14px] font-black text-primary-700 uppercase">ติดตามสถานะคำสั่งซื้อแบบเรียลไทม์</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tighter uppercase mb-4">ติดตามคำสั่งซื้อ</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-s">อัปเดตสถานะการจัดส่งสินค้าส่งตรงถึงหน้าบ้านคุณ</p>
        </div>

        {successMsg && (
          <div className="mb-12 p-6 bg-primary-600 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-primary-600/20 animate-in slide-in-from-top-6 duration-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">ยืนยันการชำระเงินแล้ว</p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-0.5">{successMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Panel - High Contrast Refinement */}
        <div className="glass-card !bg-white border-neutral-200/60 !rounded-[2.5rem] p-6 sm:p-10 mb-10 sm:mb-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-primary-600">
                <Hash className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="กรอกหมายเลขคำสั่งซื้อ"
                className="w-full bg-neutral-50 border border-neutral-200/50 rounded-2xl py-4 sm:py-6 pl-14 sm:pl-16 pr-6 sm:pr-8 text-base sm:text-lg font-black text-neutral-900 placeholder:text-neutral-300 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all uppercase tracking-widest"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !orderNumber.trim()}
              className="w-full md:w-auto btn-primary !px-12 !py-4 sm:!py-6 !rounded-2xl sm:!rounded-[2rem] group/btn"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                      </div>
                      <span className="font-black text-[12px] uppercase">กำลังค้นหา...</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:scale-110 transition-transform" />
                    <span className="font-black text-[12px] uppercase">ติดตามสถานะ</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {error && !loading && (
          <div className="glass-card !bg-white/80 p-12 text-center flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter mb-4">ไม่พบข้อมูลคำสั่งซื้อ</h2>
            <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest max-w-sm leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {order && !loading && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* High-Fidelity Status Tracker */}
            <div className="glass-card !bg-white/80 p-6 sm:p-14 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-6">
                <div>
                  <p className="text-[14px] sm:text-[16px] font-black text-primary-600 mb-2 sm:mb-3 uppercase tracking-wider">สถานะคำสั่งซื้อ</p>
                  <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                    {order.status === 'pending' ? 'กำลังดำเนินการ' : order.status === 'shipped' ? 'จัดส่งแล้ว' : 'คำสั่งซื้อเสร็จสิ้น'}
                  </h3>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 sm:py-3 bg-neutral-50 rounded-xl sm:rounded-2xl border border-neutral-100">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
                  <p className="text-[9px] sm:text-[11px] font-black text-neutral-500 uppercase tracking-widest">อัปเดต {formatDate(order.created_at)}</p>
                </div>
              </div>

              <div className="relative pt-10 px-8">
                {/* Visual Connector Line base */}
                <div className="absolute top-[68px] left-[15%] right-[15%] h-2 bg-neutral-100 rounded-full" />

                {/* Active Connector Line with Pulse */}
                <div
                  className="absolute top-[68px] left-[15%] h-2 bg-gradient-to-r from-primary-600 via-primary-400 to-accent-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
                  style={{ width: `${((getStatusStep(order.status) - 1) / 2) * 70}%` }}
                />

                <div className="relative flex justify-between gap-2 sm:gap-4">
                  {[
                    { id: 1, label: 'รับออเดอร์', mobileLabel: 'รับออเดอร์', icon: Package, desc: 'เตรียมจัดส่ง' },
                    { id: 2, label: 'จัดส่งแล้ว', mobileLabel: 'จัดส่ง', icon: Truck, desc: 'อยู่ระหว่างจัดส่ง' },
                    { id: 3, label: 'สำเร็จ', mobileLabel: 'สำเร็จ', icon: CheckCircle2, desc: 'เสร็จสมบูรณ์' }
                  ].map((step) => {
                    const isActive = getStatusStep(order.status) >= step.id;
                    const isCurrent = getStatusStep(order.status) === step.id;

                    return (
                      <div key={step.id} className="flex flex-col items-center w-1/3 relative z-10 transition-all duration-700">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.8rem] flex items-center justify-center border-2 sm:border-4 transition-all duration-700 ${isActive
                          ? 'bg-neutral-900 border-white text-white shadow-xl scale-110'
                          : 'bg-white border-neutral-50 text-neutral-200'
                          } ${isCurrent ? 'ring-8 sm:ring-[12px] ring-primary-500/10' : ''}`}>
                          <step.icon className={`h-5 w-5 sm:h-7 sm:w-7 ${isActive && isCurrent ? 'animate-pulse text-accent-400' : ''}`} />
                        </div>
                        <div className="mt-4 sm:mt-8 text-center space-y-1">
                          <p className={`text-[12px] sm:text-[16px] font-black uppercase tracking-tight ${isActive ? 'text-neutral-900' : 'text-neutral-300'}`}>
                            <span className="hidden sm:inline">{step.label}</span>
                            <span className="sm:hidden">{step.mobileLabel}</span>
                          </p>
                          <p className={`hidden sm:block text-[12px] font-bold uppercase transform transition-all duration-500 ${isActive ? 'text-neutral-500' : 'text-neutral-300'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Delivery Node Details */}
              <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-neutral-900 ">สถานที่จัดส่ง</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">ที่อยู่สำหรับจัดส่ง</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">ผู้รับ</p>
                      <p className="text-sm font-black text-neutral-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">เบอร์ติดต่อ</p>
                      <p className="text-sm font-black text-neutral-900">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase mb-2">ปลายทาง</p>
                      <p className="text-sm font-bold text-neutral-800 leading-relaxed">{order.shipping_address}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-10 !bg-neutral-900 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck className="h-5 w-5 text-primary-500" />
                    <span className="text-[16px] font-black text-primary-400 ">ติดตามอย่างปลอดภัย</span>
                  </div>
                  <p className="text-[14px] text-black font-bold ">
                    คำสั่งซื้อของคุณได้รับการดูแลอย่างดีและสามารถติดตามได้ทุกขั้นตอนการจัดส่ง
                  </p>
                </div>
              </div>

              {/* Order Manifest Summary */}
              <div className="lg:col-span-8">
                <div className="glass-card overflow-hidden">
                  <div className="p-10 border-b border-neutral-100 bg-neutral-50/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary-600" />
                      </div>
                      <h4 className="text-sm font-black text-neutral-900 ">สรุปคำสั่งซื้อ</h4>
                    </div>
                    <span className="text-[14px] font-black text-neutral-400 ">รายการ</span>
                  </div>

                  <div className="p-10">
                    <div className="space-y-8">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden">
                              <Package className="h-6 w-6 text-neutral-200" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-neutral-900 text-base truncate pr-4 uppercase tracking-tighter">{item.product_name}</p>
                              <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1">
                                {item.quantity} ชิ้น @ {formatCurrency(item.selling_price)}
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-neutral-900 text-lg ml-4">
                            {formatCurrency(item.selling_price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 pt-10 border-t border-neutral-100">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[12px] font-black text-neutral-400 uppercase  mb-2 text-right lg:text-left">สรุปการชำระเงิน</p>
                          <span className="text-sm font-black text-neutral-900 uppercase tracking-tight">ยอดรวมทั้งสิ้น</span>
                        </div>
                        <p className="text-4xl font-black text-neutral-900 tracking-tighter leading-none">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}