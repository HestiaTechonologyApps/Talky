import React from "react";
import Navbar from "../../layout/Navbar";
import { Col, Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";

const DashBoard: React.FC = () => {

 


  return (
    <Container fluid className="min-vh-100">
      <Row className="flex-nowrap">
        {/* Sidebar */}
        <Col
          xs={12}
          className="p-2 bg-light border-end min-vh-100 d-flex flex-column">
          <Sidebar />

          {/* Navbar */}
          <div className="mb-4">
            <Navbar />
          </div>

          {/* Nested content */}
          <div className="ms-md-5 ps-md-5 bg-light">
          <Outlet />  {/*  renders the child route */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashBoard;
