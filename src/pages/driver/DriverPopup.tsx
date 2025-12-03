import React from "react";
import KiduPopup from "../../components/KiduPopup";
import { API_ENDPOINTS } from "../../constants/API_ENDPOINTS";
import type { Driver } from "../../types/Driver.types";
import DriverCreateModal from "../driver/DriverModal";

const DriverPopup: React.FC<{
  show: boolean;
  handleClose: () => void;
  onSelect: (driver: Driver) => void;
}> = (props) => {
  return (
    <KiduPopup<Driver>
      {...props}
      title="Select Driver"
      fetchEndpoint={API_ENDPOINTS.DRIVER.GET_ALL}
      columns={[
        { key: "driverId", label: "Driver ID" },
        { key: "driverName", label: "Driver Name" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "license", label: "License" }
      ]}
      searchKeys={["driverId", "driverName", "contactNumber", "license"]}
      AddModalComponent={DriverCreateModal}
    />
  );
};

export default DriverPopup;
