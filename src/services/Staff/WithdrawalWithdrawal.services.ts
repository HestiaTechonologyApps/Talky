// src/services/Staff/WalletWithdrawal.services.ts

import HttpService from '../common/HttpService';
import { CustomResponse } from '../../types/common/ApiTypes';
import { API_ENDPOINTS } from '../../constants/API_ENDPOINTS';
import { WalletWithdrawal } from '../../types/Staff/WalletWithdrawal.type';

class WalletWithdrawalService {
  static async getAllWithdrawals(): Promise<CustomResponse<WalletWithdrawal[]>> {
    return HttpService.callApi<CustomResponse<WalletWithdrawal[]>>(
      API_ENDPOINTS.WALLET_WITHDRAWAL.GET_ALL,
      'GET'
    );
  }

  static async getWithdrawalById(id: string): Promise<CustomResponse<WalletWithdrawal>> {
    return HttpService.callApi<CustomResponse<WalletWithdrawal>>(
      API_ENDPOINTS.WALLET_WITHDRAWAL.GET_BY_ID(id),
      'GET'
    );
  }

  static async updateWithdrawalStatus(id: string, data: WalletWithdrawal): Promise<CustomResponse<WalletWithdrawal>> {
    return HttpService.callApi<CustomResponse<WalletWithdrawal>>(
      API_ENDPOINTS.WALLET_WITHDRAWAL.UPDATE(id),
      'PUT',
      data
    );
  }

  static async deleteWithdrawal(id: string): Promise<CustomResponse<null>> {
    return HttpService.callApi<CustomResponse<null>>(
      API_ENDPOINTS.WALLET_WITHDRAWAL.DELETE(id),
      'DELETE'
    );
  }
}

export default WalletWithdrawalService;