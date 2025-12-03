import React from "react";
import KiduServerTripList from "../../../components/Trip/KiduTripList";

const AllTrips: React.FC = () => (
  <KiduServerTripList
    key="all-trips" // Add unique key
    title="Total Trips"
    subtitle="List of all trips with quick edit & view actions"
    fetchMode="all"
    showAddButton={true}
  />
);

export default AllTrips;