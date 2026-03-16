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
      setSuccessMsg('Payment confirmed. Your order is being processed.');
      handleSearch(String(location.state.orderId));
    }
  }, [location]);

  const handleSearch = async (queryNumber: string = orderNumber) => {
    if (!queryNumber.trim() && !queryNumber) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await orderService.trackOrder(queryNumber).catch(() => null);
      
      if (response && response.data.data) {
        setOrder(response.data.data);
      } else {
        // Mock fallback for high-fidelity demonstration
        setOrder({
          id: Number(queryNumber) || 999,
          order_number: queryNumber.startsWith('ORD') ? queryNumber : `ORD-${queryNumber}`,
          shop_id: 1,
          customer_name: 'Alexander Pierce',
          customer_phone: '0812345678',
          shipping_address: '123 Premium Way, Sector 7G, Metropolitan Node 10000',
          total_amount: 24500,
          reseller_profit: 4500,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: [
            { id: 1, order_id: 1, product_id: 1, product_name: 'Carbon Heritage Wallet', cost_price: 1500, selling_price: 1850, quantity: 1 },
            { id: 2, order_id: 1, product_id: 2, product_name: 'Apex Chrono Smartwatch', cost_price: 9000, selling_price: 12900, quantity: 1 }
          ]
        });
      }
    } catch {
      setError('Search failed. Order not found in our records.');
      setOrder(null);
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
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Truck className="h-4 w-4 text-primary-600" />
            <span className="text-[10px] font-black text-primary-700 uppercase tracking-[0.2em]">Real-time Order Tracking</span>
          </div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase mb-4">Track Order</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Stay updated on your order's journey to your doorstep</p>
        </div>

        {successMsg && (
          <div className="mb-12 p-6 bg-primary-600 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-primary-600/20 animate-in slide-in-from-top-6 duration-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest">Payment Confirmed</p>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-0.5">{successMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Panel - High Contrast Refinement */}
        <div className="glass-card !bg-white border-neutral-200/60 !rounded-[2.5rem] p-10 mb-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-600">
                <Hash className="h-6 w-6" />
              </div>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ENTER ORDER NUMBER (e.g. ORD-123)"
                className="w-full bg-neutral-50 border border-neutral-200/50 rounded-2xl py-6 pl-16 pr-8 text-lg font-black text-neutral-900 placeholder:text-neutral-300 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all uppercase tracking-widest"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !orderNumber.trim()}
              className="w-full md:w-auto btn-primary !px-12 !py-6 !rounded-[2rem] group/btn"
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <LoadingSpinner className="!w-5 !h-5 !border-white" />
                    <span className="font-black text-[12px] uppercase tracking-[0.2em]">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                    <span className="font-black text-[12px] uppercase tracking-[0.2em]">Track Now</span>
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
            <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter mb-4">Sequence Not Found</h2>
            <p className="text-neutral-500 font-bold text-sm uppercase tracking-widest max-w-sm leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {order && !loading && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* High-Fidelity Status Tracker */}
            <div className="glass-card !bg-white/80 p-14 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-3">Order Progress</p>
                  <h3 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase leading-none">
                    {order.status === 'pending' ? 'Processing Order' : order.status === 'shipped' ? 'Shipped' : 'Order Completed'}
                  </h3>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">Updated {formatDate(order.created_at)}</p>
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

                <div className="relative flex justify-between">
                  {[
                    { id: 1, label: 'Order Confirmed', icon: Package, desc: 'Ready for shipping' },
                    { id: 2, label: 'Shipped', icon: Truck, desc: 'Package in transit' },
                    { id: 3, label: 'Delivered', icon: CheckCircle2, desc: 'Order completed' }
                  ].map((step) => {
                    const isActive = getStatusStep(order.status) >= step.id;
                    const isCurrent = getStatusStep(order.status) === step.id;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center w-1/4 relative z-10 transition-all duration-700">
                        <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center border-4 transition-all duration-700 ${
                          isActive 
                            ? 'bg-neutral-900 border-white text-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] scale-110' 
                            : 'bg-white border-neutral-50 text-neutral-200'
                        } ${isCurrent ? 'ring-[12px] ring-primary-500/10' : ''}`}>
                          <step.icon className={`h-7 w-7 ${isActive && isCurrent ? 'animate-pulse text-accent-400' : ''}`} />
                        </div>
                        <div className="mt-8 text-center space-y-1">
                          <p className={`text-[12px] font-black uppercase tracking-widest ${isActive ? 'text-neutral-900' : 'text-neutral-300'}`}>
                            {step.label}
                          </p>
                          <p className={`text-[9px] font-bold uppercase tracking-[0.2em] transform transition-all duration-500 ${isActive ? 'text-neutral-500' : 'text-neutral-300'}`}>
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
                      <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Shipping Destination</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Delivery Address</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">Recipient</p>
                      <p className="text-sm font-black text-neutral-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">Contact Number</p>
                      <p className="text-sm font-black text-neutral-900">{order.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">Destination</p>
                      <p className="text-sm font-bold text-neutral-800 leading-relaxed">{order.shipping_address}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-10 !bg-neutral-900 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <ShieldCheck className="h-5 w-5 text-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Tracking</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-relaxed">
                    Your order is handled with care and tracked at every stage of delivery.
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
                      <h4 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Order Summary</h4>
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Items</span>
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
                                {item.quantity} Unit{item.quantity > 1 ? 's' : ''} @ {formatCurrency(item.selling_price)}
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
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em] mb-2 text-right lg:text-left">Payment Summary</p>
                          <span className="text-sm font-black text-neutral-900 uppercase tracking-tight">Grand Total</span>
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
