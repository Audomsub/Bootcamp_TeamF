import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Store, Truck, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/shared';
import { orderService } from '@/services/order.service';

export default function PaymentPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status via API
      await orderService.simulatePayment(Number(id)).catch(() => null); // ignore mock fail
      
      // Navigate to success/tracking
      navigate('/track-order', { state: { orderId: id, success: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment simulation failed.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
        <p className="text-gray-500">Order #{id} from {slug}</p>
      </div>

      <div className="card shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
        
        <div className="card-body p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">!</span>
              </div>
              <p>{error}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Amount Due</p>
            <p className="text-4xl font-bold text-gray-900">฿349.00</p>
            <p className="text-xs text-gray-400 mt-2">Includes shipping and taxes</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Order Reserved
            </h3>
            
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full btn-primary py-4 text-lg font-medium flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20"
            >
              {processing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-6 w-6" />
                  Pay (Simulation)
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
              This is a simulation. No real money will be charged.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Store className="h-4 w-4" />
              Secure Checkout
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Truck className="h-4 w-4" />
              Fast Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
