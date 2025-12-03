// src/types/Maintenance.types.ts

export interface Maintenance {
    vehicleMaintenanceRecordId: number;
    vehicleId: number;
    vehicleName: string;
    maintenanceDate: string;
    maintenanceDateString: string;
    maintenanceType: string;
    workshopName: string;
    description: string;
    cost: number;
    odometerReading: number;
    performedBy: string;
    remarks: string;
    createdDate: string;
    createdDateString: string
    createdBy: string;
}
