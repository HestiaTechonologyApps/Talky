export interface ExpenseType {
    expenseTypeId: number;
    expenseTypeName: string;
    expenseTypeCode?: string;
    creditDebitType?:string
    description: string;
    isActive: boolean;
    isDeleted: boolean;
}
