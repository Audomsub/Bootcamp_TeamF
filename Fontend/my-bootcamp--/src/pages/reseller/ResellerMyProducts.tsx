import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { shopService } from '@/services/shop.service';
import { formatCurrency } from '@/lib/utils';
import type { ShopProduct, Product } from '@/types';

type MyProductItem = ShopProduct & { product: Product };

// Mock data
const mockMyProducts: MyProductItem[] = [
  { id: 1, shop_id: 1, product_id: 1, selling_price: 299, product: { id: 1, name: 'Premium T-Shirt', description: '', image_url: 'https://placehold.co/100', cost_price: 150, min_price: 250, stock: 100, created_at: '' } },
  { id: 2, shop_id: 1, product_id: 2, selling_price: 590, product: { id: 2, name: 'Classic Hoodie', description: '', image_url: 'https://placehold.co/100', cost_price: 350, min_price: 500, stock: 50, created_at: '' } },
];

export default function ResellerMyProducts() {
  const [products, setProducts] = useState<MyProductItem[]>(mockMyProducts);
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
      setProducts(response.data.data);
    } catch {
      setProducts(mockMyProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!editItem) return;
    
    const price = Number(editPrice);
    if (isNaN(price) || price < editItem.product.min_price) {
      setError(`Selling price must be at least ${formatCurrency(editItem.product.min_price)}`);
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
      setError(err.response?.data?.message || 'Failed to update price');
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
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.product.image_url}
            alt={row.original.product.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
          />
          <span className="font-medium text-gray-900">{row.original.product.name}</span>
        </div>
      ),
    },
    {
      id: 'min_price',
      header: 'Min Price',
      cell: ({ row }) => (
        <span className="text-gray-500">{formatCurrency(row.original.product.min_price)}</span>
      ),
    },
    {
      accessorKey: 'selling_price',
      header: 'Your Selling Price',
      cell: ({ row }) => (
        <span className="font-semibold text-primary-600 pb-0.5 border-b border-primary-200">
          {formatCurrency(row.original.selling_price)}
        </span>
      ),
    },
    {
      id: 'profit',
      header: 'Estimated Profit',
      cell: ({ row }) => (
        <span className="font-medium text-emerald-600">
          {formatCurrency(row.original.selling_price - row.original.product.cost_price)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditItem(row.original);
              setEditPrice(row.original.selling_price.toString());
              setError('');
            }}
            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
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
      <PageHeader title="My Products" subtitle="Manage pricing for products in your shop" />

      <DataTable
        columns={columns}
        data={products}
      />

      <Modal
        isOpen={editItem !== null}
        onClose={() => setEditItem(null)}
        title="Edit Selling Price"
        size="sm"
      >
        {editItem && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">{editItem.product.name}</p>
              <p className="text-xs text-gray-500">Min Price: {formatCurrency(editItem.product.min_price)}</p>
            </div>
            
            <div>
              <label className="label">New Selling Price</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="input-field"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setEditItem(null)} className="btn-secondary" disabled={updating}>Cancel</button>
              <button onClick={handleUpdatePrice} disabled={updating} className="btn-primary">
                {updating ? 'Saving...' : 'Update Price'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleRemove}
        title="Remove Product"
        message="Are you sure you want to remove this product from your shop?"
        confirmText="Remove"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
