import React, { useEffect, useState, useCallback } from "react";
import type { Promotion } from "../../../types/settings/Promotion.types";

import KiduLoader from "../../../components/KiduLoader";
import KiduServerTable from "../../../components/Trip/KiduServerTable";
import PromotionService from "../../../services/Promotion/Promotion.Services";

const formatDate = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const columns = [
  { key: "promotionId", label: "Promotion ID", type: "text" as const },
  { key: "tittle", label: "Title", type: "text" as const }, 
  { key: "couponCode", label: "Coupon Code", type: "text" as const },
  { key: "description", label: "Description", type: "text" as const },
  { key: "fromTime", label: "From Date", type: "text" as const },
  { key: "toTime", label: "To Date", type: "text" as const },
];

const PromotionPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const loadPromotions = useCallback(async () => {
    try {
      setLoading(true);
      await PromotionService.getAllPromotions();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  if (loading) return <KiduLoader type="Loading Promotions..." />;

  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
    reverseOrder?: boolean;
  }) => {
    try {
      const response = await PromotionService.getAllPromotions();
      let filteredData = response || [];

      //  Search filtering
      if (params.searchTerm) {
        const s = params.searchTerm.toLowerCase();
        filteredData = filteredData.filter(promo =>
          (promo.promotionId?.toString() || "").includes(s) ||
          (promo.tittle || "").toLowerCase().includes(s) ||
          (promo.couponCode || "").toLowerCase().includes(s) ||
          (promo.description || "").toLowerCase().includes(s)
        );
      }

      // Format dates
      let formattedData = filteredData.map(promo => ({
        ...promo,
        fromTime: formatDate(promo.fromTime),
        toTime: formatDate(promo.toTime),
      }));

      //  Reverse order (latest first)
      if (params.reverseOrder) {
        formattedData = [...formattedData].reverse();
      }

      //  Pagination
      const start = (params.pageNumber - 1) * params.pageSize;
      const data = formattedData.slice(start, start + params.pageSize);

      return { data, total: formattedData.length };
    } catch {
      return { data: [], total: 0 };
    }
  };

  return (
    <KiduServerTable
      title="Promotion List"
      subtitle="List of all promotions with Edit & View options"
      columns={columns}
      idKey="promotionId"
      addButtonLabel="Add New Promotion"
      addRoute="/dashboard/settings/create-promotion"
      editRoute="/dashboard/settings/edit-promotion"
      viewRoute="/dashboard/settings/view-promotion"
      fetchData={fetchData}
      showSearch={true}
      showActions={true}
      showExport={true}
      showAddButton={true}
      rowsPerPage={10}
      reverseOrder={true}
    />
  );
};

export default PromotionPage;