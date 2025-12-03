import KiduCreateModal, { type Field } from "../../../components/KiduCreateModal";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";
import type { Vehicle } from "../../../types/vehicle/Vehicles.types";

const vehicleFields : Field[] = [
  { name: "vehicleType", label: "Vehicle Type", type: "text", required: true },
  { name: "registrationNumber", label: "Registration Number", type: "text", required: true },
  { name: "registrationExpiry", label: "Registration Expiry", type: "date", required: true },
  { name: "location", label: "Location", type: "text", required: true }
];

interface CustomerCreateModalProps {
  show: boolean;
  handleClose: () => void;
  onAdded: (newItem: Vehicle) => void;
}

const vehicleCreateModal: React.FC<CustomerCreateModalProps> = ({
  show,
  handleClose,
  onAdded
}) => {
  return (
    <KiduCreateModal<Vehicle>
      show={show}
      handleClose={handleClose}
      title="Create vehicle"
      fields={vehicleFields}
      endpoint={API_ENDPOINTS.VEHICLE.CREATE}
      onCreated={onAdded}
    />
  );
};

export default vehicleCreateModal;
