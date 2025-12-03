// src/services/VehicleService.ts

import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { Vehicle } from "../../types/vehicle/Vehicles.types";
import HttpService from "../common/HttpService";

class VehicleService {
  static async getAll(): Promise<CustomResponse<Vehicle[]>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Vehicle>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE.GET_BY_ID(id), "GET");
  }

  static async create(data: Vehicle): Promise<CustomResponse<Vehicle>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE.CREATE, "POST", data);
  }

  static async update(id: number, data: Vehicle): Promise<CustomResponse<Vehicle>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.VEHICLE.DELETE(id), "DELETE");
  }
}

export default VehicleService;
