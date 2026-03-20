import { useEffect, useState } from 'react';
import { Search, Plus, Package, CheckCircle2, TrendingUp, ShoppingCart, ArrowRight } from 'lucide-react';
import { PageHeader, LoadingSpinner, Pagination } from '@/components/ui/shared';
import { Modal } from '@/components/ui/modal';
import { shopService } from '@/services/shop.service';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product } from '@/types';


export default function ResellerCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCatalog(0, true);
  }, []);

  const loadCatalog = async (pageToLoad: number, isInitial: boolean = false) => {
    try {
      setLoading(true);
      const response = await shopService.getCatalog(pageToLoad);
      const data = response.data;

      const content = Array.isArray(data) ? data : (data.content || []);

      const mappedProducts = content.map((p: any) => ({
        id: p.productId || p.id,
        name: p.productName || p.name,
        description: p.description || '',
        image_url: getImageUrl(p.imageUrl || p.image_url),
        cost_price: p.costPrice || p.cost_price,
        min_price: p.minSellPrice || p.min_price,
        stock: p.stock || 0,
        is_added: p.isAdded || false,
        created_at: p.createdAt || ''
      }));

      if (Array.isArray(data)) {
        setProducts(mappedProducts);
        setTotalPages(1);
        setTotalElements(mappedProducts.length);
        setHasMore(false);
        setPage(0);
      } else {
        setProducts(mappedProducts); // Replace, don't append
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setHasMore(!data.last);
        setPage(data.number || 0);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadCatalog(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadCatalog(page + 1);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) return;

    const price = Number(sellingPrice);
    if (isNaN(price) || price < selectedProduct.min_price) {
      setError(`ราคาขายต้องไม่ต่ำกว่า ${formatCurrency(selectedProduct.min_price)}`);
      return;
    }

    try {
      setAdding(true);
      setError('');
      await shopService.addProduct({
        productId: selectedProduct.id,
        sellingPrice: price,
      });
      // Show success toast or feedback
      setSelectedProduct(null);
      setSellingPrice('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าลงในร้านค้าได้');
    } finally {
      setAdding(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-32 px-6 sm:px-10 lg:px-0 animate-in fade-in duration-1000 font-sans">
      {/* Visual background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.03),transparent_40%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-neutral-100 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6 shadow-sm">
              <Package className="h-4 w-4 text-primary-600" />
              <span className="text-[11px] font-bold text-primary-700 tracking-wider uppercase">Product Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight mb-4 text-center md:text-left">แคตตาล็อกสินค้า</h1>
            <p className="text-neutral-500 font-bold tracking-widest text-xs uppercase">เลือกดูสินค้าที่พร้อมให้คุณเพิ่มลงในร้านค้าของคุณ</p>
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-600 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-neutral-200/60 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300 font-medium text-neutral-900 placeholder:text-neutral-400 shadow-sm uppercase tracking-wide text-sm"
            />
          </div>
        </div>

        {/* ── Balanced Flex Grid ── */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {filteredProducts.map((product) => {
            const outOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="w-full sm:w-[280px] md:w-[240px] lg:w-[220px] xl:w-[240px] group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                  />
                  
                  {/* Out of stock overlay */}
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                      <span className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        สินค้าหมด
                      </span>
                    </div>
                  )}

                  {/* Stock badge */}
                  {!outOfStock && product.stock <= 10 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold rounded-lg shadow-sm">
                        เหลือ {product.stock} ชิ้น
                      </span>
                    </div>
                  )}
                  {!outOfStock && product.stock > 10 && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-md border border-neutral-200/50 text-neutral-700 text-[9px] font-bold rounded-lg shadow-sm">
                        สต็อก: {product.stock}
                      </span>
                    </div>
                  )}

                  {/* Profit Badge Overlay */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-bold text-[10px] shadow-lg">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span>กำไรขั้นต่ำ {formatCurrency(Math.max(0, product.min_price - product.cost_price))}</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <h3 className="text-sm font-bold text-neutral-800 leading-snug line-clamp-2 flex-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider mb-0.5">ราคาทุน</span>
                      <span className="text-xs font-black text-neutral-900">{formatCurrency(product.cost_price)}</span>
                    </div>
                    <div className="w-px h-6 bg-neutral-100"></div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider mb-0.5">บังคับขาย (เริ่ม)</span>
                      <span className="text-[13px] font-black text-rose-500">{formatCurrency(product.min_price)}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    {product.is_added ? (
                      <button
                        onClick={() => window.location.href = '/reseller/my-products'}
                        className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        อยู่ในร้านแล้ว
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setSellingPrice(product.min_price.toString());
                          setError('');
                        }}
                        disabled={outOfStock}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          !outOfStock
                            ? 'bg-neutral-900 text-white hover:bg-primary-600 shadow-md hover:shadow-lg active:scale-[0.98]'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                        }`}
                      >
                        {!outOfStock ? (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            เพิ่มลงร้านค้า
                          </>
                        ) : (
                          'สินค้าหมดชั่วคราว'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination
          pageIndex={page}
          pageSize={20}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      </div>

      <Modal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title="ตั้งราคาขายสินค้า"
      >
        {selectedProduct && (
          <div className="space-y-8 p-2 font-sans">
            {/* Product Summary */}
            <div className="flex gap-5 p-5 bg-neutral-50 rounded-2xl border border-neutral-100/60">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-neutral-900 text-sm line-clamp-2 leading-tight mb-2">{selectedProduct.name}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">ราคาทุน</span>
                    <strong className="text-neutral-900 text-sm">{formatCurrency(selectedProduct.cost_price)}</strong>
                  </div>
                  <div className="w-px h-6 bg-neutral-200"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">ราคาขั้นต่ำ</span>
                    <strong className="text-primary-600 text-sm">{formatCurrency(selectedProduct.min_price)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Input */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-900 uppercase tracking-widest ml-1">ราคาขายของคุณ (บาท)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-neutral-400">฿</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full px-6 py-5 pl-12 rounded-2xl bg-white border border-neutral-200 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-black text-2xl text-neutral-900 placeholder:text-neutral-300"
                  placeholder="0.00"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                  {error}
                </div>
              )}

              {/* Estimated Profit Banner */}
              {Number(sellingPrice) >= selectedProduct.min_price && (
                <div className="mt-6 p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[30px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">กำไรสุทธิต่อชิ้น</p>
                        <p className="text-[10px] opacity-70 mt-0.5">* เมื่อหักต้นทุนแล้ว</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black tracking-tight shrink-0">
                      +{formatCurrency(Number(sellingPrice) - selectedProduct.cost_price)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-wide bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                disabled={adding}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddProduct}
                disabled={adding || Number(sellingPrice) < selectedProduct.min_price}
                className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-wide bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {adding ? (
                  <>
                    <LoadingSpinner />
                    กำลังเพิ่ม...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    ยืนยันเพิ่มเข้าลิตส์
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}