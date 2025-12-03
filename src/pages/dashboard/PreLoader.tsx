// Preloader.tsx
import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import carGif from "../../assets/Gifs/car.gif";

const Preloader: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login"); // redirect after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // cleanup
    }, [navigate]);

    return (

        <>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
                style={{
                    backgroundColor: "#f8f9fa",
                    fontFamily: "Plus Jakarta Sans",
                }}
            >
                <Row className="text-center">
                    <Col>
                        {/* Preloader GIF or Spinner */}
                        <div className="mb-3">
                            <img
                                src={carGif}
                                alt="Loading..."
                                className="img-fluid"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>

                        {/* Spinner (Bootstrap alternative) */}
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                            <Spinner animation="border" variant="success" />
                            <Spinner animation="grow" variant="success" />
                        </div>

                        {/* App name / message */}
                        <h4
                            className="fw-semibold mt-2"
                            style={{ color: "#18575A", fontWeight: 700 }}
                        >
                            Welcome.....
                        </h4>
                        <p
                            style={{
                                color: "#6c757d",
                                fontFamily: "Urbanist",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            Preparing your experience... Please wait
                        </p>
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default Preloader;
