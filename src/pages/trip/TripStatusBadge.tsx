import React from "react";
import { Badge } from "react-bootstrap";

interface TripStatusBadgeProps {
  status: string;
}

const TripStatusBadge: React.FC<TripStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "cancelled":
      case "canceled":
        return "danger";
      case "scheduled":
        return "warning";
      default:
        return "secondary";
    }
  };

 

  return (
    <div
      className="m-3 d-flex align-items-end head-font fs-5"
      
    >
      

      <Badge
        bg={getVariant()}
        className="px-5 py-2 fw-bolder text-uppercase shadow-lg rounded-1"
        
      >
        {status || "Unknown"}
      </Badge>
    </div>
  );
};

export default TripStatusBadge;
