// Updated CustomerCreateModal.tsx
import KiduCreateModal, { type Field } from "../../components/KiduCreateModal";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { Customer } from "../../types/Customer.types";

const customerFields : Field[] = [
  { name: "customerName", label: "Customer Name", type: "text", required: true },
  { name: "customerPhone", label: "Phone", type: "text", required: true },
  { name: "customerEmail", label: "Email", type: "text", required: true },
  { name: "nationalilty", label: "Nationality", type: "text", required: true }, 
];

interface CustomerCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newItem: Customer) => void;
}

const CustomerCreateModal: React.FC<CustomerCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  return (
    <KiduCreateModal<Customer>
      show={show}
      handleClose={handleClose}
      title="Create Customer"
      fields={customerFields}
      endpoint={API_ENDPOINTS.CUSTOMER.CREATE}
      onCreated={onAdded}
      // Remove nestedObjectName if not needed, or set it to undefined
    />
  );
};

export default CustomerCreateModal;