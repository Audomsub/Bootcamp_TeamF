import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { productService } from '@/services/product.service';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

// Mock data
const mockProducts: Product[] = [
  { id: 1, name: 'เสื้อยืดพรีเมียม', description: 'เสื้อยืดผ้าฝ้ายคุณภาพสูง', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=T-Shirt', cost_price: 150, min_price: 250, stock: 100, created_at: '2025-03-01' },
  { id: 2, name: 'เสื้อฮู้ดคลาสสิก', description: 'เสื้อฮู้ดสวมใส่สบาย', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Hoodie', cost_price: 350, min_price: 500, stock: 50, created_at: '2025-03-02' },
  { id: 3, name: 'หมวกแก๊ปสปอร์ต', description: 'หมวกสปอร์ตปรับขนาดได้', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Cap', cost_price: 80, min_price: 150, stock: 200, created_at: '2025-03-03' },
  { id: 4, name: 'กระเป๋าสตางค์หนังแท้', description: 'กระเป๋าสตางค์หนังแท้ 100%', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Wallet', cost_price: 200, min_price: 350, stock: 75, created_at: '2025-03-04' },
  { id: 5, name: 'รองเท้าวิ่ง', description: 'รองเท้าวิ่งน้ำหนักเบา', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Shoes', cost_price: 800, min_price: 1200, stock: 0, created_at: '2025-03-05' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data.data.data);
    } catch {
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      setError('');
      await productService.delete(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'ไม่สามารถลบสินค้าได้';
      if (message.toLowerCase().includes('order') || message.toLowerCase().includes('pending')) {
        setError('ไม่สามารถลบสินค้าได้: สินค้านี้มีคำสั่งซื้อที่ค้างอยู่ กรุณาจัดการคำสั่งซื้อให้เสร็จสิ้นหรือยกเลิกก่อนดำเนินการลบ');
      } else {
        setError(message);
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image_url',
      header: 'รูปภาพ',
      enableSorting: false,
      cell: ({ row }) => (
        <img
          src={row.original.image_url}
          alt={row.original.name}
          className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'ชื่อสินค้า',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.original.name}</p>
          <p className="text-sm text-neutral-500 truncate max-w-xs">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'cost_price',
      header: 'ต้นทุน',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-neutral-800 font-semibold">{formatCurrency(row.original.cost_price)}</span>
      ),
    },
    {
      accessorKey: 'min_price',
      header: 'ราคาขั้นต่ำ',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-neutral-500 font-medium">{formatCurrency(row.original.min_price)}</span>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'สถานะคลังสินค้า',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
          row.original.stock > 0 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {row.original.stock > 0 ? `มีสินค้า (${row.original.stock})` : 'สินค้าหมด'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'จัดการ',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            to={`/admin/products/edit/${row.original.id}`}
            className="p-2.5 rounded-full bg-white text-neutral-600 border border-neutral-100 shadow-sm hover:shadow-md hover:text-primary-600 hover:border-primary-100 transition-all active:scale-90 group"
            title="แก้ไขสินค้า"
          >
            <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </Link>
          <button
            onClick={() => setDeleteId(row.original.id)}
            className="p-2.5 rounded-full bg-white text-neutral-600 border border-neutral-100 shadow-sm hover:shadow-md hover:text-rose-600 hover:border-rose-100 transition-all active:scale-90 group"
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
    <div className="space-y-6">
      <PageHeader title="จัดการสินค้า" subtitle="ดูและจัดการรายการสินค้าในระบบทั้งหมด">
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span className="font-semibold">เพิ่มสินค้าใหม่</span>
        </Link>
      </PageHeader>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-sm font-medium text-rose-600 flex items-center gap-3 animate-in slide-in-from-top-2">
          <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse flex-shrink-0"></div>
          {error}
        </div>
      )}

      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6">
        <DataTable
          columns={columns}
          data={products}
          searchColumn="name"
          searchPlaceholder="ค้นหาจากชื่อสินค้า..."
        />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบสินค้า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
        confirmText="ลบสินค้า"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}