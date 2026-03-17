import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { walletService } from '@/services/wallet.service';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { WalletLog } from '@/types';

// Mock data
const mockWallet = { id: 1, user_id: 1, balance: 12500 };
const mockLogs: WalletLog[] = [
  { id: 1, wallet_id: 1, order_id: 101, amount: 300, created_at: '2025-03-12T14:30:00Z', order: { order_number: 'ORD-ABC123' } as any },
  { id: 2, wallet_id: 1, order_id: 102, amount: 600, created_at: '2025-03-11T09:15:00Z', order: { order_number: 'ORD-DEF456' } as any },
  { id: 3, wallet_id: 1, order_id: 103, amount: 150, created_at: '2025-03-10T16:45:00Z', order: { order_number: 'ORD-GHI789' } as any },
];

export default function ResellerWallet() {
  const [balance, setBalance] = useState(mockWallet.balance);
  const [logs, setLogs] = useState<WalletLog[]>(mockLogs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWalletLogs();
      setBalance(response.data.data.wallet.balance);
      setLogs(response.data.data.logs);
    } catch {
      setBalance(mockWallet.balance);
      setLogs(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<WalletLog>[] = [
    {
      id: 'transaction',
      header: 'Transaction',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Order Profit</p>
            <p className="text-xs text-gray-500">Order #{row.original.order?.order_number}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date & Time',
      cell: ({ row }) => (
        <span className="text-gray-500">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-600">
          +{formatCurrency(row.original.amount)}
        </span>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Wallet" subtitle="View your available profit balance and transaction history" />

      {/* Balance Card */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white mb-8 border-0">
        <div className="p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-primary-100 font-medium mb-1">Total Profit Balance</p>
            <h2 className="text-4xl font-bold tracking-tight">
              {formatCurrency(balance)}
            </h2>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <DataTable
          columns={columns}
          data={logs}
        />
      </div>
    </div>
  );
}
