// src/services/settings/financial.services.ts

import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { FinancialYear } from "../../types/settings/Financial.type";
import HttpService from "../common/HttpService";

class FinancialYearService {
  static async getAllFinacialYear(): Promise<CustomResponse<FinancialYear[]>> {
    return HttpService.callApi<CustomResponse<FinancialYear[]>>(
      API_ENDPOINTS.FinacialYear.GET_ALL, 
      "GET"
    );
  }

  static async getFinancialYearById(id: string): Promise<CustomResponse<FinancialYear>> {
    return HttpService.callApi<CustomResponse<FinancialYear>>(
      API_ENDPOINTS.FinacialYear.GET_BY_ID(id), 
      "GET"
    );
  }

  static async addFinancialYear(data: FinancialYear): Promise<CustomResponse<FinancialYear>> {
    return HttpService.callApi<CustomResponse<FinancialYear>>(
      API_ENDPOINTS.FinacialYear.CREATE, 
      "POST", 
      data
    );
  }

  static async editFinanceById(id: string, data: FinancialYear): Promise<CustomResponse<FinancialYear>> {
    return HttpService.callApi<CustomResponse<FinancialYear>>(
      API_ENDPOINTS.FinacialYear.UPDATE(id), 
      "PUT", 
      data
    );
  }

  static async deleteFinanceById(id: string): Promise<CustomResponse<null>> {
    return HttpService.callApi<CustomResponse<null>>(
      API_ENDPOINTS.FinacialYear.DELETE(id), 
      "DELETE"
    );
  }
}

export default FinancialYearService;