// src/types/Staff/WalletWithdrawal.types.ts

import { AuditTrails } from "../common/AuditLog.types";

export interface WalletWithdrawal {
  walletWithdrawalRequestId: number;
  appUserId: number;
  appUserName: string;
  coins: number;
  amount: number;
  createdAt: string | Date;
  status: number;
  isDeleted: boolean;
  companyId: number;
  audiitLgs?: AuditTrails[];
}