

import type { AuditTrails } from "../types/common/AuditLog.types";


export interface Expenses {
  expenseMasterId?: number;
  expenseTypeId: number | null;
  expenseType?: string;
  expenseTypeName?: string;
  amount: string | number;
  expenseVoucher?: string;
  remark: string;
  paymentMode: string;
  relatedEntityId: number | null;
  relatedEntityType: string;
  createdOn: string;
  createdBy?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  aauditLgs?:AuditTrails;
}