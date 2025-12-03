import React from "react";
import KiduServerTripList from "../../../components/Trip/KiduTripList";

const CompletedTrips: React.FC = () => (
  <KiduServerTripList
    key="completed-trips" // Add unique key
    title="Completed Trips"
    subtitle="List of trips that are completed with quick edit & view actions"
    fetchMode="status"
    status="Completed"
    showAddButton={false}
  />
);

export default CompletedTrips;