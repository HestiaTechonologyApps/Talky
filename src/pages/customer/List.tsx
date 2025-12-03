import React, { useEffect, useState, useCallback } from "react";
import type { Customer } from "../../types/Customer.types";
import CustomerService from "../../services/Customer.services";
import KiduLoader from "../../components/KiduLoader";
import KiduTable from "../../components/KiduTable";

const columns = [
    { key: "customerId", label: "Customer ID" },
    { key: "customerName", label: "Customer Name" },
    { key: "customerEmail", label: "Email ID" },
    { key: "customerPhone", label: "Phone Number" }
];

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await CustomerService.getAll();
            if (res.isSucess && res.value) {
                setCustomers(res.value);
                setError(null);
            } else {
                setError("Failed to fetch customers");
            }
        } catch (err) {
            setError("An error occurred while fetching customers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="customer..." />;

    return (
        <KiduTable
            title="Customer Details"
            subtitle="List of all customers with quick edit & view actions"
            columns={columns}
            data={customers}
            addButtonLabel="Add New Customer"
            idKey="customerId"
            addRoute="/dashboard/customer-create"
            editRoute="/dashboard/customer-edit"
            viewRoute="/dashboard/customer-view"
            error={error}
            onRetry={loadData}
        />
    );
};

export default CustomerList;
