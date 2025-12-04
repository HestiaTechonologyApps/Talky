import React, { useEffect, useState, useCallback } from "react";
import type { Company } from "../../../types/settings/Company.types";
import CompanyService from "../../../services/settings/Company.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduServerTable from "../../../components/Trip/KiduServerTable";

const columns = [
  { key: "companyId", label: "Company ID", type: "text" as const },
  { key: "comapanyName", label: "Company Name", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "contactNumber", label: "Contact", type: "text" as const },
  { key: "city", label: "City", type: "text" as const },
];

const CompanyPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      await CompanyService.getAllCompany();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  if (loading) return <KiduLoader type="Loading Companies..." />;

  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    try {
      const response = await CompanyService.getAllCompany();
      let filteredData = response || [];

      if (params.searchTerm) {
        const s = params.searchTerm.toLowerCase();
        filteredData = filteredData.filter(company =>
          (company.comapanyName || "").toLowerCase().includes(s) ||
          (company.email || "").toLowerCase().includes(s) ||
          (company.city || "").toLowerCase().includes(s) ||
          (company.companyId?.toString() || "").includes(s)
        );
      }

      const start = (params.pageNumber - 1) * params.pageSize;
      const data = filteredData.slice(start, start + params.pageSize);

      return { data, total: filteredData.length };
    } catch {
      return { data: [], total: 0 };
    }
  };

  return (
    <KiduServerTable
      title="Company Details"
      subtitle="List of all companies with Edit & View options"
      columns={columns}
      idKey="companyId"
      addButtonLabel="Add New Company"
      addRoute="/dashboard/settings/create-company"
      editRoute="/dashboard/settings/edit-company"
      viewRoute="/dashboard/settings/view-company"
      fetchData={fetchData}
      showSearch={true}
      showActions={true}
      showExport={true}
      showAddButton={true}
      rowsPerPage={10}
    />
  );
};

export default CompanyPage;
