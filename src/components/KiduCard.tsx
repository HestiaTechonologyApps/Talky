import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowTrendDown } from "react-icons/fa6";

interface KiduCardProps {
  title: string;
  value: number;
  change: number;
  color: string;
  onClick?: () => void;
}

const KiduCard: React.FC<KiduCardProps> = ({
  title,
  value,
  change,
  color,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      className="shadow-sm w-100 me-3 overview-card"
      style={{
        backgroundColor: color,
        color: "white",
        height: "90px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      <Card.Body className="p-2 d-flex flex-column justify-content-between">
        <p
          className="mb-1 fw-bold text-start head-font"
          style={{ fontSize: "0.95rem" }}
        >
          {title}
        </p>

        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 sub-font" style={{ fontSize: "0.75rem" }}>
            {value}
          </p>

          <p
            className="mb-0 d-flex align-items-center"
            style={{ fontSize: "0.75rem" }}
          >
            {change > 0 ? `+${change}` : change} <FaArrowTrendDown className="ms-1" />
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default KiduCard;
