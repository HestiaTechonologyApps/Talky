import React, { useEffect, useState, useCallback } from "react";
import { Purchascoupon } from "../../../types/settings/PurchaseCouponType";
import PurchaseCouponService from "../../../services/PurchaseCoupon.Services";
import KiduLoader from "../../../components/KiduLoader";
import KiduTable from "../../../components/KiduTable";
//import { Purchascoupon } from "types/PurchaseType";
//import PurchaseCouponService from "services/PurchaseCouponService";
///import KiduTable from "components/KiduTable";
//import KiduLoader from "components/KiduLoader";

// Table Columns
const columns = [
  { label: "ID", key: "purchaseCouponId" },
  { label: "Coins", key: "coins" },
  { label: "Amount", key: "amount" },
  { label: "Past Amount", key: "pastAmount" },
  { label: "Status", key: "isActive" },
  { label: "Created Date", key: "createdAt" },
];

const PurchaseCouponPage: React.FC = () => {
  const [couponList, setCouponList] = useState<Purchascoupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);

      const response = await PurchaseCouponService.getAllCoupons();

      if (response && Array.isArray(response)) {
        setCouponList(response);
        setError(null);
      } else {
        setError("Failed to load purchase coupon data");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  if (loading) return <KiduLoader type="Loading Purchase Coupons..." />;

  return (
    <KiduTable
      title="Purchase Coupon List"
      subtitle="List of all purchase coupons with Edit & View options"
      data={couponList}
      addButtonLabel="Add New Coupon"
      columns={columns}
      idKey="purchaseCouponId"
      addRoute="/Purchase-Coupon/AddPurchaseCoupon"
      editRoute="/Purchase-Coupon/PurchaseCouponEdit"   // KiduTable will append /id
      viewRoute="/Purchase-Coupon/PurchaseCouponView"   // KiduTable will append /id
      error={error}
      onRetry={loadCoupons}
    />
  );
};

export default PurchaseCouponPage;
