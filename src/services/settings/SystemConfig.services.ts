import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { CustomResponse } from "../../types/common/ApiTypes";
import { CompanyLookup } from "../../types/settings/Company.types";
import { systemconfig } from "../../types/settings/SystemConfig";
import HttpService from "../common/HttpService";

class SystemConfigService {
  static async getAppmasterSetting(): Promise<CustomResponse<systemconfig[]>> {
    return await HttpService.callApi<CustomResponse<systemconfig[]>>(
      API_ENDPOINTS.AppMasterSetting.GET_ALL, 
      'GET'
    );
  }

  static async CreateSystemconfig(formData: systemconfig): Promise<CustomResponse<systemconfig>> {
    return await HttpService.callApi<CustomResponse<systemconfig>>(
      API_ENDPOINTS.AppMasterSetting.CREATE, 
      'POST', 
      formData
    ); 
  }

  static async getCompanyIds(): Promise<CompanyLookup[]> {
    const response = await HttpService.callApi<{ value: CompanyLookup[] }>(
      API_ENDPOINTS.AppMasterSetting.GET_CompanyId,
      "GET"
    );
    return response?.value || [];
  }

  static async updateSystemconfig(formData: systemconfig): Promise<CustomResponse<systemconfig>> {
    const id = String(formData.appMasterSettingId); 
  
    return await HttpService.callApi<CustomResponse<systemconfig>>(
      API_ENDPOINTS.AppMasterSetting.UPDATE(id),
      'PUT',
      formData
    );
  }
  static async delete(id: string): Promise<CustomResponse<null>> {
      return await HttpService.callApi<CustomResponse<null>>(
        API_ENDPOINTS.AppMasterSetting.DELETE(id), 
        'DELETE'
      );
    }
  
}

export default SystemConfigService;
