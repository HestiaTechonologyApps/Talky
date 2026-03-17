import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import KiduValidation from "../../../components/KiduValidation";

import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import PromotionService from "../../../services/Promotion/Promotion.Services";

const CreatePromotion: React.FC = () => {
  const navigate = useNavigate();

  const fields = [
    { name: "tittle", rules: { required: true, type: "text" as const, label: "Title" } },
    { name: "description", rules: { required: false, type: "text" as const, label: "Description", maxLength: 200 } },
    { name: "couponCode", rules: { required: true, type: "text" as const, label: "Coupon Code" } },
    { name: "fromTime", rules: { required: true, type: "date" as const, label: "From Date" } },
    { name: "toTime", rules: { required: true, type: "date" as const, label: "To Date" } },
  ];

  const initialValues: any = {};
  const initialErrors: any = {};

  fields.forEach(f => {
    initialValues[f.name] = "";
    initialErrors[f.name] = "";
  });

  const [formData, setFormData] = useState({
    ...initialValues,
    promotionId: 0,
  });

  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData] = useState({
    ...initialValues,
    promotionId: 0,
  });

  const getLabel = (name: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return "";
    return (
      <>
        {field.rules.label}
        {field.rules.required && <span style={{ color: "red", marginLeft: "2px" }}>*</span>}
      </>
    );
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const overrideMessage = (name: string) => {
    const field = fields.find(f => f.name === name);
    const label = field?.rules.label || "This field";
    return `${label} is required.`;
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find(f => f.name === name);
    if (!field) return true;

    const result = KiduValidation.validate(value, field.rules);

    if (!result.isValid) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: overrideMessage(name),
      }));
      return false;
    }

    setErrors((prev: any) => ({ ...prev, [name]: "" }));
    return true;
  };

  const validateForm = () => {
    let ok = true;
    fields.forEach(f => {
      if (!validateField(f.name, formData[f.name])) ok = false;
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToCreate = {
        promotionId: 0,
        tittle: formData.tittle || "",
        description: formData.description || "",
        couponCode: formData.couponCode || "",
        fromTime: formData.fromTime,
        toTime: formData.toTime,
      };

      const response = await PromotionService.addPromotion(dataToCreate as any);

      if (!response) {
        throw new Error("Failed to create promotion");
      }

      toast.success("Promotion created successfully!");
      setTimeout(() => navigate("/dashboard/settings/promotion-list"), 1500);
    } catch (error: any) {
      console.error("Create promotion failed:", error);
      toast.error(`Error creating promotion: ${error.message}`);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center mt-5"
        style={{ fontFamily: "Urbanist" }}
      >
        <Card
          className="shadow-lg p-4 w-100"
          style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <KiduPrevious />
              <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>
                Create Promotion
              </h5>
            </div>
          </div>

          <Card.Body style={{ padding: "1.5rem" }}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col xs={12}>
                  <Row className="g-2">

                    {/* Title */}
                    <Col md={6}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("tittle")}</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="tittle"
                        value={formData.tittle}
                        onChange={handleChange}
                        onBlur={() => validateField("tittle", formData.tittle)}
                        placeholder="Enter Title"
                      />
                      {errors.tittle && <div className="text-danger small">{errors.tittle}</div>}
                    </Col>

                    {/* Coupon Code */}
                    <Col md={6}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("couponCode")}</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleChange}
                        onBlur={() => validateField("couponCode", formData.couponCode)}
                        placeholder="Enter Coupon Code"
                      />
                      {errors.couponCode && <div className="text-danger small">{errors.couponCode}</div>}
                    </Col>

                    {/* From Date */}
                    <Col md={6}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("fromTime")}</Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        name="fromTime"
                        value={formData.fromTime}
                        onChange={handleChange}
                        onBlur={() => validateField("fromTime", formData.fromTime)}
                      />
                      {errors.fromTime && <div className="text-danger small">{errors.fromTime}</div>}
                    </Col>

                    {/* To Date */}
                    <Col md={6}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("toTime")}</Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        name="toTime"
                        value={formData.toTime}
                        onChange={handleChange}
                        onBlur={() => validateField("toTime", formData.toTime)}
                      />
                      {errors.toTime && <div className="text-danger small">{errors.toTime}</div>}
                    </Col>

                    {/* Description */}
                    <Col md={12}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("description")}</Form.Label>
                      <Form.Control
                        size="sm"
                        as="textarea"
                        rows={2}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={() => validateField("description", formData.description)}
                        placeholder="Enter Description"
                        maxLength={200}
                      />
                      {errors.description && <div className="text-danger small">{errors.description}</div>}
                    </Col>

                  </Row>
                </Col>
              </Row>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 me-2">
                <KiduReset initialValues={initialData} setFormData={setFormData} setErrors={setErrors} />
                <Button
                  type="submit"
                  style={{ backgroundColor: "#882626ff", border: "none" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default CreatePromotion;