import api from '@/lib/axios';
import type { Wallet, WalletLog, ApiResponse } from '@/types';

export const walletService = {
  getWallet: () =>
    api.get<ApiResponse<Wallet>>('/reseller/wallet'),

  getWalletLogs: (params?: { page?: number }) =>
    api.get<ApiResponse<{ wallet: Wallet; logs: WalletLog[] }>>('/reseller/wallet/logs', {
      params,
    }),
};
