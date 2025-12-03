// src/types/Driver.types.ts
import type { AuditTrails } from "./common/AuditLog.types";

export interface Driver {
    driverId: number;
    driverName: string;
    license: string;
    nationality: string;
    profileImagePath: string; 
    contactNumber: string;
    dob: string | null;
    dobString: string;
    nationalId: string;
    isRented: boolean;
    isActive: boolean;
    auditLogs?: AuditTrails[];
}