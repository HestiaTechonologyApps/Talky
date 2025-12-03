// types/TripTable.types.ts
export interface TripTable {
  tripOrderId: number;
  tripCode: string;
  fromDate: string;
  customerName: string;
  recivedVia: string;
  driverName: string;
  pickUpFrom: string;
  status: string;
  addedBy: string | null;
  isActive: boolean;
}