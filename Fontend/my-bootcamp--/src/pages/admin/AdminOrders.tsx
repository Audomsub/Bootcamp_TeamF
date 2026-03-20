import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Truck, Download, CheckCircle2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { Order } from '@/types';


export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [shipId, setShipId] = useState<number | null>(null);
  const [completeId, setCompleteId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      const data = response.data?.data?.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const BOM = '\uFEFF';
    const headers = ['รหัสออเดอร์', 'ลูกค้า', 'ร้านค้าตัวแทน', 'สินค้า', 'ยอดรวม', 'กำไรตัวแทน', 'สถานะ', 'วันที่'];
    const rows = orders.map(o => [
      o.order_number,
      o.customer_name,
      o.shop?.shop_name || '-',
      `"${(o.items || []).map(i => `${i.product_name} x${i.quantity}`).join(', ')}"`,
      o.total_amount,
      o.reseller_profit,
      o.status === 'completed' ? 'เสร็จสิ้น' : o.status === 'shipped' ? 'จัดส่งแล้ว' : 'รอดำเนินการ',
      o.created_at || '-',
    ]);
    const csv = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShip = async () => {
    if (!shipId) return;
    try {
      setProcessing(true);
      await orderService.updateStatus(shipId, 'shipped');
      setOrders((prev) =>
        prev.map((o) => (o.id === shipId ? { ...o, status: 'shipped' as const } : o))
      );
    } catch (err: any) {
      const msg = err?.response?.data || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ';
      alert(typeof msg === 'string' ? msg : 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setProcessing(false);
      setShipId(null);
    }
  };

  const handleComplete = async () => {
    if (!completeId) return;
    try {
      setProcessing(true);
      await orderService.updateStatus(completeId, 'completed');
      setOrders((prev) =>
        prev.map((o) => (o.id === completeId ? { ...o, status: 'completed' as const } : o))
      );
    } catch (err: any) {
      const msg = err?.response?.data || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ';
      alert(typeof msg === 'string' ? msg : 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setProcessing(false);
      setCompleteId(null);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: 'หมายเลขคำสั่งซื้อ',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-semibold text-primary-600">
          {row.original.order_number}
        </span>
      ),
    },
    {
      id: 'shop_name',
      header: 'ร้านค้าตัวแทน',
      cell: ({ row }) => <span className="font-semibold text-neutral-800">{row.original.shop?.shop_name || '-'}</span>,
    },
    {
      accessorKey: 'customer_name',
      header: 'ลูกค้า',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-neutral-800">{row.original.customer_name}</p>
          <p className="text-sm text-neutral-500">{row.original.customer_phone}</p>
        </div>
      ),
    },
    {
      id: 'products',
      header: 'สินค้า',
      cell: ({ row }) => (
        <div className="max-w-xs">
          {row.original.items?.map((item, i) => (
            <span key={i} className="text-sm text-neutral-600">
              {item.product_name} x{item.quantity}
              {i < (row.original.items?.length || 0) - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'ยอดรวม',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="font-semibold text-neutral-800">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'วันที่',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-sm text-neutral-500 font-medium">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'สถานะ',
      meta: { align: 'center' },
      cell: ({ row }) => {
        const status = row.original.status;
        
        // แปลงสถานะเป็นภาษาไทย
        let statusText = '';
        if (status === 'completed') statusText = 'เสร็จสิ้น';
        else if (status === 'shipped') statusText = 'จัดส่งแล้ว';
        else statusText = 'รอดำเนินการ';

        return (
          <span className={cn(
            "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
            status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            status === 'shipped' ? "bg-primary-50 text-primary-700 border-primary-100" :
            "bg-amber-50 text-amber-700 border-amber-100"
          )}>
            {statusText}
          </span>
        );
      },
    },
    {
      accessorKey: 'reseller_profit',
      header: 'กำไรตัวแทน',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="text-right">
          <p className="font-semibold text-emerald-600">
            +{formatCurrency(row.original.reseller_profit)}
          </p>
          <p className="text-xs font-medium text-neutral-500 mt-0.5">เข้ากระเป๋าเงิน</p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'จัดการ',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => {
        const { status, id } = row.original;
        if (status === 'completed') return <div className="h-9" />;
        
        return (
          <div className="flex items-center justify-end">
            {status === 'pending' && (
              <button
                onClick={() => setShipId(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm hover:shadow-md hover:bg-emerald-100/50 hover:border-emerald-200 transition-all active:scale-95 group font-semibold text-sm"
              >
                <Truck className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                จัดส่งสินค้า
              </button>
            )}
            {status === 'shipped' && (
              <button
                onClick={() => setCompleteId(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm hover:shadow-md hover:bg-blue-100/50 hover:border-blue-200 transition-all active:scale-95 group font-semibold text-sm"
              >
                <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                ส่งมอบเสร็จสิ้น
              </button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="รายการคำสั่งซื้อ" 
        subtitle="ดูและจัดการคำสั่งซื้อทั้งหมดในระบบ" 
      >
        <button
          onClick={exportCSV}
          disabled={orders.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </PageHeader>

      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6">
        <DataTable
          columns={columns}
          data={orders}
          searchColumn="order_number"
          searchPlaceholder="ค้นหาด้วยหมายเลขคำสั่งซื้อ..."
        />
      </div>

      <ConfirmDialog
        isOpen={shipId !== null}
        onClose={() => setShipId(null)}
        onConfirm={handleShip}
        title="ยืนยันการจัดส่ง"
        message="คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะคำสั่งซื้อนี้เป็น 'จัดส่งแล้ว'? ระบบจะส่งการแจ้งเตือนไปยังลูกค้า"
        confirmText="ยืนยันการจัดส่ง"
        isLoading={processing}
      />

      <ConfirmDialog
        isOpen={completeId !== null}
        onClose={() => setCompleteId(null)}
        onConfirm={handleComplete}
        title="ยืนยันการเสร็จสิ้นออเดอร์"
        message="คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานะคำสั่งซื้อนี้เป็น 'เสร็จสิ้น'? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        confirmText="ส่งมอบเสร็จสิ้น"
        isLoading={processing}
      />
    </div>
  );
}