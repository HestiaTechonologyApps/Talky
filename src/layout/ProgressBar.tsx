import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaVideo, FaPhone, FaHeadset } from "react-icons/fa";

const ProgressBar: React.FC = () => {
  return (
    <Row>
      <Col xs={12} md={6}>
        <Card className="shadow-sm border-0 px-4 h-auto w-75 py-3">
          <Card.Body>
            <Card.Title className="fw-bold fs-6 mb-2 head-font">Top Call Categories</Card.Title>

            {/* Video Calls */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2 head-font">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(135deg, #882626ff, #b83232)",
                    }}
                  >
                    <FaVideo size={10} color="white" />
                  </div>
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>Video Calls</span>
                </div>
                <span className="fw-bold" style={{ fontSize: "12px" }}>74%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "5px",
                  background: "#f0f0f0",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    width: "74%",
                    height: "100%",
                    borderRadius: "6px",
                    background: "linear-gradient(90deg, #882626ff, #ff4081)",
                  }}
                ></div>
              </div>
            </div>

            {/* Audio Calls */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(135deg, #28a745, #20c997)",
                    }}
                  >
                    <FaPhone size={10} color="white" />
                  </div>
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>Audio Calls</span>
                </div>
                <span className="fw-bold" style={{ fontSize: "12px" }}>52%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "5px",
                  background: "#f0f0f0",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    width: "52%",
                    height: "100%",
                    borderRadius: "6px",
                    background: "linear-gradient(90deg, #28a745, #20c997)",
                  }}
                ></div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "linear-gradient(135deg, #ffc107, #ff9800)",
                    }}
                  >
                    <FaHeadset size={10} color="white" />
                  </div>
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>Customer Support</span>
                </div>
                <span className="fw-bold" style={{ fontSize: "12px" }}>36%</span>
              </div>
              <div
                className="rounded"
                style={{
                  height: "5px",
                  background: "#f0f0f0",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    width: "36%",
                    height: "100%",
                    borderRadius: "6px",
                    background: "linear-gradient(90deg, #ffc107, #ff9800)",
                  }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProgressBar;