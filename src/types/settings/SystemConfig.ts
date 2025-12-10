import { AuditTrails } from "../common/AuditLog.types";
export interface systemconfig{
  appMasterSettingId:number;
  currentCompanyId:string;
  intCurrentFinancialYear:string;
  isActive:boolean;
  staff_To_User_Rate_Per_Second:number;
  one_paisa_to_coin_rate:number;
  
}