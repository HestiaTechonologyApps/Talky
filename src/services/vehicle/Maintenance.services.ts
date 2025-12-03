// src/services/VehicleMaintenanceService.ts

import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { Maintenance } from "../../types/vehicle/Maintenance.types";
import HttpService from "../common/HttpService";

class VehicleMaintenanceService {
  static async getAll(): Promise<CustomResponse<Maintenance[]>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE_MAINTENANCE.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Maintenance>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE_MAINTENANCE.GET_BY_ID(id), "GET");
  }

  static async create(data: Maintenance): Promise<CustomResponse<Maintenance>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE_MAINTENANCE.CREATE, "POST", data);
  }

  static async update(id: number, data: Maintenance): Promise<CustomResponse<Maintenance>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE_MAINTENANCE.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE_MAINTENANCE.DELETE(id), "DELETE");
  }
}

export default VehicleMaintenanceService;
