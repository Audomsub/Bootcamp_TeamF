import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { Order } from '@/types';

// Mock data
const mockOrders: Order[] = [
  { id: 1, order_number: 'ORD-ABC123', shop_id: 1, customer_name: 'สมชาย', customer_phone: '0812345678', shipping_address: 'กรุงเทพ', total_amount: 1500, reseller_profit: 300, status: 'pending', created_at: '2025-03-12', items: [{ id: 1, order_id: 1, product_id: 1, product_name: 'Premium T-Shirt', cost_price: 150, selling_price: 250, quantity: 2 }, { id: 2, order_id: 1, product_id: 2, product_name: 'Classic Hoodie', cost_price: 350, selling_price: 500, quantity: 1 }] },
  { id: 2, order_number: 'ORD-DEF456', shop_id: 1, customer_name: 'สมหญิง', customer_phone: '0898765432', shipping_address: 'เชียงใหม่', total_amount: 2400, reseller_profit: 600, status: 'shipped', created_at: '2025-03-11', items: [{ id: 3, order_id: 2, product_id: 5, product_name: 'Running Shoes', cost_price: 800, selling_price: 1200, quantity: 2 }] },
];

export default function ResellerOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data.data.data);
    } catch {
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: 'ORDER NUMBER',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold text-primary-600">
          {row.original.order_number}
        </span>
      ),
    },
    {
      accessorKey: 'customer_name',
      header: 'CUSTOMER',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.customer_name}</p>
          <p className="text-xs text-gray-500">{row.original.customer_phone}</p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'ITEMS',
      cell: ({ row }) => (
        <div className="max-w-xs">
          {row.original.items?.map((item, i) => (
            <span key={i} className="text-xs text-gray-600">
              {item.product_name} x{item.quantity}
              {i < (row.original.items?.length || 0) - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'TOTAL',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: 'reseller_profit',
      header: 'MY PROFIT',
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-600">
          +{formatCurrency(row.original.reseller_profit)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={cn(
            "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            status === 'shipped' ? "bg-primary-50 text-primary-700 border-primary-100" :
            "bg-amber-50 text-amber-700 border-amber-100"
          )}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'DATE',
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">{formatDate(row.original.created_at)}</span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Orders" subtitle="Track orders placed in your shop" />

      <DataTable
        columns={columns}
        data={orders}
        searchColumn="order_number"
        searchPlaceholder="Search by order number..."
      />
    </div>
  );
}
