import type { Driver } from "../types/Driver.types";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";
import type { CustomResponse } from "../types/common/ApiTypes";
import HttpService from "./common/HttpService";

class DriverService {
  static async getAll(): Promise<CustomResponse<Driver[]>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.GET_BY_ID(id), "GET");
  }

  static async create(data: Driver): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.CREATE, "POST", data);
  }
  
  static async update(id: number, data: Driver): Promise<CustomResponse<Driver>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.DRIVER.DELETE(id), "DELETE");
  }

  // ✅ CORRECT: Backend expects "AppUserId" and "ProfilePic"
  static async uploadProfilePic(driverId: number, file: File): Promise<CustomResponse<string>> {
    const formData = new FormData();
    formData.append("AppUserId", driverId.toString());  // ✅ Match backend parameter name
    formData.append("ProfilePic", file);                // ✅ Match backend parameter name

    return HttpService.callApi(
      API_ENDPOINTS.DRIVER.UPLOAD_PROFILE_PIC,
      "POST",
      formData,
      false,
      true
    );
  }
}

export default DriverService;