import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX, Users, ShieldCheck, Clock } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner, StatCard } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { resellerService } from '@/services/reseller.service';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import type { User } from '@/types';

interface ResellerUser extends User {
  shop?: { shop_name: string };
}

// Mock data
const mockResellers: ResellerUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '0812345678', role: 'reseller', status: 'approved', address: 'Bangkok', created_at: '2025-03-01', shop: { shop_name: 'JD Store' } },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0898765432', role: 'reseller', status: 'pending', address: 'Chiang Mai', created_at: '2025-03-05', shop: { shop_name: 'JS Shop' } },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '0867891234', role: 'reseller', status: 'rejected', address: 'Phuket', created_at: '2025-03-08', shop: { shop_name: 'BW Mart' } },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '0845678901', role: 'reseller', status: 'pending', address: 'Pattaya', created_at: '2025-03-10', shop: { shop_name: 'AB Collection' } },
];

export default function AdminResellers() {
  const [resellers, setResellers] = useState<ResellerUser[]>(mockResellers);
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
      if (response.data.data.data) {
        setResellers(response.data.data.data as ResellerUser[]);
      }
    } catch {
      setResellers(mockResellers);
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
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
            <span className="text-sm font-black text-primary-600">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <span className="font-bold text-neutral-900 tracking-tight">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-neutral-500 font-medium">{row.original.email}</span>,
    },
    {
      id: 'shop_name',
      header: 'Shop Name',
      cell: ({ row }) => (
        <span className="text-neutral-800 font-bold tracking-tight">{row.original.shop?.shop_name || '-'}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <span className="text-neutral-500 font-medium tabular-nums">{row.original.phone}</span>,
    },
    {
      accessorKey: 'created_at',
      header: 'Register Date',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="text-neutral-500 font-medium tabular-nums">{formatDate(row.original.created_at)}</span>
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
            status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
            "bg-rose-50 text-rose-700 border-rose-100"
          )}>
            {status === 'approved' ? 'Approved' : status === 'pending' ? 'Pending' : 'Rejected'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      meta: { align: 'right' },
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.status !== 'pending') return <div className="h-9" />;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAction({ id: row.original.id, type: 'approve' })}
              className="p-2.5 rounded-full bg-white text-emerald-600 border border-neutral-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all active:scale-90 group"
              title="Approve"
            >
              <UserCheck className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => setAction({ id: row.original.id, type: 'reject' })}
              className="p-2.5 rounded-full bg-white text-rose-600 border border-neutral-100 shadow-sm hover:shadow-md hover:border-rose-100 transition-all active:scale-90 group"
              title="Reject"
            >
              <UserX className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
            </button>
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
          title="Resellers" 
          subtitle="Manage reseller accounts and approvals" 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Resellers"
            value={stats.total}
            icon={Users}
            trend={{ value: 12, label: 'this month' }}
            className="glass-card border-white/5"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={ShieldCheck}
            color="emerald"
            className="glass-card border-white/5"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="amber"
            className="glass-card border-white/5"
          />
        </div>

        {/* Data Table Container */}
        <div className="glass-card border-white/5 overflow-hidden p-1 shadow-2xl">
          <DataTable
            columns={columns}
            data={resellers}
            searchColumn="name"
            searchPlaceholder="Search resellers by name..."
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={action !== null}
        onClose={() => setAction(null)}
        onConfirm={handleAction}
        title={action?.type === 'approve' ? 'Approve Reseller' : 'Reject Reseller'}
        message={
          action?.type === 'approve'
            ? 'Are you sure you want to approve this reseller? They will gain access to the platform.'
            : 'Are you sure you want to reject this reseller? They will not be able to access the platform.'
        }
        confirmText={action?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={action?.type === 'reject' ? 'danger' : 'primary'}
        isLoading={processing}
      />
    </div>
  );
}
