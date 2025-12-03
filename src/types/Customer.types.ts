import type { AuditTrails } from "./common/AuditLog.types";

export interface Customer {
    isDeleted: any;
    customerId: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    dob: string | null;
    dobString: string;
    gender: string;
    nationalilty?: string; // matches API spelling
    nationality?: string; // correct spelling
    createdAt?: string;
    isActive: boolean;
    auditTrails?: AuditTrails[];
}
