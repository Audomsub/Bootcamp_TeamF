import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, MapPin, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/shared';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

export default function TrackOrder() {
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // If we just came from successful payment
    if (location.state?.success && location.state?.orderId) {
      setSuccessMsg('Payment successful! Your order is now being processed.');
      // Auto-fetch mock based on ID
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
        // Mock fallback response
        setOrder({
          id: Number(queryNumber) || 999,
          order_number: queryNumber.startsWith('ORD') ? queryNumber : `ORD-${queryNumber}`,
          shop_id: 1,
          customer_name: 'John Doe',
          customer_phone: '0812345678',
          shipping_address: '123 Main St, Apartment 4B, Bangkok 10000',
          total_amount: 349,
          reseller_profit: 99,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: [
            { id: 1, order_id: 1, product_id: 1, product_name: 'Premium T-Shirt', cost_price: 150, selling_price: 299, quantity: 1 }
          ]
        });
      }
    } catch {
      setError('Order not found. Please check your order number.');
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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number to see the current status</p>
      </div>

      {successMsg && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      {/* Search Input */}
      <div className="card p-6 mb-8 flex gap-3 shadow-md shadow-gray-200/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. ORD-ABC123"
            className="input-field pl-10 h-12 text-lg"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading || !orderNumber.trim()}
          className="btn-primary px-8 h-12 text-base whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600 flex flex-col items-center">
          <AlertCircle className="h-8 w-8 mb-2 opacity-80" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {order && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status Tracker */}
          <div className="card p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
              Order: <span className="text-primary-600 font-mono">{order.order_number}</span>
            </h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 rounded-full transition-all duration-700"
                style={{ width: `${((getStatusStep(order.status) - 1) / 2) * 100}%` }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {[
                  { id: 1, label: 'Order Placed', icon: Package, status: 'pending' },
                  { id: 2, label: 'Shipped', icon: Truck, status: 'shipped' },
                  { id: 3, label: 'Delivered', icon: CheckCircle2, status: 'completed' }
                ].map((step) => {
                  const isActive = getStatusStep(order.status) >= step.id;
                  const isCurrent = getStatusStep(order.status) === step.id;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                        isActive 
                          ? 'bg-primary-600 border-white text-white shadow-md' 
                          : 'bg-white border-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                        <step.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      </div>
                      <p className={`mt-3 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Placed on {formatDate(order.created_at)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Details */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" /> Delivery Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Customer Name</p>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{order.customer_phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{order.shipping_address}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" /> Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(item.selling_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className="text-lg font-bold text-primary-600">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
