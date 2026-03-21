import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner, Pagination } from '@/components/ui/shared';
import { orderService } from '@/services/order.service';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import type { Order } from '@/types';


export default function ResellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadOrders(page);
  }, [page]);

  const loadOrders = async (pageToLoad: number) => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders({ page: pageToLoad, size: 10 });
      const { content, totalPages: totalP, totalElements: totalE } = response.data;
      
      setOrders(content);
      setTotalPages(totalP);
      setTotalElements(totalE);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const BOM = '\uFEFF';
    const headers = ['รหัสออเดอร์', 'ลูกค้า', 'สินค้า', 'ยอดรวม', 'กำไร', 'สถานะ', 'วันที่'];
    const rows = orders.map(o => [
      o.order_number,
      o.customer_name,
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
    link.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
          <p className="font-bold text-neutral-900 text-sm mb-0.5">{row.original.customer_name}</p>
          <p className="text-sm font-bold text-neutral-500 tracking-tight">{row.original.customer_phone}</p>
        </div>
      ),
    },
    {
      id: 'items',
      header: 'รายการสินค้า',
      cell: ({ row }) => (
        <div className="max-w-xs flex flex-wrap gap-1.5">
          {row.original.items?.map((item, i) => (
            <span key={i} className="text-sm font-bold text-neutral-700 bg-neutral-100/60 px-2 py-0.5 rounded-lg border border-neutral-200/50">
              {item.product_name} <span className="text-neutral-400 font-black">x{item.quantity}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'ยอดรวม',
      cell: ({ row }) => (
        <span className="text-base font-black text-neutral-900 tracking-tight">
          {formatCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      accessorKey: 'reseller_profit',
      header: 'กำไรของคุณ',
      cell: ({ row }) => (
        <span className="inline-flex font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm text-sm">
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
            "inline-flex px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-sm",
            status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100/60" :
            status === 'shipped' ? "bg-primary-50 text-primary-700 border-primary-100/60" :
            "bg-amber-50 text-amber-700 border-amber-100/60"
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
        <span className="text-sm font-bold text-neutral-500">{formatDate(row.original.created_at)}</span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="รายการคำสั่งซื้อ" 
        subtitle="ติดตามและตรวจสอบรายการสั่งซื้อทั้งหมดจากหน้าร้านของคุณ" 
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
          searchPlaceholder="ค้นหาจากรหัสคำสั่งซื้อ..."
        />
        <Pagination
          pageIndex={page}
          pageSize={10}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </div>
  );
}