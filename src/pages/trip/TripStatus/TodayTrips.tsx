import React from "react";
import KiduServerTripList from "../../../components/Trip/KiduTripList";

const TodaysTrip: React.FC = () => (
  <KiduServerTripList
    key="todays-trips" // Add unique key
    title="Today's Trips"
    subtitle="List of all trips scheduled or completed for today"
    fetchMode="today"
    showAddButton={false}
  />
);

export default TodaysTrip;