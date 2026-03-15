import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { productService } from '@/services/product.service';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

// Mock data
const mockProducts: Product[] = [
  { id: 1, name: 'Premium T-Shirt', description: 'High quality cotton t-shirt', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=T-Shirt', cost_price: 150, min_price: 250, stock: 100, created_at: '2025-03-01' },
  { id: 2, name: 'Classic Hoodie', description: 'Comfortable hoodie', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Hoodie', cost_price: 350, min_price: 500, stock: 50, created_at: '2025-03-02' },
  { id: 3, name: 'Sports Cap', description: 'Adjustable sports cap', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Cap', cost_price: 80, min_price: 150, stock: 200, created_at: '2025-03-03' },
  { id: 4, name: 'Leather Wallet', description: 'Genuine leather wallet', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Wallet', cost_price: 200, min_price: 350, stock: 75, created_at: '2025-03-04' },
  { id: 5, name: 'Running Shoes', description: 'Lightweight running shoes', image_url: 'https://placehold.co/100x100/e2e8f0/64748b?text=Shoes', cost_price: 800, min_price: 1200, stock: 30, created_at: '2025-03-05' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      await productService.delete(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    } catch {
      // handle error
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image_url',
      header: 'Image',
      enableSorting: false,
      cell: ({ row }) => (
        <img
          src={row.original.image_url}
          alt={row.original.name}
          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-xs">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'cost_price',
      header: 'Cost Price',
      cell: ({ row }) => (
        <span className="text-gray-900 font-medium">{formatCurrency(row.original.cost_price)}</span>
      ),
    },
    {
      accessorKey: 'min_price',
      header: 'Min Price',
      cell: ({ row }) => (
        <span className="text-gray-600">{formatCurrency(row.original.min_price)}</span>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <span className={`badge ${row.original.stock > 0 ? 'badge-approved' : 'badge-rejected'}`}>
          {row.original.stock}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/edit/${row.original.id}`}
            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteId(row.original.id)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage your product catalog">
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </PageHeader>

      <DataTable
        columns={columns}
        data={products}
        searchColumn="name"
        searchPlaceholder="Search products..."
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
