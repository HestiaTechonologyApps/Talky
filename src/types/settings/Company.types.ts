export interface CustomResponse<T> {
    statusCode: number;
    error: string | null;
    customMessage: string;
    isSucess: boolean;
    value: T;
  }
  export interface Company{
   companyId:number;
   comapanyName:string;
   website:string;
   contactNumber:string;
   email:string;
   taxNumber:string;
   addressLine1:string;

   addressLine2:string;
   city:string;
   state:string;
   country:string;
   zipCode:string;
   invoicePrefix:string;
   companyLogo:string;
   isActive:boolean;
   isDeleted:boolean;
  }
