import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX, Users } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { ConfirmDialog } from '@/components/ui/modal';
import { resellerService } from '@/services/reseller.service';
import { formatDate, getStatusColor } from '@/lib/utils';
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
      setResellers(response.data.data.data as ResellerUser[]);
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

  const columns: ColumnDef<ResellerUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700">
              {row.original.name.charAt(0)}
            </span>
          </div>
          <span className="font-medium text-gray-900">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'shop_name',
      header: 'Shop Name',
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.shop?.shop_name || '-'}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'created_at',
      header: 'Register Date',
      cell: ({ row }) => (
        <span className="text-gray-500">{formatDate(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`badge ${getStatusColor(row.original.status)}`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.status !== 'pending') return null;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAction({ id: row.original.id, type: 'approve' })}
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Approve"
            >
              <UserCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAction({ id: row.original.id, type: 'reject' })}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Reject"
            >
              <UserX className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Resellers" subtitle="Manage reseller accounts and approvals" />

      <DataTable
        columns={columns}
        data={resellers}
        searchColumn="name"
        searchPlaceholder="Search resellers..."
      />

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
