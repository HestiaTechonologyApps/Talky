// src/services/UserService.ts

import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import { User } from "../../types/common/Auth.types";
import HttpService from "../common/HttpService";

class UserService {
  static async getAll(): Promise<CustomResponse<User[]>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<User>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.GET_BY_ID(id), "GET");
  }

  static async create(data: User): Promise<CustomResponse<User>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.CREATE, "POST", data);
  }

  static async update(id: number, data: User): Promise<CustomResponse<User>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.DELETE(id), "DELETE");
  }

  static async changePassword(data: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }): Promise<CustomResponse<string>> {
    return HttpService.callApi(API_ENDPOINTS.ADMIN_USER.CHANGE_PASSWORD, "POST", data);
  }

  static async uploadProfilePic(AppUserId: number, file: File): Promise<CustomResponse<string>> {
  const formData = new FormData();
  formData.append("AppUserId", AppUserId.toString());
  formData.append("ProfilePic", file);

  return HttpService.callApi(
    API_ENDPOINTS.ADMIN_USER.UPLOAD_PROFILE_PIC,
    "POST",
    formData,
    false,
    true
  );
}

}

export default UserService;
