import { AuditTrails } from "../common/AuditLog.types";

export interface FinancialYear{
    financialYearId?:number;
    finacialYearCode:string;
    startDate?: string;
    endDate?: string;
    isCurrent:boolean;
    isClosed:boolean;
    auditLogs?: AuditTrails[];
  }