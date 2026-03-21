import api from '@/lib/axios';
import type { Wallet, WalletLog, ApiResponse } from '@/types';

export const walletService = {
  getWallet: () =>
    api.get<ApiResponse<Wallet>>('reseller/wallet'),

  getWalletLogs: async (params?: { page?: number }) => {
    const res = await api.get<any>('reseller/wallet/logs', { params });
    // Spring Data Page structure returned in response directly sometimes, 
    // but looking at ResellerWalletController, it returns ResellerWalletResponse.
    const data = res.data;
    const mappedLogs = (data.logs || []).map((log: any) => ({
      id: log.id,
      amount: log.amount,
      created_at: log.createdAt,
      order: {
        order_number: log.order?.orderNumber
      }
    }));
    
    return { 
      data: { 
        data: { 
          wallet: { balance: data.wallet?.balance || 0 },
          logs: mappedLogs 
        } 
      } 
    };
  },
};
