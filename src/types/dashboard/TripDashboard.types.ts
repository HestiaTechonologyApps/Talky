// src/types/TripDashboard.types.ts

// Represents a single dashboard card (each object inside "value" array)
export interface TripDashboardCard {
  title: string;
  value: number;
  change: number;
  color: string;
  route: string;
  date: string | null;
}

// Represents the full API response from /api/TripDashboard/GetTripDashboard
export interface TripDashboardResponse {
  statusCode: number;
  isSuccess: boolean;
  customMessage: string;
  value: TripDashboardCard[];
}
export interface MonthlyData {
  month: string;
  expense: number;
  invoice: number;
}

export interface TripCountData {
  month: string;
  trips: number;
}

export interface VehicleStatusData {
  name: string;
  value: number;
  color: string;
}

export interface ExpenseCategoryData {
  category: string;
  amount: number;
  fill: string;
}

// Dashboard summary response containing all chart data
export interface DashboardSummary {
  monthlyFinancial: MonthlyData[];
  monthlyTripCount: TripCountData[];
  vehicleStatus: VehicleStatusData[];
  expenseCategories: ExpenseCategoryData[];
}

// Individual API response types
export interface MonthlyFinancialResponse {
  month: string;
  totalExpense: number;
  totalInvoice: number;
}

export interface MonthlyTripCountResponse {
  month: string;
  tripCount: number;
}

export interface VehicleStatusResponse {
  statusName: string;
  count: number;
}

export interface ExpenseCategoryResponse {
  categoryName: string;
  totalAmount: number;
}
