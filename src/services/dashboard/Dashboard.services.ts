import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { DashboardSummary, ExpenseCategoryData, ExpenseCategoryResponse, MonthlyData, MonthlyFinancialResponse, MonthlyTripCountResponse, TripCountData, VehicleStatusData, VehicleStatusResponse } from "../../types/dashboard/TripDashboard.types";
import HttpService from "../common/HttpService";

// Color constants for consistent chart styling
const CHART_COLORS = {
  PRIMARY: "#007bff",
  SUCCESS: "#28a745", 
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8",
  SECONDARY: "#6c757d",
  LIGHT: "#f8f9fa",
  DARK: "#343a40"
};

class DashboardService {
  
  /**
   * Get complete dashboard summary with all chart data for a year
   */
  static async getDashboardSummary(year: number): Promise<CustomResponse<DashboardSummary>> {
    return HttpService.callApi(API_ENDPOINTS.DASHBOARD.GET_DASHBOARD_SUMMARY(year), "GET");
  }

  /**
   * Get monthly financial data (revenue vs expenses) for a specific year
   */
  static async getMonthlyFinancial(year: number): Promise<CustomResponse<MonthlyData[]>> {
    try {
      const response = await HttpService.callApi<CustomResponse<MonthlyFinancialResponse[]>>(
        API_ENDPOINTS.DASHBOARD.GET_MONTHLY_FINANCIAL(year),
        "GET"
      );
      
      // Transform the API response to match our chart data structure
      if (response?.isSucess && response.value) {
        const transformedData: MonthlyData[] = response.value.map((item: MonthlyFinancialResponse) => ({
          month: item.month,
          expense: item.totalExpense,
          invoice: item.totalInvoice
        }));
        
        return {
          ...response,
          value: transformedData
        } as CustomResponse<MonthlyData[]>;
      }
      
      return response as unknown as CustomResponse<MonthlyData[]>;
    } catch (error) {
      console.error("getMonthlyFinancial error:", error);
      throw error;
    }
  }

  /**
   * Get monthly trip count data for a specific year
   */
  static async getMonthlyTripCount(year: number): Promise<CustomResponse<TripCountData[]>> {
    try {
      const response = await HttpService.callApi<CustomResponse<MonthlyTripCountResponse[]>>(
        API_ENDPOINTS.DASHBOARD.GET_MONTHLY_TRIP_COUNT(year),
        "GET"
      );
      
      // Transform the API response to match our chart data structure
      if (response?.isSucess && response.value) {
        const transformedData: TripCountData[] = response.value.map((item: MonthlyTripCountResponse) => ({
          month: item.month,
          trips: item.tripCount
        }));
        
        return {
          ...response,
          value: transformedData
        } as CustomResponse<TripCountData[]>;
      }
      
      return response as unknown as CustomResponse<TripCountData[]>;
    } catch (error) {
      console.error("getMonthlyTripCount error:", error);
      throw error;
    }
  }

  /**
   * Get current vehicle status distribution
   */
  static async getVehicleStatus(): Promise<CustomResponse<VehicleStatusData[]>> {
    try {
      const response = await HttpService.callApi<CustomResponse<VehicleStatusResponse[]>>(
        API_ENDPOINTS.DASHBOARD.GET_VEHICLE_STATUS(),
        "GET"
      );
      
      // Transform the API response and assign colors
      if (response?.isSucess && response.value) {
        const transformedData: VehicleStatusData[] = response.value.map((item: VehicleStatusResponse) => {
          // Assign colors based on status type
          let color = CHART_COLORS.PRIMARY;
          const statusName = (item.statusName || "").toLowerCase();
          
          if (statusName.includes('trip') || statusName.includes('active')) {
            color = CHART_COLORS.PRIMARY;
          } else if (statusName.includes('available') || statusName.includes('ready')) {
            color = CHART_COLORS.SUCCESS;
          } else if (statusName.includes('maintenance') || statusName.includes('repair')) {
            color = CHART_COLORS.DANGER;
          } else if (statusName.includes('off') || statusName.includes('inactive')) {
            color = CHART_COLORS.WARNING;
          }
          
          return {
            name: item.statusName,
            value: item.count,
            color
          };
        });
        
        return {
          ...response,
          value: transformedData
        } as CustomResponse<VehicleStatusData[]>;
      }
      
      return response as unknown as CustomResponse<VehicleStatusData[]>;
    } catch (error) {
      console.error("getVehicleStatus error:", error);
      throw error;
    }
  }

  /**
   * Get top expense categories for a specific year (optional)
   */
  static async getExpenseCategories(year?: number): Promise<CustomResponse<ExpenseCategoryData[]>> {
    try {
      const response = await HttpService.callApi<CustomResponse<ExpenseCategoryResponse[]>>(
        API_ENDPOINTS.DASHBOARD.GET_EXPENSE_CATEGORIES(year),
        "GET"
      );
      
      // Transform the API response and assign colors
      if (response?.isSucess && response.value) {
        const colors = [CHART_COLORS.DANGER, CHART_COLORS.PRIMARY, CHART_COLORS.WARNING, CHART_COLORS.INFO, CHART_COLORS.SECONDARY];
        
        const transformedData: ExpenseCategoryData[] = response.value.map((item: ExpenseCategoryResponse, index: number) => ({
          category: item.categoryName,
          amount: item.totalAmount,
          fill: colors[index % colors.length]
        }));
        
        return {
          ...response,
          value: transformedData
        } as CustomResponse<ExpenseCategoryData[]>;
      }
      
      return response as unknown as CustomResponse<ExpenseCategoryData[]>;
    } catch (error) {
      console.error("getExpenseCategories error:", error);
      throw error;
    }
  }

  /**
   * Get dashboard data for current year
   */
  static async getCurrentYearData(): Promise<CustomResponse<DashboardSummary>> {
    const currentYear = new Date().getFullYear();
    return this.getDashboardSummary(currentYear);
  }

  /**
   * Refresh all dashboard data individually (fallback if summary endpoint not available)
   */
  static async refreshAllDashboardData(year?: number): Promise<{
    monthlyFinancial: MonthlyData[];
    monthlyTripCount: TripCountData[];
    vehicleStatus: VehicleStatusData[];
    expenseCategories: ExpenseCategoryData[];
  }> {
    const targetYear = year || new Date().getFullYear();
    
    try {
      const [financialRes, tripCountRes, vehicleStatusRes, expenseCategoriesRes] = await Promise.all([
        this.getMonthlyFinancial(targetYear),
        this.getMonthlyTripCount(targetYear),
        this.getVehicleStatus(),
        this.getExpenseCategories(targetYear)
      ]);

      return {
        monthlyFinancial: (financialRes.isSucess && financialRes.value) ? financialRes.value : [],
        monthlyTripCount: (tripCountRes.isSucess && tripCountRes.value) ? tripCountRes.value : [],
        vehicleStatus: (vehicleStatusRes.isSucess && vehicleStatusRes.value) ? vehicleStatusRes.value : [],
        expenseCategories: (expenseCategoriesRes.isSucess && expenseCategoriesRes.value) ? expenseCategoriesRes.value : []
      };
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      throw error;
    }
  }
}

export default DashboardService;