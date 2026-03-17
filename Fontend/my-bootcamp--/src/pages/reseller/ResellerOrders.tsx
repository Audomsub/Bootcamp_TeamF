import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { Order } from '@/types';

// Mock data (ปรับชื่อสินค้าเล็กน้อยเพื่อความสมจริง)
const mockOrders: Order[] = [
  { id: 1, order_number: 'ORD-ABC123', shop_id: 1, customer_name: 'สมชาย รักดี', customer_phone: '0812345678', shipping_address: 'กรุงเทพมหานคร', total_amount: 1500, reseller_profit: 300, status: 'pending', created_at: '2025-03-12', items: [{ id: 1, order_id: 1, product_id: 1, product_name: 'เสื้อยืดพรีเมียม', cost_price: 150, selling_price: 250, quantity: 2 }, { id: 2, order_id: 1, product_id: 2, product_name: 'เสื้อฮู้ดดี้คลาสสิก', cost_price: 350, selling_price: 500, quantity: 1 }] },
  { id: 2, order_number: 'ORD-DEF456', shop_id: 1, customer_name: 'สมหญิง ใจงาม', customer_phone: '0898765432', shipping_address: 'เชียงใหม่', total_amount: 2400, reseller_profit: 600, status: 'shipped', created_at: '2025-03-11', items: [{ id: 3, order_id: 2, product_id: 5, product_name: 'รองเท้าวิ่ง นุ่มสบาย', cost_price: 800, selling_price: 1200, quantity: 2 }] },
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
      header: 'รหัสออเดอร์',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold text-primary-600">
          {row.original.order_number}
        </span>
      ),
    },
    {
      accessorKey: 'customer_name',
      header: 'ลูกค้า',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.original.customer_name}</p>
          <p className="text-xs font-medium text-neutral-500 mt-0.5">{row.original.customer_phone}</p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'รายการสินค้า',
      cell: ({ row }) => (
        <div className="max-w-xs flex flex-wrap gap-1">
          {row.original.items?.map((item, i) => (
            <span key={i} className="text-xs font-medium text-neutral-600 bg-neutral-100/80 px-2 py-1 rounded-md border border-neutral-200/60">
              {item.product_name} <span className="text-neutral-400">x{item.quantity}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'ยอดรวม',
      cell: ({ row }) => (
        <span className="font-semibold text-neutral-800">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: 'reseller_profit',
      header: 'กำไรของคุณ',
      cell: ({ row }) => (
        <span className="inline-flex font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
          +{formatCurrency(row.original.reseller_profit)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'สถานะ',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={cn(
            "inline-flex px-3 py-1.5 rounded-full text-xs font-medium border",
            status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            status === 'shipped' ? "bg-primary-50 text-primary-700 border-primary-100" :
            "bg-amber-50 text-amber-700 border-amber-100"
          )}>
            {status === 'completed' ? 'เสร็จสิ้น' : status === 'shipped' ? 'จัดส่งแล้ว' : 'รอดำเนินการ'}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'วันที่สั่งซื้อ',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-neutral-500">{formatDate(row.original.created_at)}</span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="รายการคำสั่งซื้อ" 
        subtitle="ติดตามและตรวจสอบรายการสั่งซื้อทั้งหมดจากหน้าร้านของคุณ" 
      />

      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6">
        <DataTable
          columns={columns}
          data={orders}
          searchColumn="order_number"
          searchPlaceholder="ค้นหาจากรหัสคำสั่งซื้อ..."
        />
      </div>
    </div>
  );
}