import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/ui/shared';
import { shopService } from '@/services/shop.service';
import { formatCurrency } from '@/lib/utils';
import type { Shop, ShopProduct, Product } from '@/types';

type PublicShopData = Shop & { products: (ShopProduct & { product: Product })[] };

// Mock data
const mockShop: PublicShopData = {
  id: 1,
  user_id: 1,
  shop_name: 'Super Gadgets Store',
  shop_slug: 'super-gadgets',
  products: [
    { id: 1, shop_id: 1, product_id: 1, selling_price: 299, product: { id: 1, name: 'Premium T-Shirt', description: 'High quality cotton', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=T-Shirt', cost_price: 150, min_price: 250, stock: 100, created_at: '' } },
    { id: 2, shop_id: 1, product_id: 2, selling_price: 590, product: { id: 2, name: 'Classic Hoodie', description: 'Comfortable hoodie', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Hoodie', cost_price: 350, min_price: 500, stock: 50, created_at: '' } },
    { id: 3, shop_id: 1, product_id: 4, selling_price: 490, product: { id: 4, name: 'Leather Wallet', description: 'Genuine leather', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Wallet', cost_price: 200, min_price: 350, stock: 75, created_at: '' } },
  ],
};

export default function ShopPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<PublicShopData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadShop(slug);
  }, [slug]);

  const loadShop = async (shopSlug: string) => {
    try {
      setLoading(true);
      const response = await shopService.getBySlug(shopSlug);
      setShop(response.data.data as PublicShopData);
    } catch {
      // Use mock data if API fails
      if (shopSlug === 'super-gadgets') {
        setShop(mockShop);
      } else {
        setShop(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (productId: number) => {
    // Navigate to checkout with pre-selected product
    navigate(`/shop/${slug}/checkout`, { state: { productId } });
  };

  if (loading) return <LoadingSpinner />;

  if (!shop) {
    return (
      <EmptyState
        icon={Store}
        title="Shop Not Found"
        description="The shop you are looking for does not exist or has been removed."
      />
    );
  }

  return (
    <div>
      {/* Shop Header Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100/50" />
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <Store className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.shop_name}</h1>
          <p className="text-gray-500">Welcome to our store! Browse our high-quality products.</p>
        </div>
      </div>

      {/* Product Grid */}
      {shop.products.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No Products Yet"
          description="This shop currently has no products available."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shop.products.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-0.5">Price</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatCurrency(item.selling_price)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBuy(item.product.id)}
                    disabled={item.product.stock === 0}
                    className="btn-primary py-2 px-4 shadow-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
