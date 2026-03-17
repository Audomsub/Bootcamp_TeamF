import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { Modal } from '@/components/ui/modal';
import { shopService } from '@/services/shop.service';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

// Mock data
const mockCatalog: Product[] = [
  { id: 1, name: 'เสื้อยืดพรีเมียม', description: 'ผ้าฝ้ายคุณภาพสูง', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=T-Shirt', cost_price: 150, min_price: 250, stock: 100, created_at: '' },
  { id: 2, name: 'เสื้อฮู้ดคลาสสิก', description: 'เสื้อฮู้ดสวมใส่สบาย', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Hoodie', cost_price: 350, min_price: 500, stock: 50, created_at: '' },
  { id: 3, name: 'หมวกแก๊ปสปอร์ต', description: 'หมวกแก๊ปสปอร์ตปรับขนาดได้', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Cap', cost_price: 80, min_price: 150, stock: 200, created_at: '' },
  { id: 4, name: 'กระเป๋าสตางค์หนัง', description: 'หนังแท้', image_url: 'https://placehold.co/400x300/e2e8f0/64748b?text=Wallet', cost_price: 200, min_price: 350, stock: 75, created_at: '' },
];

export default function ResellerCatalog() {
  const [products, setProducts] = useState<Product[]>(mockCatalog);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const response = await shopService.getCatalog();
      setProducts(response.data.data);
    } catch {
      setProducts(mockCatalog);
    } finally {
      setLoading(false);
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
        product_id: selectedProduct.id,
        selling_price: price,
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
    <div>
      <PageHeader title="แคตตาล็อกสินค้า" subtitle="เลือกดูสินค้าที่พร้อมให้คุณเพิ่มลงในร้านค้าของคุณ">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">ราคาทุน</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(product.cost_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">ราคาขายขั้นต่ำ</p>
                  <p className="font-medium text-emerald-600">{formatCurrency(product.min_price)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                }`}>
                  {product.stock > 0 ? `เหลือ ${product.stock} ชิ้น` : 'สินค้าหมด'}
                </span>
                
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSellingPrice(product.min_price.toString());
                    setError('');
                  }}
                  disabled={product.stock === 0}
                  className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  เพิ่มลงร้านค้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title="เพิ่มสินค้าลงร้านค้า"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="text-gray-500">
                    ทุน: <strong className="text-gray-900">{formatCurrency(selectedProduct.cost_price)}</strong>
                  </span>
                  <span className="text-gray-500">
                    ราคาขั้นต่ำ: <strong className="text-emerald-600">{formatCurrency(selectedProduct.min_price)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="label">ราคาขายของคุณ (บาท)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="input-field text-lg"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                ต้องไม่ต่ำกว่า {formatCurrency(selectedProduct.min_price)}
              </p>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              
              {Number(sellingPrice) >= selectedProduct.min_price && (
                <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 text-sm">
                  กำไรโดยประมาณต่อชิ้น: <strong>{formatCurrency(Number(sellingPrice) - selectedProduct.cost_price)}</strong>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-secondary"
                disabled={adding}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddProduct}
                disabled={adding}
                className="btn-primary"
              >
                {adding ? 'กำลังเพิ่ม...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}