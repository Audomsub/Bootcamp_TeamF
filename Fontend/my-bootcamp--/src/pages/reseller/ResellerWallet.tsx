import { useEffect, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Wallet as WalletIcon, ArrowUpRight } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader, LoadingSpinner } from '@/components/ui/shared';
import { walletService } from '@/services/wallet.service';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { WalletLog } from '@/types';


export default function ResellerWallet() {
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState<WalletLog[]>([]);
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
    } catch (err) {
      console.error("Failed to load wallet data", err);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<WalletLog>[] = [
    {
      id: 'transaction',
      header: 'รายการ',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-neutral-800">กำไรจากคำสั่งซื้อ</p>
            <p className="text-xs font-bold text-neutral-700 mt-0.5">
              รหัสออเดอร์: <span className="text-primary-600">{row.original.order?.order_number}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'วันและเวลา',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-neutral-800">
          {formatDateTime(row.original.created_at)}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'จำนวนเงิน',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <div className="flex justify-end">
          <span className="inline-flex font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            +{formatCurrency(row.original.amount)}
          </span>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="กระเป๋าเงิน" 
        subtitle="ตรวจสอบยอดกำไรคงเหลือและประวัติการทำรายการของคุณ" 
      />

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border border-primary-400/30 rounded-[2rem] shadow-xl shadow-primary-500/20 relative overflow-hidden mb-8">
        {/* Decorative Background Elements */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="p-8 sm:p-10 flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner shrink-0">
            <WalletIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-primary-100 font-medium mb-1.5 text-sm sm:text-base">ยอดกำไรคงเหลือทั้งหมด</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-sm">
              {formatCurrency(balance)}
            </h2>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card bg-white/80 border-white/60 shadow-xl rounded-[2rem] p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black uppercase tracking-tight">ประวัติการทำรายการ</h2>
          <p className="text-sm font-medium text-neutral-700 mt-1">รายการเงินเข้า-ออกจากกระเป๋าเงินของคุณ</p>
        </div>
        <DataTable
          columns={columns}
          data={logs}
        />
      </div>
    </div>
  );
}