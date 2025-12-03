import HttpService from "../services/common/HttpService";
import { API_ENDPOINTS } from "../constants/API_ENDPOINTS";
import type { CustomResponse } from "../types/common/ApiTypes";
import type { Expenses } from "../types/Payment.types";

class PayementMasterService {
  static async getAll(): Promise<CustomResponse<Expenses[]>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_MASTER.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<Expenses>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_MASTER.GET_BY_ID(id), "GET");
  }

  static async create(data: Expenses): Promise<CustomResponse<Expenses>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_MASTER.CREATE, "POST", data);
  }

  static async update(id: number, data: Expenses): Promise<CustomResponse<Expenses>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_MASTER.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_MASTER.DELETE(id), "DELETE");
  }

  // 🔹 ADDED: Get expenses by table name and record ID
  static async getByTableAndRecord(tableName: string, recordId: number): Promise<CustomResponse<Expenses[]>> {
    return HttpService.callApi(
      API_ENDPOINTS.EXPENSE_MASTER.GET_BY_TABLE_AND_RECORD(tableName, recordId), 
      "GET"
    );
  }
}

export default PayementMasterService;
