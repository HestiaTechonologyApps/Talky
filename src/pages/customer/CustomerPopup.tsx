import React from "react";
import KiduPopup from "../../components/KiduPopup";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { Customer } from "../../types/Customer.types";
import CustomerCreateModal from "./CustomerModal";

const CustomerPopup: React.FC<{
  show: boolean;
  handleClose: () => void;
  onSelect: (customer: Customer) => void;
}> = (props) => {
  return (
    <KiduPopup<Customer>
      {...props}
      title="Select Customer"
      fetchEndpoint={API_ENDPOINTS.CUSTOMER.GET_ALL}
      columns={[
        { key: "customerId", label: "Customer ID" },
        { key: "customerName", label: "Customer Name" },
        { key: "customerPhone", label: "Phone" },
        { key: "customerEmail", label: "Email" }
      ]}
      searchKeys={["customerName", "customerPhone", "customerEmail", "customerId"]}
      AddModalComponent={CustomerCreateModal}
    />
  );
};

export default CustomerPopup;
