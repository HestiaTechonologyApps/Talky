import HttpService from "./common/HttpService";
import type { CustomResponse } from "../types/common/ApiTypes";
import type { Trip, TripBookingMode, TripStatus } from "../types/Trip.types";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";
import type { TripTable } from "../types/TripTable.types";
import type { TripDashboardCard } from "../types/dashboard/TripDashboard.types";
import type { MonthlyData } from "../types/dashboard/TripDashboard.types";
import type { ServersideTrip } from "../types/ServerSideTrip.types";

class TripService {
  static async getAll(): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_ALL, "GET");
  }

  static async getAllTripList(): Promise<CustomResponse<TripTable[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_ALL_TRIPLIST, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Trip>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_BY_ID(id), "GET");
  }

  static async create(data: Omit<Trip, "tripOrderId">): Promise<CustomResponse<Trip>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.CREATE, "POST", data);
  }

  static async update(id: number, data: Trip): Promise<CustomResponse<Trip>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.UPDATE(id), "PUT", data);
  }

  static async updatestatus(data: TripStatus): Promise<CustomResponse<TripStatus>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.UPDATESTATUS, "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.DELETE(id), "DELETE");
  }

  static async getCancelledTrips(): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_CANCELLED_TRIPS, "GET");
  }

  static async getScheduledTrips(): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_SCHEDULED_TRIPS, "GET");
  }

  static async getCompletedTrips(): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_COMPLETED_TRIPS, "GET");
  }

  static async getTripsByStatus(status: string): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_ALL_BY_STATUS(status), "GET");
  }

  static async getTripDashboard(year: number): Promise<CustomResponse<TripDashboardCard[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP_DASHBOARD.GET_DASHBOARD(year), "GET");
  }

  static async getTodaysTrip(): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP_DASHBOARD.GET_TODAYS_TRIP, "GET");
  }

  static async getTripsByYear(year: number): Promise<CustomResponse<Trip[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_ALL_BY_YEAR(year), "GET");
  }

  static async getMonthlySummary(year: number): Promise<CustomResponse<MonthlyData[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP_DASHBOARD.GET_MONTHLY_SUMMARY(year), "GET");
  }

  static async getBookingMode(): Promise<CustomResponse<TripBookingMode[]>> {
    return HttpService.callApi(API_ENDPOINTS.TRIP.GET_BookingMode_TRIPS, "GET");
  }

  static async getPaginatedTrips(data: ServersideTrip): Promise<CustomResponse<any>> {
    return HttpService.callApi(API_ENDPOINTS.SERVER_SIDE_TRIP.GET_PAGINATED, "POST", data);
  }
}

export default TripService;
