import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SystemConfigService from "../../../services/settings/SystemConfig.services";
import KiduValidation from "../../../components/KiduValidation";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import KiduAuditLogs from "../../../components/KiduAuditLogs";
import type { CompanyLookup } from "../../../types/settings/Company.types";
import type { systemconfig } from "../../../types/settings/SystemConfig";

const SystemConfigEdit: React.FC = () => {
  const navigate = useNavigate();
  const { appMasterSettingId } = useParams<{ appMasterSettingId: string }>();

  const fields = [
    { name: "currentCompanyId", rules: { required: true, type: "select" as const, label: "Company" } },
    { name: "intCurrentFinancialYear", rules: { required: true, type: "text" as const, label: "Financial Year" } },
    { name: "staff_To_User_Rate_Per_Second", rules: { required: true, type: "number" as const, label: "Staff to User Rate per Second" } },
    { name: "one_paisa_to_coin_rate", rules: { required: true, type: "number" as const, label: "1 Paisa to Coin Rate" } },
  ];

  // Initialize formData and errors
  const initialValues: Record<string, any> = {};
  const initialErrors: Record<string, string> = {};
  fields.forEach(f => {
    initialValues[f.name] = "";
    initialErrors[f.name] = "";
  });

  const [formData, setFormData] = useState<systemconfig>({
    ...initialValues,
    appMasterSettingId: 0,
    currentCompanyId: "",
    intCurrentFinancialYear: "",
    staff_To_User_Rate_Per_Second: 0,
    one_paisa_to_coin_rate: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);
  const [companyList, setCompanyList] = useState<CompanyLookup[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<systemconfig | null>(null);

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

  // Load company lookup list
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companies = await SystemConfigService.getCompanyIds();
        setCompanyList(companies);
      } catch {
        toast.error("Failed to load company list");
      }
    };
    loadCompanies();
  }, []);

  // Load system config by ID
  useEffect(() => {
    const fetchSystemConfig = async () => {
      if (!appMasterSettingId) {
        toast.error("No ID provided");
        navigate("/dashboard/settings/systemconfig-list");
        return;
      }
      try {
        setLoading(true);
        const response = await SystemConfigService.getAppmasterSetting(); // Or get by ID if API supports
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || "Failed to load system configuration");
        }

        const data = response.value.find(item => String(item.appMasterSettingId) === appMasterSettingId);
        if (!data) throw new Error("System config not found");

        setFormData(data);
        setInitialData(data);
      } catch (error: any) {
        toast.error(error.message || "Error loading system configuration");
        navigate("/dashboard/settings/systemconfig-list");
      } finally {
        setLoading(false);
      }
    };
    fetchSystemConfig();
  }, [appMasterSettingId, navigate]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let updatedValue: any = value;

    if (type === "checkbox") {
      updatedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      updatedValue = value === "" ? "" : Number(value);
    }

    setFormData((prev: systemconfig) => ({ ...prev, [name]: updatedValue }));
    if (errors[name]) setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find(f => f.name === name);
    if (!field) return true;
    const result = KiduValidation.validate(value, field.rules);
    if (!result.isValid) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: `${field.rules.label} is required.` }));
      return false;
    }
    setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));
    return true;
  };

  const validateForm = () => {
    let ok = true;
    fields.forEach(f => {
      if (!validateField(f.name, formData[f.name as keyof systemconfig])) ok = false;
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await SystemConfigService.updateSystemconfig(formData);
      if (!response?.isSucess) {
        throw new Error(response?.customMessage || "Failed to update system configuration");
      }

      toast.success("System configuration updated successfully!");
      setTimeout(() => navigate("/dashboard/settings/systemconfig-list"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Error updating system configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <KiduLoader type="System Config..." />;

  return (
    <div className="container d-flex justify-content-center mt-5">
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1100px" }}>
        <div className="d-flex align-items-center mb-4">
          <KiduPrevious />
          <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>
            Edit System Configuration
          </h5>
        </div>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>{getLabel("currentCompanyId")}</Form.Label>
                <Form.Select
                  name="currentCompanyId"
                  value={formData.currentCompanyId}
                  onChange={handleChange}
                  onBlur={() => validateField("currentCompanyId", formData.currentCompanyId)}
                >
                  <option value="">-- Select Company --</option>
                  {companyList.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.text}
                    </option>
                  ))}
                </Form.Select>
                {errors.currentCompanyId && <div className="text-danger small">{errors.currentCompanyId}</div>}
              </Col>

              <Col md={6}>
                <Form.Label>{getLabel("intCurrentFinancialYear")}</Form.Label>
                <Form.Control
                  type="text"
                  name="intCurrentFinancialYear"
                  value={formData.intCurrentFinancialYear}
                  onChange={handleChange}
                  onBlur={() => validateField("intCurrentFinancialYear", formData.intCurrentFinancialYear)}
                  placeholder="Enter Financial Year"
                />
              </Col>

              <Col md={6}>
                <Form.Label>{getLabel("staff_To_User_Rate_Per_Second")}</Form.Label>
                <Form.Control
                  type="number"
                  name="staff_To_User_Rate_Per_Second"
                  value={formData.staff_To_User_Rate_Per_Second}
                  onChange={handleChange}
                  onBlur={() =>
                    validateField("staff_To_User_Rate_Per_Second", formData.staff_To_User_Rate_Per_Second)
                  }
                />
              </Col>

              <Col md={6}>
                <Form.Label>{getLabel("one_paisa_to_coin_rate")}</Form.Label>
                <Form.Control
                  type="number"
                  name="one_paisa_to_coin_rate"
                  value={formData.one_paisa_to_coin_rate}
                  onChange={handleChange}
                  onBlur={() => validateField("one_paisa_to_coin_rate", formData.one_paisa_to_coin_rate)}
                />
              </Col>

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
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </Form>

          {formData.appMasterSettingId && (
            <KiduAuditLogs tableName="AppMasterSetting" recordId={String(formData.appMasterSettingId)} />
          )}
        </Card.Body>
      </Card>

      <Toaster position="top-right" />
    </div>
  );
};

export default SystemConfigEdit;
