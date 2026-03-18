import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, CheckCircle2, Package, ArrowRight, Sparkles, Star, MapPin } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/ui/shared';
import { shopService } from '@/services/shop.service';
import { formatCurrency, getImageUrl } from '@/lib/utils';
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
    const cartItem = {
      ...item,
      id: item.productId,
      product_id: item.productId,
      selling_price: item.sellingPrice,
      product: {
        id: item.productId,
        name: item.productName,
        image_url: getImageUrl(item.imageUrl),
        stock: item.stock
      }
    };
    addToCart(cartItem, 1);
    setAddedItem(item.productId);
    setTimeout(() => setAddedItem(null), 2000);
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center animate-pulse">
            <Store className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-400 font-medium tracking-wide">กำลังโหลดร้านค้า...</p>
        </div>
      </div>
    );
  }

  // ── 404 ──────────────────────────────────────────────────────
  if (!shopName && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center border border-rose-200/60 shadow-xl shadow-rose-100">
            <Store className="h-13 w-13 text-rose-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-black">!</span>
          </div>
        </div>
        <p className="text-xs font-bold text-rose-400 uppercase tracking-[0.3em] mb-3">Error 404</p>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-3">ไม่พบร้านค้า</h1>
        <p className="text-neutral-500 max-w-xs leading-relaxed text-sm">
          ร้านค้า <span className="text-neutral-800 font-semibold">"{slug}"</span> ไม่มีอยู่ในระบบ
          กรุณาตรวจสอบลิงก์อีกครั้ง
        </p>
      </div>
    );
  }

  const hasMore = pagination.currentPage < pagination.totalPages - 1;

  // ── Main ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">

      {/* ── Shop Header Banner ── */}
      <div className="bg-white shadow-sm relative overflow-hidden">
        {/* Cover Background (Gradient) */}
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-[#ff2b5e] via-pink-500 to-[#ff681a] opacity-90 blur-sm"></div>
        <div className="absolute inset-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 border-b border-black/10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-16 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl shrink-0 -mt-6 relative">
              <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                <Store className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff2b5e] text-white text-[10px] font-bold rounded-sm mb-2 shadow-sm uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                ร้านค้าแนะนำ
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight truncate mb-1.5">{shopName}</h1>

              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-neutral-500 font-medium">
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  สินค้าทั้งหมด {pagination.totalElements} ชิ้น
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 gap-6 flex flex-col">

        {/* ── Section Title ── */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-neutral-100 mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900 uppercase tracking-tight">สินค้าทั้งหมด</h2>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-24 bg-white rounded-2xl flex flex-col items-center gap-4 text-center border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-lg font-bold text-neutral-700">ยังไม่มีสินค้า</p>
            <p className="text-sm text-neutral-400">ร้านค้านี้ยังไม่ได้เพิ่มสินค้าจำหน่าย</p>
          </div>
        ) : (
          <>
            {/* ── Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {products.map((item: any, index: number) => {
                const isAdded = addedItem === item.productId;
                const outOfStock = item.stock <= 0;
                return (
                  <div
                    key={`${item.productId}-${index}`}
                    className="group bg-white rounded-[14px] overflow-hidden border border-neutral-100/80 hover:border-[#ff2b5e]/40 hover:shadow-[0_8px_20px_-8px_rgba(255,43,94,0.15)] transition-all duration-300 flex flex-col relative"
                  >

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-50 flex-shrink-0">
                      <img
                        src={getImageUrl(item.imageUrl) || 'https://placehold.co/400x400?text=No+Image'}
                        alt={item.productName}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                      />

                      {/* Out of stock overlay */}
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                          <span className="px-3 py-1.5 bg-neutral-900/90 text-white text-[11px] font-bold rounded-lg shadow-sm">
                            สินค้าหมดชั่วคราว
                          </span>
                        </div>
                      )}

                      {/* Stock badge */}
                      {!outOfStock && item.stock <= 10 && (
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 bg-[#ff2b5e] text-white text-[9px] font-bold rounded shadow-sm">
                            🔥 เหลือ {item.stock} ชิ้น
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
                      <h3 className="text-[13px] font-medium text-neutral-800 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#ff2b5e] transition-colors">
                        {item.productName}
                      </h3>

                      <div className="mt-auto flex flex-col">

                        {/* Selling Price */}
                        <div className="flex items-baseline text-[#ff2b5e] mb-3">
                          <span className="text-[13px] font-bold mr-0.5">฿</span>
                          <span className="text-[18px] sm:text-[20px] font-bold tracking-tight">{Number(item.sellingPrice).toLocaleString()}</span>
                        </div>

                        {/* Enhanced Add to Cart Button */}
                        <button
                          onClick={() => !outOfStock && handleAddToCart(item)}
                          disabled={outOfStock || isAdded}
                          className={`
                            w-full h-9 rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold
                            transition-all duration-300 active:scale-[0.98]
                            ${outOfStock
                              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                              : isAdded
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-neutral-900 text-white hover:bg-[#ff2b5e] hover:shadow-md'
                            }
                          `}
                          aria-label={outOfStock ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              ลงตะกร้าแล้ว
                            </>
                          ) : outOfStock ? (
                            'สินค้าหมด'
                          ) : (
                            <>
                              <ShoppingCart className="h-3.5 w-3.5" />
                              เพิ่มลงตะกร้า
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Load More ── */}
            {hasMore && (
              <div className="mt-12 flex justify-center pb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-white border border-neutral-200 text-neutral-700 text-[13px] font-bold rounded-xl hover:text-[#ff2b5e] hover:border-[#ff2b5e] transition-all duration-300 shadow-sm disabled:opacity-50 disabled:pointer-events-none min-w-[200px]"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                      <span>กำลังโหลด...</span>
                    </>
                  ) : (
                    <>
                      <span>ดูสินค้าเพิ่มเติม</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}