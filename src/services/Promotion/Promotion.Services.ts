import { Promotion } from "../../types/settings/Promotion.types";
import HttpService from "../common/HttpService";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import { CustomResponse } from "../../types/common/ApiTypes";

const PromotionService = {
  async getAllPromotions(): Promise<Promotion[]> {
    const response = await HttpService.callApi<CustomResponse<Promotion[]>>(
      API_ENDPOINTS.PROMOTION.GET_ALL,
      "GET"
    );
    return response.value;
  },

  async addPromotion(formData: Promotion): Promise<Promotion> {
    return await HttpService.callApi<Promotion>(
      API_ENDPOINTS.PROMOTION.CREATE,
      "POST",
      formData
    );
  },

  async getPromotionById(id: string): Promise<Promotion> {
    const response = await HttpService.callApi<CustomResponse<Promotion>>(
      API_ENDPOINTS.PROMOTION.GET_BY_ID(id),
      "GET"
    );
    return response.value;
  },

  async editPromotionById(id: string, data: Promotion) {
    return await HttpService.callApi<Promotion>(
      API_ENDPOINTS.PROMOTION.UPDATE(id),
      "PUT",
      data
    );
  },

  async deletePromotionById(id: string) {
    return await HttpService.callApi<Promotion>(
      API_ENDPOINTS.PROMOTION.DELETE(id),
      "DELETE"
    );
  },
};

export default PromotionService;