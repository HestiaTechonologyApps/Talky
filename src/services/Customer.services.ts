// src/services/CustomerService.ts
import type { Customer } from "../types/Customer.types";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";
import type { CustomResponse } from "../types/common/ApiTypes";
import HttpService from "./common/HttpService";

class CustomerService {
  static async getAll(): Promise<CustomResponse<Customer[]>> {
    return HttpService.callApi(API_ENDPOINTS.CUSTOMER.GET_ALL, "GET");
  } 

  static async getById(id: number): Promise<CustomResponse<Customer>> {
    return HttpService.callApi(API_ENDPOINTS.CUSTOMER.GET_BY_ID(id), "GET");
  }

  static async create(data: Customer): Promise<CustomResponse<Customer>> {
    return HttpService.callApi(API_ENDPOINTS.CUSTOMER.CREATE, "POST", data);
  }

  static async update(id: number, data: Customer): Promise<CustomResponse<Customer>> {
    return HttpService.callApi(API_ENDPOINTS.CUSTOMER.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.CUSTOMER.DELETE(id), "DELETE");
  }
}

export default CustomerService;
