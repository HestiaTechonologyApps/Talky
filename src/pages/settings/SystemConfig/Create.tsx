import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import KiduValidation from "../../../components/KiduValidation";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import systemconfigService from "../../../services/settings/SystemConfig.services";
import type { CompanyLookup } from "../../../types/settings/Company.types";
import type { systemconfig } from "../../../types/settings/SystemConfig";

// Typing the errors object
type ErrorState = Record<string, string>;

const SystemConfigCreate: React.FC = () => {
  const navigate = useNavigate();

  // Validation field metadata
  const fields = [
    { name: "currentCompanyId", rules: { required: true, type: "select" as const, label: "Company" } },
    { name: "intCurrentFinancialYear", rules: { required: true, type: "text" as const, label: "Financial Year" } },
    { name: "staff_To_User_Rate_Per_Second", rules: { required: true, type: "number" as const, label: "Staff to User Rate per Second" } },
    { name: "one_paisa_to_coin_rate", rules: { required: true, type: "number" as const, label: "1 Paisa to Coin Rate" } },
  ];

  const initialValues: any = {};
  const initialErrors: ErrorState = {};

  fields.forEach((f) => {
    initialValues[f.name] = "";
    initialErrors[f.name] = "";
  });

  // -------------------------
  // FORM STATE BASED ON MODEL
  // -------------------------
  const [formData, setFormData] = useState<systemconfig>({
    ...initialValues,
    appMasterSettingId: 0,
    isActive: true,
  });

  const [companyList, setCompanyList] = useState<CompanyLookup[]>([]);
  const [errors, setErrors] = useState<ErrorState>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData: systemconfig = {
    ...initialValues,
    appMasterSettingId: 0,
    isActive: true,
  };

  // -------------------------
  // LOAD COMPANY LOOKUPS
  // -------------------------
  const getCompanyLookup = async () => {
    try {
      const companies = await systemconfigService.getCompanyIds();
      setCompanyList(companies);
    } catch {
      toast.error("Failed to load company list");
    }
  };

  useEffect(() => {
    getCompanyLookup();
  }, []);

  // -------------------------
  const getLabel = (name: string) => {
    const field = fields.find((f) => f.name === name);
    return (
      <>
        {field?.rules.label}
        {field?.rules.required && <span style={{ color: "red" }}>*</span>}
      </>
    );
  };

  // -------------------------
  // HANDLE CHANGE (WITH TYPE FIX)
  // -------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;

    let value: any = e.target.value;
    if (type === "checkbox") value = (e.target as HTMLInputElement).checked;

    setFormData((prev: systemconfig) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // -------------------------
  const overrideMessage = (name: string) => {
    const field = fields.find((f) => f.name === name);
    return `${field?.rules.label || "This field"} is required.`;
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    const result = KiduValidation.validate(value, field.rules);

    if (!result.isValid) {
      setErrors((prev) => ({ ...prev, [name]: overrideMessage(name) }));
      return false;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    return true;
  };

  const validateForm = () => {
    let ok = true;

    fields.forEach((f) => {
      if (!validateField(f.name, formData[f.name as keyof systemconfig])) {
        ok = false;
      }
    });

    return ok;
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: systemconfig = {
        ...formData,
        staff_To_User_Rate_Per_Second: Number(formData.staff_To_User_Rate_Per_Second),
        one_paisa_to_coin_rate: Number(formData.one_paisa_to_coin_rate),
        currentCompanyId: String(formData.currentCompanyId),
      };

      const response = await systemconfigService.CreateSystemconfig(payload);

      if (!response?.isSucess) {
        throw new Error(response?.customMessage || "Failed to create config");
      }

      toast.success(" created successfully!");

      setTimeout(() => navigate("/dashboard/settings/systemconfig-list"), 1200);

    } catch (error: any) {
      toast.error(error.message || "Error creating configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1100px" }}>
          <div className="d-flex align-items-center mb-4">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>
              Create System Configuration
            </h5>
          </div>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">

                {/* Company Dropdown */}
                <Col md={6}>
                  <Form.Label>{getLabel("currentCompanyId")}</Form.Label>
                  <Form.Select
                    size="sm"
                    name="currentCompanyId"
                    value={formData.currentCompanyId}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Company --</option>
                    {companyList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.text}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.currentCompanyId && <small className="text-danger">{errors.currentCompanyId}</small>}
                </Col>

                {/* Financial Year */}
                <Col md={6}>
                  <Form.Label>{getLabel("intCurrentFinancialYear")}</Form.Label>
                  <Form.Control
                    size="sm"
                    name="intCurrentFinancialYear"
                    value={formData.intCurrentFinancialYear}
                    onChange={handleChange}
                  />
                </Col>

                {/* Staff Rate */}
                <Col md={6}>
                  <Form.Label>{getLabel("staff_To_User_Rate_Per_Second")}</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    name="staff_To_User_Rate_Per_Second"
                    value={formData.staff_To_User_Rate_Per_Second}
                    onChange={handleChange}
                  />
                </Col>

                {/* Coin Rate */}
                <Col md={6}>
                  <Form.Label>{getLabel("one_paisa_to_coin_rate")}</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    name="one_paisa_to_coin_rate"
                    value={formData.one_paisa_to_coin_rate}
                    onChange={handleChange}
                  />
                </Col>

                {/* Active Switch */}
                <Col md={6}>
                  <Form.Check
                    type="switch"
                    id="isActive"
                    label="Is Active"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </Col>

              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4 me-2">
                <KiduReset initialValues={initialData} setFormData={setFormData} setErrors={setErrors} />
                <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#882626ff", border: "none" }}>
                  {isSubmitting ? "Saving..." : "Create"}
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

export default SystemConfigCreate;
