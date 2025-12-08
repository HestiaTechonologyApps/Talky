import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import type { Company } from "../../types/settings/Company.types";
import HttpService from "../common/HttpService";

const CompanyService = {
  async getAllCompany(): Promise<CustomResponse<Company[]>> {
    return await HttpService.callApi<CustomResponse<Company[]>>(
      API_ENDPOINTS.COMPANY.GET_ALL, 
      'GET'
    );
  },  
  
  async getCompanyById(id: string): Promise<CustomResponse<Company>> {
    return await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.GET_BY_ID(id), 
      'GET'
    );
  },
  
  async updateCompany(id: string, data: Company): Promise<CustomResponse<Company>> {
    return await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.UPDATE(id), 
      'PUT', 
      data
    );
  },

  async addCompany(formData: Company): Promise<CustomResponse<Company>> {
    return await HttpService.callApi<CustomResponse<Company>>(
      API_ENDPOINTS.COMPANY.CREATE, 
      'POST', 
      formData
    );
  },
      
  async deleteCompanyById(id: string): Promise<CustomResponse<null>> {
    return await HttpService.callApi<CustomResponse<null>>(
      API_ENDPOINTS.COMPANY.DELETE(id), 
      'DELETE'
    );
  },
}

export default CompanyService;