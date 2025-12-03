import React, { useState, useEffect, useCallback } from "react";
import type { ExpenseType } from "../../../types/settings/Expense.types";
import ExpenseTypeService from "../../../services/settings/ExpenseType.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduTable from "../../../components/KiduTable";

const columns = [
    { label: "Expense ID", key: "expenseTypeId" },
    { label: "Expense Type Code", key: "expenseTypeCode" },
    { label: "Expense Type Name", key: "expenseTypeName" },
];

const ExpenseTypeList: React.FC = () => {
    const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ExpenseTypeService.getAll();

            if (response.isSucess && response.value) {
                setExpenseTypes(response.value);
                setError(null);
            } else {
                setError(response.customMessage || "Failed to fetch expense types");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="expense type..." />;

    return (
        <KiduTable
            title="Expense Type Details"
            subtitle="List of all expense types with quick edit & view actions"
            data={expenseTypes}
            columns={columns}
            addButtonLabel="Add New Expense Type"
            addRoute="/dashboard/settings/create-expenses-type"
            editRoute="/dashboard/settings/edit-expenses-type"
            viewRoute="/dashboard/settings/view-expenses-type"
            idKey="expenseTypeId"
            error={error}
            onRetry={loadData}
        />
    );
};

export default ExpenseTypeList;
