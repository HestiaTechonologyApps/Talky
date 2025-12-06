// src/pages/Auth/ForgotPasswordPage.tsx

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/common/Authservices";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const validateEmail = (value: string): string => {
    if (!value) return "Email is required.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address.";
    return "";
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (submitted) setError(validateEmail(value));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitted(true);

    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    setIsLoading(true);

    try {
      const response = await AuthService.forgotPassword({ email });
      if (response.isSucess) {
        toast.success("Password reset link sent successfully!");
        setEmail("");
        setSubmitted(false);
        setError("");
      } else {
        toast.error(response.customMessage || "Failed to send reset link.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container
        fluid
        className="background"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #882626 0%, #B84C4C 50%, #F2B6B6 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "80px"
        }}
      >
        <Row style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Col xs={12} sm={10} md={6} lg={4}>
            <form className="form" onSubmit={handleSubmit}>
              <div className="container bg-white shadow border px-5 py-4" style={{ borderRadius: "24px", border: "1px solid #E6E6E6" }}>
                <p className="fw-medium text-center fs-4" style={{ fontWeight: 700, fontFamily: "Plus Jakarta Sans", color: "#882626" }}>Forgot Password</p>

                <div className="d-grid gap-2 mb-2 mt-4">
                  <label style={{ fontFamily: "Urbanist", color: "#A6A6A6", fontSize: "15px" }}>Enter your email address</label>
                </div>

                <div className="d-grid gap-2 mb-2">
                  <input
                    type="email"
                    className={`p-2 rounded-2 border ${submitted && error ? "border-danger" : ""}`}
                    value={email}
                    onChange={onEmailChange}
                    placeholder="e.g., johndoe@example.com"
                  />
                  {submitted && error && (
                    <span className="text-danger" style={{ fontFamily: "Urbanist", fontSize: "13px" }}>{error}</span>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="rounded-3 p-2 border-0 mt-3"
                    type="submit"
                    disabled={isLoading}
                    style={{
                      backgroundColor: "#882626",
                      fontFamily: "Urbanist",
                      fontSize: "15px",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer"
                    }}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <p
                    onClick={() => navigate("/")}
                    className="text-decoration-underline fw-semibold"
                    style={{ fontFamily: "Urbanist", fontSize: "13px", color: "#882626", cursor: "pointer" }}
                  >
                    Back to Login
                  </p>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Container>

      <Toaster position="top-right"/>
    </>
  );
};

export default ForgotPassword;
