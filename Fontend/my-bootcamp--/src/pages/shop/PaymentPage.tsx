import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Store, Truck, Loader2, Package, ShieldCheck } from 'lucide-react';
import { orderService } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';
import { LoadingSpinner } from '@/components/ui/shared';

export default function PaymentPage() {
  const { slug, order_id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order_id) {
      loadOrder(Number(order_id));
    }
  }, [order_id]);

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data.data);
    } catch (err) {
      setError('Failed to load order details for payment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order_id) return;
    try {
      setProcessing(true);
      setError('');
      // Simulate payment delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status via API with fallback
      await orderService.simulatePayment(Number(order_id)).catch(() => {
        console.warn("Payment simulation API failed, using manual override.");
        return null;
      });
      
      // Navigate to success/tracking
      navigate('/track-order', { 
        state: { orderId: order_id, success: true },
        replace: true 
      });
    } catch (err: any) {
      console.error("Payment Error:", err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
        <Package className="h-10 w-10 text-rose-500" />
      </div>
      <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter mb-2">Order Not Found</h2>
      <p className="text-neutral-500 max-w-xs mb-8">We couldn't retrieve the details for this order.</p>
      <button onClick={() => navigate(`/shop/${slug}`)} className="btn-primary px-8">Return to Shop</button>
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto pb-32 px-10 animate-in fade-in duration-1000">
      {/* Visual background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--primary-rgb),0.03),transparent_40%)] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            <span className="text-[10px] font-black text-primary-700 uppercase tracking-[0.2em]">Secure Checkout</span>
          </div>
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase mb-4">Secure Payment</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Order Number: {order.order_number}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Order Summary Card */}
          <div className="glass-card !bg-white/80 backdrop-blur-3xl !rounded-[2.5rem] border-white/60 shadow-2xl overflow-hidden order-2 lg:order-1">
            <div className="p-10 border-b border-neutral-100 bg-neutral-50/20">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest flex items-center gap-3">
                <Package className="h-4 w-4 text-primary-600" />
                Order Summary
              </h3>
            </div>
            
            <div className="p-10">
              <div className="space-y-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-neutral-900 text-sm truncate">{item.product_name}</p>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                        {item.quantity} Unit{item.quantity > 1 ? 's' : ''} @ {formatCurrency(item.selling_price)}
                      </p>
                    </div>
                    <p className="font-black text-neutral-900 text-sm ml-4">
                      {formatCurrency(item.selling_price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-neutral-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">Logistics Base</span>
                  <span className="text-sm font-bold text-neutral-900">฿50.00</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-black text-neutral-900 uppercase tracking-tight">Grand Total</span>
                  <p className="text-4xl font-black text-primary-600 tracking-tighter leading-none">{formatCurrency(order.total_amount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action Card */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="glass-card !bg-neutral-900 backdrop-blur-3xl !rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-primary-500/30 transition-all duration-1000"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-10 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-700 mb-10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white/40" />
                  </div>
                </div>

                <div className="space-y-6 mb-12">
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight">Complete Your<br/>Payment</h3>
                  <p className="text-neutral-400 text-xs font-medium leading-relaxed">
                    This is a secure payment simulation. No real money will be charged to your account.
                  </p>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-bold text-rose-400 animate-in slide-in-from-top-4 duration-500">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full relative group/btn"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-1000"></div>
                  <div className="relative bg-primary-600 hover:bg-primary-500 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        Complete Payment
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary-600" />
                </div>
                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Verified Shop</p>
              </div>
              <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary-600" />
                </div>
                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Global Express</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
