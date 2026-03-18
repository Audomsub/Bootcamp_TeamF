import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { shopService } from '@/services/shop.service';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { ShopProduct, Product } from '@/types';

type MyProductItem = ShopProduct & { product: Product };


export default function ResellerMyProducts() {
  const [products, setProducts] = useState<MyProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [editItem, setEditItem] = useState<MyProductItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const response = await shopService.getMyProducts();
      // Spring Page structure: { content: [], ... }
      setProducts(response.data.content || response.data.data || []);
    } catch (err) {
      console.error("Failed to load my products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!editItem) return;

    const price = Number(editPrice);
    if (isNaN(price) || price < editItem.product.min_price) {
      setError(`ราคาขายต้องไม่ต่ำกว่าราคาขั้นต่ำ (${formatCurrency(editItem.product.min_price)} บาท)`);
      return;
    }

    try {
      setUpdating(true);
      setError('');
      await shopService.updatePrice(editItem.id, price);
      setProducts(prev =>
        prev.map(p => p.id === editItem.id ? { ...p, selling_price: price } : p)
      );
      setEditItem(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถอัปเดตราคาได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await shopService.removeProduct(deleteId);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
    } catch {
      // handle error
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<MyProductItem>[] = [
    {
      id: 'product',
      header: 'สินค้า',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <img
            src={getImageUrl(row.original.product.image_url)}
            alt={row.original.product.name}
            className="w-12 h-12 rounded-xl object-cover bg-neutral-50 border border-neutral-100 shadow-sm"
          />
          <span className="font-semibold text-neutral-800">{row.original.product.name}</span>
        </div>
      ),
    },
    {
      id: 'min_price',
      header: 'ราคาขายขั้นต่ำ',
      cell: ({ row }) => (
        <span className="text-neutral-500 font-medium">{formatCurrency(row.original.product.min_price)}</span>
      ),
    },
    {
      accessorKey: 'selling_price',
      header: 'ราคาขายของคุณ',
      cell: ({ row }) => (
        <span className="font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
          {formatCurrency(row.original.selling_price)}
        </span>
      ),
    },
    {
      id: 'profit',
      header: 'กำไรโดยประมาณ',
      cell: ({ row }) => (
        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
          +{formatCurrency(row.original.selling_price - row.original.product.cost_price)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'จัดการ',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 px-2">
          <button
            onClick={() => {
              setEditItem(row.original);
              setEditPrice(row.original.selling_price.toString());
              setError('');
            }}
            className="p-2.5 rounded-full bg-white text-neutral-500 border border-neutral-200 shadow-sm hover:shadow-md hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95 group"
            title="แก้ไขราคา"
          >
            <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => setDeleteId(row.original.id)}
            className="p-2.5 rounded-full bg-white text-neutral-500 border border-neutral-200 shadow-sm hover:shadow-md hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95 group"
            title="ลบสินค้า"
          >
            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="สินค้าของฉัน" 
        subtitle="จัดการรายการสินค้าและกำหนดราคาขายบนหน้าร้านค้าของคุณ" 
      />

      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6">
        <DataTable
          columns={columns}
          data={products}
        />
      </div>

      <Modal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        title="แก้ไขราคาขาย"
        size="sm"
      >
        {editItem && (
          <div className="space-y-5">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-center gap-4">
              <img
                src={getImageUrl(editItem.product.image_url)}
                alt={editItem.product.name}
                className="w-12 h-12 rounded-lg object-cover bg-white shadow-sm border border-neutral-200"
              />
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-0.5 line-clamp-1">{editItem.product.name}</p>
                <p className="text-xs font-medium text-neutral-500">
                  ราคาขายขั้นต่ำ: <span className="text-neutral-700">{formatCurrency(editItem.product.min_price)}</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                ราคาขายใหม่ (บาท)
              </label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="input-field w-full text-lg font-bold text-primary-600"
                placeholder="ระบุราคาที่ต้องการขาย"
              />
              {error && (
                <p className="text-sm font-medium text-rose-500 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-neutral-100">
              <button 
                onClick={() => setEditItem(null)} 
                className="btn-secondary font-medium bg-white hover:bg-neutral-50" 
                disabled={updating}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleUpdatePrice} 
                disabled={updating} 
                className="btn-primary font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {updating ? 'กำลังบันทึก...' : 'บันทึกราคา'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleRemove}
        title="ยืนยันการลบสินค้า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้ออกจากหน้าร้านของคุณ? (การลบสินค้านี้จะไม่ส่งผลต่อประวัติคำสั่งซื้อที่ผ่านมา)"
        confirmText="ลบสินค้า"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}