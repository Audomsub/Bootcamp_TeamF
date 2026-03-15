import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, ChevronLeft, Loader2, Minus, Plus } from 'lucide-react';
import { shopService } from '@/services/shop.service';
import { orderService } from '@/services/order.service';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/shared';
import type { ShopProduct, Product } from '@/types';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  customer_phone: z.string().min(9, 'Valid phone number is required'),
  shipping_address: z.string().min(5, 'Full shipping address is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [shopId, setShopId] = useState<number | null>(null);
  const [product, setProduct] = useState<(ShopProduct & { product: Product }) | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const productId = location.state?.productId;
    if (slug && productId) {
      loadCheckoutData(slug, productId);
    } else if (slug) {
      navigate(`/shop/${slug}`);
    }
  }, [slug, location]);

  const loadCheckoutData = async (shopSlug: string, prodId: number) => {
    try {
      // Mock loading logic if API fails
      const response = await shopService.getBySlug(shopSlug).catch(() => null);
      
      let shopData;
      if (response && response.data.data) {
        shopData = response.data.data;
      } else {
        // Fallback mock
        shopData = {
          id: 1,
          products: [
            { id: 1, shop_id: 1, product_id: prodId, selling_price: 299, product: { id: prodId, name: 'Premium T-Shirt', description: 'High quality cotton', image_url: 'https://placehold.co/400', cost_price: 150, min_price: 250, stock: 100, created_at: '' } }
          ]
        };
      }
      
      setShopId(shopData.id);
      const selectedItem = shopData.products.find((p: any) => p.product.id === prodId);
      
      if (selectedItem) {
        setProduct(selectedItem);
      } else {
        navigate(`/shop/${slug}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!shopId || !product) return;
    
    try {
      setError('');
      // In a real app we would call:
      // const res = await orderService.createOrder({ ... })
      // For demo, we simulate success and redirect to payment
      
      const payload = {
        shop_id: shopId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        shipping_address: data.shipping_address,
        items: [{ product_id: product.product.id, quantity }],
      };

      const res = await orderService.createOrder(payload).catch(() => ({
        data: { data: { id: Date.now() } } // Mock response
      }));

      const orderId = res.data.data.id;
      navigate(`/shop/${slug}/payment/${orderId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return null;

  const subtotal = product.selling_price * quantity;
  const shipping = 50; // Fixed shipping cost for demo
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to={`/shop/${slug}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 w-fit">
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-7">
          <div className="card">
            <div className="card-header bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name</label>
                    <input {...register('customer_name')} className="input-field" placeholder="John Doe" />
                    {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name.message}</p>}
                  </div>

                  <div>
                    <label className="label">Phone Number</label>
                    <input {...register('customer_phone')} className="input-field" placeholder="0812345678" />
                    {errors.customer_phone && <p className="mt-1 text-xs text-red-500">{errors.customer_phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Shipping Address</label>
                  <textarea {...register('shipping_address')} rows={4} className="input-field resize-none" placeholder="123 Main St, Apartment 4B, City, Country, 10000" />
                  {errors.shipping_address && <p className="mt-1 text-xs text-red-500">{errors.shipping_address.message}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="card bg-gray-50/50">
            <div className="card-header">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="card-body pb-0">
              {/* Product */}
              <div className="flex gap-4 pb-6 border-b border-gray-200">
                <img
                  src={product.product.image_url}
                  alt={product.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-white border border-gray-100 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.product.name}</h3>
                  <p className="text-sm font-medium text-emerald-600 mt-1">{formatCurrency(product.selling_price)}</p>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="py-6 space-y-3 border-b border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="py-6 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="p-6 pt-0">
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <Store className="h-4 w-4" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
