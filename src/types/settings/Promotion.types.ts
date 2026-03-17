import type { AuditTrails } from "../common/AuditLog.types";

export interface Promotion{
    promotionId:number;
    tittle:string;
    description:string;
    couponCode:string;
    fromTime:string|Date;
    toTime: string|Date;
    
    auditLogs?: AuditTrails[];
  }