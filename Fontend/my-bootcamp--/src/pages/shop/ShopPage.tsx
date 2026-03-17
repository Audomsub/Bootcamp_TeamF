import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/ui/shared';
import { shopService } from '@/services/shop.service';
import { formatCurrency } from '@/lib/utils';
import type { Shop, ShopProduct, Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

type PublicShopData = Shop & { products: (ShopProduct & { product: Product })[] };

// Mock data
const mockShop: PublicShopData = {
  id: 1,
  user_id: 1,
  shop_name: 'Super Gadgets Store',
  shop_slug: 'super-gadgets',
  products: [
    { id: 1, shop_id: 1, product_id: 1, selling_price: 299, product: { id: 1, name: 'เสื้อยืดพรีเมียม', description: 'ผ้าฝ้ายคุณภาพสูง เนื้อผ้านุ่มสบาย', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=T-Shirt', cost_price: 150, min_price: 250, stock: 100, created_at: '' } },
    { id: 2, shop_id: 1, product_id: 2, selling_price: 590, product: { id: 2, name: 'เสื้อฮู้ดคลาสสิก', description: 'เสื้อฮู้ดสวมใส่สบาย ให้ความอบอุ่นได้ดี', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Hoodie', cost_price: 350, min_price: 500, stock: 50, created_at: '' } },
    { id: 3, shop_id: 1, product_id: 4, selling_price: 490, product: { id: 4, name: 'กระเป๋าสตางค์หนัง', description: 'ผลิตจากหนังแท้ ดีไซน์เรียบหรูทนทาน', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Wallet', cost_price: 200, min_price: 350, stock: 75, created_at: '' } },
  ],
};

const premiumMockShop: PublicShopData = {
  id: 99,
  user_id: 1,
  shop_name: 'The Premium Luxe',
  shop_slug: 'premium-boutique',
  products: [
    { id: 101, shop_id: 99, product_id: 201, selling_price: 1250, product: { id: 201, name: 'เสื้อยืด Urban Alpha', description: 'ผ้าฝ้ายหนา 400GSM ทรงสปอร์ต ดีไซน์มินิมอลโทนสีชาโคล', image_url: '/images/mock/tshirt.png', cost_price: 400, min_price: 800, stock: 120, created_at: '' } },
    { id: 102, shop_id: 99, product_id: 202, selling_price: 3400, product: { id: 202, name: 'เสื้อฮู้ด Forest Synth', description: 'ผ้าฟลีซเนื้อแน่นเคลือบกันน้ำ ดีไซน์ฮู้ดตามหลักสรีรศาสตร์พร้อมแต่งขอบสีมรกต', image_url: '/images/mock/hoodie.png', cost_price: 1200, min_price: 2400, stock: 45, created_at: '' } },
    { id: 103, shop_id: 99, product_id: 203, selling_price: 8500, product: { id: 203, name: 'หูฟัง Quantum Over-Ear', description: 'ระบบตัดเสียงรบกวนอัจฉริยะ ใช้งานต่อเนื่อง 60 ชั่วโมง วัสดุอะลูมิเนียมเกรดการบินสีเงินด้าน', image_url: '/images/mock/headphones.png', cost_price: 3500, min_price: 6000, stock: 15, created_at: '' } },
    { id: 104, shop_id: 99, product_id: 204, selling_price: 12900, product: { id: 204, name: 'สมาร์ทวอทช์ Apex Chrono', description: 'กระจกแซฟไฟร์พร้อมตัวเรือนไทเทเนียม ระบบสั่นตอบสนองและเซ็นเซอร์วัดสุขภาพขั้นสูง', image_url: '/images/mock/smartwatch.png', cost_price: 5000, min_price: 9500, stock: 8, created_at: '' } },
    { id: 105, shop_id: 99, product_id: 205, selling_price: 1850, product: { id: 205, name: 'กระเป๋าสตางค์ Carbon Heritage', description: 'หนังฟอกฝาดสีคอนยัค มีระบบป้องกัน RFID พร้อมช่องใส่บัตร 6 ช่องที่หยิบใช้งานสะดวก', image_url: '/images/mock/wallet.png', cost_price: 600, min_price: 1200, stock: 60, created_at: '' } },
  ],
};

export default function ShopPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [shop, setShop] = useState<PublicShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState<number | null>(null);

  useEffect(() => {
    if (slug) loadShop(slug);
  }, [slug]);

  const loadShop = async (shopSlug: string) => {
    try {
      setLoading(true);
      const response = await shopService.getBySlug(shopSlug);
      setShop(response.data.data as PublicShopData);
    } catch {
      // ใช้ข้อมูลจำลอง (Mock data) หากไม่สามารถดึงจาก API ได้
      if (shopSlug === 'premium-boutique') {
        setShop(premiumMockShop);
      } else if (shopSlug === 'super-gadgets') {
        setShop(mockShop);
      } else {
        setShop(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: ShopProduct & { product: Product }) => {
    addToCart(item, 1);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  if (loading) return <LoadingSpinner />;

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100 shadow-sm">
          <Store className="h-12 w-12 text-rose-500" />
        </div>
        <h1 className="text-4xl font-black text-neutral-900 uppercase tracking-tighter mb-4">404 ไม่พบร้านค้า</h1>
        <p className="text-neutral-500 max-w-sm font-medium tracking-tight leading-relaxed">
          ไม่มีร้านค้า <span className="text-neutral-900 font-bold">"{slug}"</span> ที่คุณกำลังค้นหาอยู่ในระบบของเรา
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-12 btn-primary px-10 py-4 !rounded-2xl"
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 sm:px-0">

      {/* Product Discovery Row */}
      <div className="px-4">
        <div className="flex items-end justify-between mb-12 border-b border-neutral-100 pb-8">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase">สินค้าของเรา</h2>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mt-2">คลังสินค้า: มีจำหน่าย</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="px-6 py-3 rounded-xl bg-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-neutral-200">ค้นหาแบบละเอียด</button>
            <button className="px-6 py-3 rounded-xl bg-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-neutral-200">จัดเรียงตาม</button>
          </div>
        </div>

        {shop.products.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="ยังไม่มีสินค้า"
            description="ร้านค้านี้ยังไม่มีสินค้าจำหน่ายในขณะนี้"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {shop.products.map((item) => (
              <div key={item.id} className="group relative">
                {/* Magnetic Card Effect */}
                <div className="absolute -inset-4 bg-gradient-to-b from-primary-500/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl"></div>

                <div className="glass-card !p-0 !bg-white/80 border-white shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 relative overflow-hidden flex flex-col h-full !rounded-[2rem]">
                  {/* Visual Node */}
                  <div className="aspect-[5/4] overflow-hidden relative">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white/50">
                      <span className="text-[9px] font-black text-neutral-900 tracking-tighter">สินค้าคงเหลือ: {item.product.stock}</span>
                    </div>
                  </div>

                  {/* Metadata Sector */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-4">
                      <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mb-1">สินค้ามาใหม่</p>
                      <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-primary-600 transition-colors">{item.product.name}</h3>
                    </div>

                    <p className="text-sm text-neutral-500 font-medium line-clamp-2 leading-relaxed mb-8 flex-1">
                      {item.product.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">ราคา</p>
                        <p className="text-2xl font-black text-neutral-900 tracking-tighter">
                          {formatCurrency(item.selling_price)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={item.product.stock <= 0}
                        className={`group/btn relative px-6 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg active:scale-95 ${
                          item.product.stock <= 0
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none border border-neutral-200'
                            : addedItem === item.id
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-neutral-900 text-white hover:bg-primary-600 shadow-neutral-900/10'
                        }`}
                      >
                        {item.product.stock <= 0 ? (
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">สินค้าหมด</span>
                        ) : addedItem === item.id ? (
                          <CheckCircle2 className="h-6 w-6 animate-in zoom-in duration-300" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 stroke-[2.5px]" />
                            <span className="hidden group-hover:block text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-left-2 duration-300">เพิ่มลงตะกร้า</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}