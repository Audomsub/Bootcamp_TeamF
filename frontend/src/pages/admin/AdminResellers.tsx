import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX, Users, ShieldCheck, Clock } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner, StatCard } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { resellerService } from '@/services/reseller.service';
import { formatDate, cn } from '@/lib/utils';
import type { User } from '@/types';

interface ResellerUser extends User {
  shop?: { shop_name: string };
}


export default function AdminResellers() {
  const [resellers, setResellers] = useState<ResellerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<{ id: number; type: 'approve' | 'reject' } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadResellers();
  }, []);

  const loadResellers = async () => {
    try {
      setLoading(true);
      const response = await resellerService.getAll();
      const data = response.data?.data?.data;
      setResellers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load resellers', err);
      setResellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!action) return;
    try {
      setProcessing(true);
      if (action.type === 'approve') {
        await resellerService.approve(action.id);
      } else {
        await resellerService.reject(action.id);
      }
      setResellers((prev) =>
        prev.map((r) =>
          r.id === action.id
            ? { ...r, status: action.type === 'approve' ? 'approved' : 'rejected' }
            : r
        )
      );
    } catch {
      // handle error
    } finally {
      setProcessing(false);
      setAction(null);
    }
  };

  // Calculate stats
  const stats = {
    total: resellers.length,
    approved: resellers.filter(r => r.status === 'approved').length,
    pending: resellers.filter(r => r.status === 'pending').length,
  };

  const columns: ColumnDef<ResellerUser>[] = [
    {
      accessorKey: 'name',
      header: 'ชื่อตัวแทน',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-sm font-bold text-primary-600">
              {row.original.name ? row.original.name.charAt(0) : '?'}
            </span>
          </div>
          <span className="font-semibold text-neutral-900">{row.original.name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'อีเมล',
      cell: ({ row }) => <span className="text-neutral-500 font-medium">{row.original.email}</span>,
    },
    {
      id: 'shop_name',
      header: 'ชื่อร้านค้า',
      cell: ({ row }) => (
        <span className="text-neutral-800 font-semibold">{row.original.shop?.shop_name || '-'}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'เบอร์โทรศัพท์',
      cell: ({ row }) => <span className="text-neutral-500 font-medium tabular-nums">{row.original.phone}</span>,
    },
    {
      accessorKey: 'created_at',
      header: 'วันที่สมัคร',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-neutral-500 font-medium tabular-nums">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'สถานะ',
      meta: { align: 'center' },
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={cn(
            "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
            status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
            "bg-rose-50 text-rose-700 border-rose-100"
          )}>
            {status === 'approved' ? 'อนุมัติแล้ว' : status === 'pending' ? 'รอดำเนินการ' : 'ปฏิเสธ'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'จัดการ',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => {
        const { status, id } = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5 h-9">
            {status !== 'approved' && (
              <button
                onClick={() => setAction({ id, type: 'approve' })}
                className="p-2.5 rounded-full bg-white text-emerald-600 border border-neutral-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all active:scale-90 group"
                title="อนุมัติ"
              >
                <UserCheck className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
              </button>
            )}
            {status !== 'rejected' && (
              <button
                onClick={() => setAction({ id, type: 'reject' })}
                className="p-2.5 rounded-full bg-white text-rose-600 border border-neutral-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all active:scale-90 group"
                title="ปฏิเสธ"
              >
                <UserX className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="relative min-h-screen">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader 
          title="ตัวแทนจำหน่าย" 
          subtitle="จัดการบัญชีและการอนุมัติการสมัครตัวแทนจำหน่าย" 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="ตัวแทนจำหน่ายทั้งหมด"
            value={stats.total}
            icon={Users}
            trend={{ value: 12, label: 'เดือนนี้' }}
            className="glass-card border-white/5 bg-white/60"
          />
          <StatCard
            title="อนุมัติแล้ว"
            value={stats.approved}
            icon={ShieldCheck}
            color="emerald"
            className="glass-card border-white/5 bg-white/60"
          />
          <StatCard
            title="รอดำเนินการ"
            value={stats.pending}
            icon={Clock}
            color="amber"
            className="glass-card border-white/5 bg-white/60"
          />
        </div>

        {/* Data Table Container */}
        <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6">
          <DataTable
            columns={columns}
            data={resellers}
            searchColumn="name"
            searchPlaceholder="ค้นหาชื่อตัวแทนจำหน่าย..."
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={action !== null}
        onClose={() => setAction(null)}
        onConfirm={handleAction}
        title={action?.type === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'}
        message={
          action?.type === 'approve'
            ? 'คุณแน่ใจหรือไม่ว่าต้องการอนุมัติตัวแทนจำหน่ายรายนี้? ระบบจะเปิดสิทธิ์ให้เข้าใช้งานแพลตฟอร์มได้ทันที'
            : 'คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธตัวแทนจำหน่ายรายนี้? ผู้ใช้จะไม่สามารถเข้าใช้งานระบบในฐานะตัวแทนได้'
        }
        confirmText={action?.type === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}
        variant={action?.type === 'reject' ? 'danger' : 'primary'}
        isLoading={processing}
      />
    </div>
  );
}