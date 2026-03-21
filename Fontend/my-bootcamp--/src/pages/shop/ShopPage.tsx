import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, CheckCircle2, Package, ArrowRight, Sparkles, Star, MapPin, Search, X } from 'lucide-react';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/ui/shared';
import { Modal } from '@/components/ui/modal';
import { orderService } from '@/services/order.service';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

export default function ShopPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, setResellerEmail } = useCart();

  const [shopName, setShopName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0
  });

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addedItem, setAddedItem] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<any>(null);

  // Filter products by search query
  const filteredProducts = searchQuery.trim()
    ? products.filter(p => p.productName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : products;

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

      const response = await orderService.getApprovedShopProducts(shopSlug, page, 15);
      // Handle various response patterns (Axios-wrapped, direct body, or missing data)
      const rawData = (response as any)?.data || response;
      const data = (rawData as any)?.data || rawData || {};
      if (data && data.shopName) {
        setShopName(data.shopName);
        setProducts(data.productResponses || []); // Always replace
        setPagination({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.currentPage || 0
        });
        if (data.resellerEmail) {
          setResellerEmail(data.resellerEmail);
        }
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

  const handlePageChange = (newPage: number) => {
    if (slug) {
      loadShop(slug, newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
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
            <span className="text-white text-16px font-black">!</span>
          </div>
        </div>
        <p className="text-16px font-bold text-rose-400 uppercase tracking-[0.3em] mb-3">Error 404</p>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-3">ไม่พบร้านค้า</h1>
        <p className="text-neutral-500 max-w-16px leading-relaxed text-sm">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-8 sm:pt-16 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8">

            {/* Avatar */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-xl shrink-0 -mt-8 sm:-mt-6 relative">
              <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                <Store className="h-6 w-6 sm:h-10 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ff2b5e] text-white text-[10px] font-bold rounded-sm mb-2 shadow-sm uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                ร้านค้าแนะนำ
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight truncate mb-1.5">{shopName}</h1>

              <div className="flex items-center justify-center md:justify-start gap-4 text-16px text-neutral-500 font-medium">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  สินค้าทั้งหมด {pagination.totalElements} ชิ้น
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 gap-6 flex flex-col">

        {/* ── Search & Section Title ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-neutral-100 mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 uppercase tracking-tight">สินค้าทั้งหมด</h2>
            {searchQuery && (
              <span className="text-16px font-bold text-neutral-400">
                พบ {filteredProducts.length} ในหน้านี้ จาก {pagination.totalElements} รายการ
              </span>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full pl-10 pr-9 py-2.5 bg-neutral-50 border border-neutral-200/60 rounded-xl text-sm font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff2b5e]/20 focus:border-[#ff2b5e]/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 && searchQuery ? (
          <div className="py-24 bg-white rounded-2xl flex flex-col items-center gap-4 text-center border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center">
              <Search className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-lg font-bold text-neutral-700">ไม่พบสินค้าที่ค้นหา</p>
            <p className="text-sm text-neutral-400">ลองค้นหาด้วยคำอื่น หรือ <button onClick={() => setSearchQuery('')} className="text-[#ff2b5e] font-bold hover:underline">ดูสินค้าทั้งหมด</button></p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 bg-white rounded-2xl flex flex-col items-center gap-4 text-center border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-lg font-bold text-neutral-700">ยังไม่มีสินค้า</p>
            <p className="text-sm text-neutral-400">ร้านค้านี้ยังไม่ได้เพิ่มสินค้าจำหน่าย</p>
          </div>
        ) : (
          <>
            {/* ── Responsive Product Grid ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {[...filteredProducts].sort((a, b) => {
                // สินค้าที่มีสต็อก (stock > 0) แสดงก่อน, สินค้าหมด (stock <= 0) แสดงหลัง
                if (a.stock > 0 && b.stock <= 0) return -1;
                if (a.stock <= 0 && b.stock > 0) return 1;
                return 0;
              }).map((item: any, index: number) => {
                const isAdded = addedItem === item.productId;
                const outOfStock = item.stock <= 0;
                const cartItem = cartItems.find((ci: any) => ci.shopProduct.id === item.productId);
                const isMaxReached = cartItem && cartItem.quantity >= (item.stock || 0);

                return (
                  <div
                    key={`${item.productId}-${index}`}
                    className="w-full group bg-white rounded-[14px] overflow-hidden border border-neutral-100/80 hover:border-[#ff2b5e]/40 hover:shadow-[0_8px_20px_-8px_rgba(255,43,94,0.15)] transition-all duration-300 flex flex-col relative"
                  >

                    {/* Image */}
                    <div
                      className="relative aspect-square overflow-hidden bg-neutral-50 flex-shrink-0 cursor-pointer"
                      onClick={() => setViewProduct(item)}
                    >
                      <img
                        src={getImageUrl(item.imageUrl) || 'https://placehold.co/400x400?text=No+Image'}
                        alt={item.productName}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                      />

                      {/* Hover details overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-16px font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                          ดูรายละเอียด
                        </span>
                      </div>

                      {/* Out of stock overlay */}
                      {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                          <span className="px-3 py-1.5 bg-neutral-900/90 text-white text-[11px] font-bold rounded-lg shadow-sm">
                            สินค้าหมดชั่วคราว
                          </span>
                        </div>
                      )}

                      {/* Stock badge */}
                      {!outOfStock && (
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 bg-[#ff2b5e] text-white text-[9px] font-bold rounded shadow-sm">
                            🔥 เหลือ {item.stock} ชิ้น
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-2 sm:p-4 flex flex-col flex-1 gap-1.5 sm:gap-2">
                      <h3 className="text-[12px] sm:text-[13px] font-medium text-neutral-800 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#ff2b5e] transition-colors">
                        {item.productName}
                      </h3>

                      <div className="mt-auto flex flex-col">

                        {/* Selling Price */}
                        <div className="flex items-baseline text-[#ff2b5e] mb-2 sm:mb-3">
                          <span className="text-[11px] sm:text-[13px] font-bold mr-0.5">฿</span>
                          <span className="text-[16px] sm:text-[20px] font-bold tracking-tight">{Number(item.sellingPrice).toLocaleString()}</span>
                        </div>

                        {/* Enhanced Add to Cart Button */}
                        <button
                          onClick={() => !outOfStock && handleAddToCart(item)}
                          disabled={outOfStock || isAdded}
                          className={`
                            w-full h-8 sm:h-9 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[12px] font-bold
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
                          ) : isMaxReached ? (
                            'ครบตามจำนวนสต็อก'
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

            <Pagination
              pageIndex={pagination.currentPage}
              pageSize={15}
              totalElements={pagination.totalElements}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-8 pb-12"
            />
          </>
        )}
      </div>

      {/* ── Product Detail Modal ── */}
      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title="รายละเอียดสินค้า"
        size="md"
      >
        {viewProduct && (() => {
          const cartItem = cartItems.find((ci: any) => ci.shopProduct.id === viewProduct.productId);
          const isMaxReached = cartItem && cartItem.quantity >= (viewProduct.stock || 0);

          return (
            <div className="flex flex-col gap-6">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
                <img
                  src={getImageUrl(viewProduct.imageUrl) || 'https://placehold.co/400x400?text=No+Image'}
                  alt={viewProduct.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-neutral-900 leading-tight mb-2">{viewProduct.productName}</h4>
                  <div className="flex items-baseline text-[#ff2b5e]">
                    <span className="text-sm font-bold mr-1">฿</span>
                    <span className="text-3xl font-black tracking-tight">{Number(viewProduct.sellingPrice).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 italic space-y-2">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">รายละเอียด</p>
                  <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {viewProduct.description || 'ไม่มีรายละเอียดสินค้า'}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl bg-white">
                  <span className="text-16px font-bold text-neutral-500 uppercase tracking-wider">คงเหลือในระบบ</span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${viewProduct.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {viewProduct.stock > 0 ? `พร้อมส่ง ${viewProduct.stock} ชิ้น` : 'สินค้าหมด'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(viewProduct);
                    setViewProduct(null);
                  }}
                  disabled={viewProduct.stock <= 0 || isMaxReached}
                  className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#ff2b5e] hover:shadow-xl hover:shadow-[#ff2b5e]/20 transition-all active:scale-[0.98] disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none"
                >
                  {viewProduct.stock <= 0 ? 'สินค้าหมด' : isMaxReached ? 'ครบตามจำนวนสต็อก' : 'เพิ่มลงตะกร้า'}
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}