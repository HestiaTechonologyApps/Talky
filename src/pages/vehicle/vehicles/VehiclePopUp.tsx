import React from "react";
import KiduPopup from "../../../components/KiduPopup";
import type { Vehicle } from "../../../types/vehicle/Vehicles.types";
import { API_ENDPOINTS } from "../../../constants/API_ENDPOINTS";
import vehicleCreateModal from "./VehicleModal";

const VehiclePopUp: React.FC<{
  show: boolean;
  handleClose: () => void;
  onSelect: (vehicle: Vehicle) => void;
}> = (props) => {
  return (
    <KiduPopup<Vehicle>
      {...props}
      title="Select vehicle"
      fetchEndpoint={API_ENDPOINTS.VEHICLE.GET_ALL}
      columns={[
        { key: "vehicleId", label: "Vehicle ID" },
        { key: "registrationNumber", label: "Registration Number" },
        { key: "vehicleType", label: "Vehicle Type" },
        { key: "currentStatus", label: "Current Status" }
      ]}
      searchKeys={["registrationNumber", "vehicleType", "currentStatus"]}
      AddModalComponent={vehicleCreateModal}
    />
  );
};

export default VehiclePopUp;
