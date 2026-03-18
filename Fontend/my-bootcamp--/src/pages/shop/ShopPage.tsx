import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/ui/shared';
import { shopService } from '@/services/shop.service';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

export default function ShopPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [shopName, setShopName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addedItem, setAddedItem] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      setProducts([]);
      loadShop(slug, 0);
    }
  }, [slug]);

  const loadShop = async (shopSlug: string, page: number) => {
    try {
      if (page === 0) setLoading(true);
      else setLoadingMore(true);

      const response = await shopService.getBySlug(shopSlug, page, 12);
      // Backend returns ShopFrontResponse directly
      const data = (response.data as any).data || response.data;

      if (data && data.shopName) {
        setShopName(data.shopName);
        
        if (page === 0) {
          setProducts(data.productResponses || []);
        } else {
          setProducts(prev => [...prev, ...(data.productResponses || [])]);
        }

        setPagination({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.currentPage || 0
        });
      } else {
        setShopName('');
      }
    } catch (err) {
      console.error('Failed to load shop:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (slug && pagination.currentPage < pagination.totalPages - 1) {
      loadShop(slug, pagination.currentPage + 1);
    }
  };

  const handleAddToCart = (item: any) => {
    // Map to the format CartContext expects
    const cartItem = {
      ...item,
      id: item.id,
      selling_price: item.sellingPrice,
      product: {
        id: item.id,
        name: item.productName,
        image_url: item.imageUrl,
        stock: item.stock
      }
    };
    addToCart(cartItem, 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  if (loading) return <div className="py-20"><LoadingSpinner /></div>;

  if (!shopName && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100 shadow-sm">
          <Store className="h-12 w-12 text-rose-500" />
        </div>
        <h1 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter mb-4">404 ไม่พบร้านค้า</h1>
        <p className="text-neutral-500 max-w-sm font-medium tracking-tight leading-relaxed">
          ไม่มีร้านค้า <span className="text-neutral-900 font-bold">"{slug}"</span> ที่คุณกำลังค้นหาอยู่ในระบบของเรา
        </p>

      </div>
    );
  }

  return (
    <div className="pb-32 px-4 sm:px-0">
      <div className="px-4">
        <div className="flex items-end justify-between mb-12 border-b border-neutral-100 pb-8">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase">สินค้าของเรา ({pagination.totalElements})</h2>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mt-2">ประวัติร้านค้า: {shopName}</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="px-6 py-3 rounded-xl bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-200/50">
              หน้า {pagination.currentPage + 1} / {pagination.totalPages || 1}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="ยังไม่มีสินค้า"
            description="ร้านค้านี้ยังไม่มีสินค้าจำหน่ายในขณะนี้"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {products.map((item: any, index: number) => (
                <div key={`${item.id}-${index}`} className="group relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary-500/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>
                  <div className="glass-card !p-0 !bg-white/80 border-white shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 relative overflow-hidden flex flex-col h-full !rounded-[2rem]">
                    <div className="aspect-[5/4] overflow-hidden relative">
                      <img
                        src={item.imageUrl || 'https://placehold.co/400x300?text=No+Image'}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50">
                        <span className="text-[9px] font-black text-neutral-900">สต็อก: {item.stock}</span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <div className="mb-4">
                        <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1">In Stock</p>
                        <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight line-clamp-2 min-h-[3rem]">{item.productName}</h3>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-auto">
                        <div className="flex flex-col">
                          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">ราคาขาย</p>
                          <p className="text-2xl font-black text-neutral-900 tracking-tighter">
                            {formatCurrency(item.sellingPrice)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock <= 0}
                          className={`group/btn relative px-6 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg active:scale-95 ${item.stock <= 0
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none border border-neutral-200'
                              : addedItem === item.id
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-neutral-900 text-white hover:bg-primary-600 shadow-neutral-900/10'
                            }`}
                        >
                          {item.stock <= 0 ? (
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">หมด</span>
                          ) : addedItem === item.id ? (
                            <CheckCircle2 className="h-5 w-5 animate-in zoom-in duration-300" />
                          ) : (
                            <ShoppingCart className="h-5 w-5 stroke-[2.5px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.currentPage < pagination.totalPages - 1 && (
              <div className="mt-20 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-12 py-4 bg-neutral-900 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-600 transition-all disabled:opacity-50 hover:shadow-2xl active:scale-95"
                >
                  {loadingMore ? 'กำลังโหลดข้อมูล...' : 'โหลดสินค้าเพิ่มเติม'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}