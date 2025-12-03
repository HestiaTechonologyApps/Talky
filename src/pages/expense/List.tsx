import KiduTable from "../../components/KiduTable";
import KiduLoader from "../../components/KiduLoader";
import { useCallback, useEffect, useState } from "react";
import type { Expenses } from "../../types/Expense.types";
import ExpenseMasterService from "../../services/Expense.services";

const columns = [
    { key: "expenseMasterId", label: "Expense Id" },
    { key: "expenseTypeName", label: "Expense Type" },
    { key: "createdOnString", label: "Expense Date" },
    { key: "amount", label: "Amount" },
    { key: "paymentMode", label: "Payment Mode" },
    // { key: "remark", label: "Remarks" },
];

const ExpenseList: React.FC = () => {
    const [expenses, setExpenses] = useState<Expenses[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ExpenseMasterService.getAll();
            if (response.isSucess && response.value) {
                setExpenses(response.value);
                setError(null);
            } else {
                setError("Failed to fetch expenses");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="expenses..." />;

    return (
        <>
            <KiduTable
                title="Expenses"
                subtitle="List of all expenses with quick edit & view actions"
                columns={columns}
                data={expenses}
                addButtonLabel="Add New Expense"
                addRoute="/dashboard/create-expense"
                editRoute="/dashboard/edit-expense"
                viewRoute="/dashboard/view-expense"
                idKey="expenseMasterId"
                error={error}
                onRetry={loadData}
            />
        </>
    );
};

export default ExpenseList;
