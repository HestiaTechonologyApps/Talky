// DriverCreateModal.tsx
import KiduCreateModal, { type Field } from "../../components/KiduCreateModal";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { Driver } from "../../types/Driver.types";

const driverFields : Field[] = [
  { name: "driverName", label: "Driver Name", type: "text", required: true },
  { name: "contactNumber", label: "Contact Number", type: "text", required: true },
  { name: "license", label: "License", type: "text", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: true }
];

interface DriverCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newItem: Driver) => void;
}

const DriverCreateModal: React.FC<DriverCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  return (
    <KiduCreateModal<Driver>
      show={show}
      handleClose={handleClose}
      title="Create Driver"
      fields={driverFields}
      endpoint={API_ENDPOINTS.DRIVER.CREATE}
      onCreated={onAdded}
    />
  );
};

export default DriverCreateModal;
