////user/////

// src/constants/apiEndpoints.ts

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://sreenathganga-001-site12.jtempurl.com/api';
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL || 'http://sreenathganga-001-site12.jtempurl.com/api';
export const API_ENDPOINTS = {
  STAFF: {
    GET_ALL: `${API_BASE_URL}/StaffUser/admin-getall-staff`,
    GET_BY_ID: (id: string ) => `${API_BASE_URL}/StaffUser/admin-get-staffsinfo?staffid=${id}`,
    EDIT:(id:string)=> `${API_BASE_URL}/StaffUser/admin-update-staff?staffid=${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/StaffUser/Delete/${id}`,

  },
  PURCHASE_COUPON: {
    GET_ALL: `${API_BASE_URL}/PurchaseCoupon/GetAll`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/PurchaseCoupon/GetById/${id}`,
    CREATE: `${API_BASE_URL}/PurchaseCoupon/Create`,
    UPDATE: (id: string) => `${API_BASE_URL}/PurchaseCoupon/Update/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/PurchaseCoupon/Delete/${id}`,
  },
  APP_USER: {
    GET_ALL:  `${API_BASE_URL}/AppUser/admin-get-allusers`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/AppUser/admin-get-UserInfo?appUserId=${id}`,
    EDIT:  `${API_BASE_URL}/AppUser/admin-update-appuser`,
   // ENTROLLSTAFF: (id: string) => `${API_BASE_URL}/AppUser/enroll-staff/${id}`,
   ENROLLSTAFF: `${API_BASE_URL}/AppUser/enroll-staff`,
    EDITGENDER:(id: string) => `${API_BASE_URL}/AppUser/enroll-staff/${id}`,
    PROFILEPIC_POST:`${API_BASE_URL}/AppUser/upload-profile-pic`,
  },
  WALLET_TRANSACTION: {
    GET_ALL:(id:string) =>`${API_BASE_URL}/Wallet/wallet-transactions/${id}`,  
  },
  COMPANY: {
    GET_ALL: `${API_BASE_URL}/Company/GetAll/admin-getall-company`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/Company/GetById/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/Company/Update/${id}`,
    CREATE: `${API_BASE_URL}/Company/Create`,
    DELETE: (id: string) => `${API_BASE_URL}/Company/Delete/${id}`,
  },
  Category:{
    GET_ALL: `${API_BASE_URL}/Category/GetAll/admin-getall-category`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/Category/GetById/${id}`,
    CREATE: `${API_BASE_URL}/Category/Create`, 
    UPDATE: (id: string) => `${API_BASE_URL}/Category/Update/${id}`,
   GET_CompanyId:`${API_BASE_URL}/Company/GetCompanyLookUp/admin-lookUp-company`,
    DELETE: (id: string) => `${API_BASE_URL}/Category/Delete/${id}`,
  },
  FinacialYear:{
    GET_ALL: `${API_BASE_URL}/FinancialYear/GetAll`,
    CREATE: `${API_BASE_URL}/FinancialYear/Create`, 
    GET_BY_ID: (id: string) => `${API_BASE_URL}/FinancialYear/GetById/${id}`, 
      UPDATE: (id: string) => `${API_BASE_URL}/FinancialYear/Update/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/FinancialYear/Delete/${id}`,
  },
  AppNotification:{
    GET_ALL: `${API_BASE_URL}/AppNotification/GetAll/admin-getall-category`,
    CREATE: `${API_BASE_URL}/AppNotification/Create`, 
    GET_BY_ID: (id: string) => `${API_BASE_URL}/AppNotification/GetById/${id}`, 
    UPDATE: (id: string) => `${API_BASE_URL}/AppNotification/Update/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/AppNotification/Delete/${id}`,
  },
  PURCHASE_ORDER: {
    GET_ALL: `${API_BASE_URL}/PurchaseOrder/GetAll`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/PurchaseOrder/GetById/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/PurchaseOrder/Delete/${id}`, 
  },

};