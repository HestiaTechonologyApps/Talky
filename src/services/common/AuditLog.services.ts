
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { AuditLogResponse, AuditTrails } from "../../types/common/AuditLog.types";
import HttpService from "./HttpService";
 
class AuditLogService {
 
  static async getByTableAndId(
    tableName: string,
    recordId: number | string
  ): Promise<AuditLogResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.AUDIT_LOG.GET_BY_TABLE_AND_ID(tableName, Number(recordId)),
      "GET"
    );
  }
 
 
  static async getLogsFromModel(
    model: Pick<AuditTrails, "tableName" | "recordID">
  ): Promise<AuditLogResponse> {
    return HttpService.callApi(
      API_ENDPOINTS.AUDIT_LOG.GET_BY_TABLE_AND_ID(model.tableName, model.recordID),
      "GET"
    );
  }
 
 
  static async getById(logID: string): Promise<AuditTrails> {
    const data: AuditLogResponse = await HttpService.callApi(
      API_ENDPOINTS.AUDIT_LOG.GET_BY_ID(logID),
      "GET"
    );
 
    if (data.isSucess && data.value.length > 0) {
      return data.value[0];
    }
 
    throw new Error("Audit entry not found.");
  }
}
 
export default AuditLogService;
