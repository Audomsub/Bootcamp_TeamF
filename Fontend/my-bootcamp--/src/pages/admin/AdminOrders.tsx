import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Truck } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { Order } from '@/types';

// Mock data
const mockOrders: Order[] = [
  { id: 1, order_number: 'ORD-ABC123', shop_id: 1, customer_name: 'สมชาย', customer_phone: '0812345678', shipping_address: 'กรุงเทพ', total_amount: 1500, reseller_profit: 300, status: 'pending', created_at: '2025-03-12', shop: { id: 1, user_id: 1, shop_name: 'JD Store', shop_slug: 'jd-store' }, items: [{ id: 1, order_id: 1, product_id: 1, product_name: 'Premium T-Shirt', cost_price: 150, selling_price: 250, quantity: 2 }, { id: 2, order_id: 1, product_id: 2, product_name: 'Classic Hoodie', cost_price: 350, selling_price: 500, quantity: 1 }] },
  { id: 2, order_number: 'ORD-DEF456', shop_id: 1, customer_name: 'สมหญิง', customer_phone: '0898765432', shipping_address: 'เชียงใหม่', total_amount: 2400, reseller_profit: 600, status: 'shipped', created_at: '2025-03-11', shop: { id: 1, user_id: 1, shop_name: 'JD Store', shop_slug: 'jd-store' }, items: [{ id: 3, order_id: 2, product_id: 5, product_name: 'Running Shoes', cost_price: 800, selling_price: 1200, quantity: 2 }] },
  { id: 3, order_number: 'ORD-GHI789', shop_id: 2, customer_name: 'สมศรี', customer_phone: '0867891234', shipping_address: 'ภูเก็ต', total_amount: 750, reseller_profit: 150, status: 'completed', created_at: '2025-03-10', shop: { id: 2, user_id: 2, shop_name: 'JS Shop', shop_slug: 'js-shop' }, items: [{ id: 4, order_id: 3, product_id: 1, product_name: 'Premium T-Shirt', cost_price: 150, selling_price: 250, quantity: 3 }] },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [shipId, setShipId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data.data.data);
    } catch {
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    if (!shipId) return;
    try {
      setProcessing(true);
      await orderService.updateStatus(shipId, 'shipped');
      setOrders((prev) =>
        prev.map((o) => (o.id === shipId ? { ...o, status: 'shipped' as const } : o))
      );
    } catch {
      // handle error
    } finally {
      setProcessing(false);
      setShipId(null);
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
      id: 'shop_name',
      header: 'Reseller Shop',
      cell: ({ row }) => <span className="font-bold text-neutral-800">{row.original.shop?.shop_name || '-'}</span>,
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
      id: 'products',
      header: 'PRODUCTS',
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
      header: 'TOTAL AMOUNT',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="font-bold text-neutral-900 tracking-tight">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'DATE',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-neutral-500 font-medium">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      meta: { align: 'center' },
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
      accessorKey: 'reseller_profit',
      header: 'ESTIMATED PROFIT',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="text-right">
          <p className="font-bold text-emerald-600 tracking-tight">
            +{formatCurrency(row.original.reseller_profit)}
          </p>
          <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">To Wallet</p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.status !== 'pending') return <div className="h-9" />; // Maintain row height
        return (
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShipId(row.original.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm hover:shadow-md hover:bg-emerald-100/50 hover:border-emerald-200 transition-all active:scale-95 group font-bold text-xs"
            >
              <Truck className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              SHIP ORDER
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Orders" subtitle="View and manage all orders" />

      <DataTable
        columns={columns}
        data={orders}
        searchColumn="order_number"
        searchPlaceholder="Search by order number..."
      />

      <ConfirmDialog
        isOpen={shipId !== null}
        onClose={() => setShipId(null)}
        onConfirm={handleShip}
        title="Mark as Shipped"
        message="Are you sure you want to mark this order as shipped? The customer will be notified."
        confirmText="Mark as Shipped"
        isLoading={processing}
      />
    </div>
  );
}
