// src/pages/PageNotFound.tsx
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import notFoundGif from "../../assets/Gifs/not-found.gif"; // You can also use the external URL instead

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100 bg-white"
        style={{
          backgroundColor: "#f8f9fa",
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        <Row className="text-center">
          <Col>
            {/* GIF Section */}
            <div className="mb-3 rounded-3">
              <img
                src={
                  notFoundGif
                }
                alt="Page Not Found"
                className="img-fluid"
                style={{
                  width: "550px",
                  height: "350px",
                  borderRadius: "20px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Message Section */}
            <h4
              className="fw-semibold mt-3"
              style={{ color: "#18575A", fontWeight: 700 }}
            >
              Oops! Page Not Found
            </h4>

            <p
              style={{
                color: "#6c757d",
                fontFamily: "Urbanist",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              The page you’re looking for doesn’t exist or has been moved.
            </p>

            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-3 p-2 border-0"
              style={{
                backgroundColor: "#18575A",
                fontFamily: "Urbanist",
                fontSize: "15px",
                color: "#FFFFFF",
                fontWeight: 800,
                padding: "10px 20px",
              }}
            >
              Back to Home
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PageNotFound;
