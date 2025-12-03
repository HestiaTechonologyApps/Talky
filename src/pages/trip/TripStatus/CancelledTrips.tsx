import React from "react";
import KiduServerTripList from "../../../components/Trip/KiduTripList";

const CancelledTrips: React.FC = () => (
  <KiduServerTripList
    key="cancelled-trips" // Add unique key
    title="Cancelled Trips"
    subtitle="List of trips that are cancelled with quick edit & view actions"
    fetchMode="status"
    status="Canceled"
    showAddButton={false}
  />
);

export default CancelledTrips;