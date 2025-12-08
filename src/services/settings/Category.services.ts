import { Category } from "../../types/settings/Category.type";
import HttpService from "../common/HttpService";
import { CustomResponse } from "../../types/common/ApiTypes";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import { CompanyLookup } from "../../types/settings/Company.types";

class CategoryService {
  static async getAllCategory(): Promise<CustomResponse<Category[]>> {
    return HttpService.callApi<CustomResponse<Category[]>>(
      API_ENDPOINTS.Category.GET_ALL,
      "GET"
    );
  }

  static async getCategoryById(id: string): Promise<CustomResponse<Category>> {
    return HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.Category.GET_BY_ID(id),
      "GET"
    );
  }

  static async addCategory(data: Category): Promise<CustomResponse<Category>> {
    return HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.Category.CREATE,
      "POST",
      data
    );
  }

  static async getCompanyIdsFromCategories(): Promise<CompanyLookup[]> {
    const response = await HttpService.callApi<{ value: CompanyLookup[] }>(
      API_ENDPOINTS.Category.GET_CompanyId,
      "GET"
    );
    return response?.value || [];
  }

  static async updateCategory(id: string, data: Category): Promise<CustomResponse<Category>> {
    return HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.Category.UPDATE(id),
      "PUT",
      data
    );
  }

  static async deleteCategoryById(id: string): Promise<CustomResponse<null>> {
    return HttpService.callApi<CustomResponse<null>>(
      API_ENDPOINTS.Category.DELETE(id),
      "DELETE"
    );
  }
}

export default CategoryService;