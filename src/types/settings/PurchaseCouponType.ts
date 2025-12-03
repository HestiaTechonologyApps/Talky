export interface CustomResponse<T> {
    statusCode: number;
    error: string | null;
    customMessage: string;
    isSucess: boolean;
    value: T;
  }
  export interface Purchascoupon{
   purchaseCouponId?:number;
    coins:number;
    amount:number;
    pastAmount:number;
    isActive:boolean;
    description: string;
    createdAt:string|Date;
    createdAppUserId?:number;
  }