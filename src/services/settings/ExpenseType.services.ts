import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { ExpenseType } from "../../types/settings/Expense.types";
import HttpService from "../common/HttpService";

class ExpenseTypeService {
  static async getAll(): Promise<CustomResponse<ExpenseType[]>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_TYPE.GET_ALL, "GET");
  }

  static async getById(id: number): Promise<CustomResponse<ExpenseType>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_TYPE.GET_BY_ID(id), "GET");
  }

  static async create(data: ExpenseType): Promise<CustomResponse<ExpenseType>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_TYPE.CREATE, "POST", data);
  }

  static async update(
    id: number,
    data: ExpenseType
  ): Promise<CustomResponse<ExpenseType>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_TYPE.UPDATE(id), "PUT", data);
  }

  static async delete(id: number): Promise<CustomResponse<null>> {
    return HttpService.callApi(API_ENDPOINTS.EXPENSE_TYPE.DELETE(id), "DELETE");
  }
}

export default ExpenseTypeService;
