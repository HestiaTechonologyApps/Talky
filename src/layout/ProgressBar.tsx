import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";

const ProgressBar: React.FC = () => {
  return (
    <Row>
      <Col xs={12} md={6}>
        <Card className="shadow-sm border-0 px-4 h-auto w-75 py-3">
          <Card.Body>
            <Card.Title className="fw-bold fs-6 mb-2 head-font">Top Routes</Card.Title>

            {/* Sharjah */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2 head-font">
                  <Image
                    src="https://thumbs.dreamstime.com/b/sharjah-light-festival-sunset-khalid-lake-city-uae-i-used-camera-canon-d-mark-iii-lens-128222169.jpg"
                    className="rounded"
                    width={20}
                    height={20}
                    style={{ objectFit: "cover" }}
                  />
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>Sharjah</span>
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
                    background: "linear-gradient(90deg,#ff7b00,#ff4081)",
                  }}
                ></div>
              </div>
            </div>

            {/* Dubai */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src="https://thumbs.dreamstime.com/b/sharjah-light-festival-sunset-khalid-lake-city-uae-i-used-camera-canon-d-mark-iii-lens-128222169.jpg"
                    className="rounded"
                    width={20}
                    height={20}
                    style={{ objectFit: "cover" }}
                  />
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>Dubai</span>
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
                    background: "linear-gradient(90deg,#007bff,#ff80ab)",
                  }}
                ></div>
              </div>
            </div>

            {/* UAE */}
            <div className="mb-2">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src="https://thumbs.dreamstime.com/b/sharjah-light-festival-sunset-khalid-lake-city-uae-i-used-camera-canon-d-mark-iii-lens-128222169.jpg"
                    className="rounded"
                    width={20}
                    height={20}
                    style={{ objectFit: "cover" }}
                  />
                  <span className="fw-semibold" style={{ fontSize: "12px" }}>UAE</span>
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
                    background: "linear-gradient(90deg,#dc3545,#ff9a9e)",
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
