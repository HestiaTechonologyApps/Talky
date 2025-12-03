// src/types/InvoiceMaster.types.ts
import type { AuditTrails } from "./common/AuditLog.types";

export interface Invoice {
    invoicemasterId: number;
    invoiceNum: string;
    financialYearId: number;
    companyId: number;
    totalAmount: number;
    createdOn: string;
    createdOnString?: string;
    createdBy?: string;
    isDeleted: boolean;
    auditLogs?: AuditTrails[];
}
