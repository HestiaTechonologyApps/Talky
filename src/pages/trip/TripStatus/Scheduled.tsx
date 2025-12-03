import React from "react";
import KiduServerTripList from "../../../components/Trip/KiduTripList";

const ScheduledTrips: React.FC = () => (
  <KiduServerTripList
    key="scheduled-trips" // Add unique key
    title="Scheduled Trips"
    subtitle="List of trips that are scheduled with quick edit & view actions"
    fetchMode="status"
    status="Scheduled"
    showAddButton={false}
  />
);

export default ScheduledTrips;