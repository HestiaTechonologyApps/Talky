import React, { useEffect, useState, useCallback } from "react";
import type { Company } from "../../../types/settings/Company.types";
import CompanyService from "../../../services/settings/Company.services";
import KiduTable from "../../../components/KiduTable";
import KiduLoader from "../../../components/KiduLoader";

const columns = [
  { label: "Company ID", key: "companyId" },
  { label: "Company Name", key: "comapanyName" },
  { label: "Email", key: "email" },
  { label: "Contact", key: "contactNumber" },
  { label: "City", key: "city" },
];

const CompanyPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CompanyService.getAllCompany();

      if (response && Array.isArray(response)) {
        setCompanies(response);
        setError(null);
      } else {
        setError("Failed to load company data");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  if (loading) return <KiduLoader type="Loading Companies..." />;

  return (
    <KiduTable
      title="Company Details"
      subtitle="List of all companies with Edit & View options"
      data={companies}
      addButtonLabel="Add New Company"
      columns={columns}
      idKey="companyId"
      addRoute="/dashboard/settings/create-company"
      editRoute="/dashboard/settings/edit-company"  // ✅ Remove /:id - KiduTable will append it
      viewRoute="/dashboard/settings/view-company"  // ✅ Remove /:id - KiduTable will append it
      error={error}
      onRetry={loadCompanies}
    />
  );
};

export default CompanyPage;