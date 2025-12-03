import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomerService from "../../services/Customer.services";
import KiduLoader from "../../components/KiduLoader";
import KiduPrevious from "../../components/KiduPrevious";
import { KiduValidation } from "../../components/KiduValidation";
import KiduReset from "../../components/ReuseButtons/KiduReset";
import Attachments from "../../components/KiduAttachments";
import AuditTrailsComponent from "../../components/KiduAuditLogs";
import type { Customer } from "../../types/Customer.types";

const CustomerEdit: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const tableName = "Customer";
  const recordId = Number(customerId);

  const fields = [
    { name: "customerName", rules: { required: true, type: "text", label: "Customer Name" } },
    { name: "dob", rules: { required: true, type: "date", label: "Registered Date" } },
    { name: "customerPhone", rules: { required: true, type: "number", minLength: 10, maxLength: 10, label: "Phone Number" } },
    { name: "nationality", rules: { required: true, type: "text", label: "Nationality" } },
    { name: "customerEmail", rules: { required: true, type: "email", label: "Email ID" } },
    { name: "customerAddress", rules: { required: true, type: "text", label: "Address" } }
  ];

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const res = await CustomerService.getById(Number(customerId));
        if (res.isSucess && res.value) {
          const d = res.value;
          const loadedValues = {
            customerName: d.customerName || "",
            dob: d.dob ? d.dob.split("T")[0] : "",
            customerPhone: d.customerPhone || "",
            nationality: d.nationality || "",
            customerEmail: d.customerEmail || "",
            customerAddress: d.customerAddress || ""
          };
          setFormData(loadedValues);
          setInitialValues(loadedValues);
          const errValues: any = {};
          fields.forEach(f => { errValues[f.name] = ""; });
          setErrors(errValues);
        } else {
          toast.error("Failed to load customer details");
          navigate("/dashboard/customer-list");
        }
      } catch (err: any) {
        toast.error(err.message);
        navigate("/dashboard/customer-list");
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, navigate]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const updated = type === "tel" ? value.replace(/[^0-9]/g, "") : value;
    setFormData((prev: any) => ({ ...prev, [name]: updated }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const validateField = (name: string, value: any) => {
    const rule = fields.find(f => f.name === name)?.rules;
    if (!rule) return true;
    const result = KiduValidation.validate(value, rule as any);
    setErrors((prev: any) => ({ ...prev, [name]: result.isValid ? "" : result.message }));
    return result.isValid;
  };

  const validateForm = () => {
    let ok = true;
    fields.forEach(f => { if (!validateField(f.name, formData[f.name])) ok = false; });
    return ok;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const customerData: Customer = {
        customerId: Number(customerId),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerAddress: formData.customerAddress,
        dob: formData.dob || null,
        dobString: formData.dob,
        gender: "",
        nationalilty: formData.nationality,
        nationality: formData.nationality,
        createdAt: new Date().toISOString(),
        isActive: true,
        isDeleted: false
      };

      const res = await CustomerService.update(Number(customerId), customerData);
      if (res.isSucess) {
        toast.success("Customer updated successfully!");
        setTimeout(() => navigate("/dashboard/customer-list"), 1500);
      } else {
        toast.error(res.customMessage || res.error);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <KiduLoader type="customer details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3"><KiduPrevious /></div>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Edit Customer</h4>
        </div>

        <hr />

        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[0].rules.label} {fields[0].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control type="text" name={fields[0].name} placeholder="Enter customer name" value={formData[fields[0].name]} onChange={handleChange} onBlur={() => validateField(fields[0].name, formData[fields[0].name])} />
              {errors[fields[0].name] && <span className="text-danger">{errors[fields[0].name]}</span>}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[1].rules.label} {fields[1].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control type="date" name={fields[1].name} value={formData[fields[1].name]} onChange={handleChange} onBlur={() => validateField(fields[1].name, formData[fields[1].name])} />
              {errors[fields[1].name] && <small className="text-danger">{errors[fields[1].name]}</small>}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[2].rules.label} {fields[2].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control type="tel" name={fields[2].name} placeholder="Enter phone number" value={formData[fields[2].name]} onChange={handleChange} onBlur={() => validateField(fields[2].name, formData[fields[2].name])} />
              {errors[fields[2].name] && <small className="text-danger">{errors[fields[2].name]}</small>}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[3].rules.label} {fields[3].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control type="text" name={fields[3].name} placeholder="Enter nationality" value={formData[fields[3].name]} onChange={handleChange} onBlur={() => validateField(fields[3].name, formData[fields[3].name])} />
              {errors[fields[3].name] && <small className="text-danger">{errors[fields[3].name]}</small>}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[4].rules.label} {fields[4].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control type="email" name={fields[4].name} placeholder="Enter email" value={formData[fields[4].name]} onChange={handleChange} onBlur={() => validateField(fields[4].name, formData[fields[4].name])} />
              {errors[fields[4].name] && <small className="text-danger">{errors[fields[4].name]}</small>}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">{fields[5].rules.label} {fields[5].rules.required ? <span className="text-danger">*</span> : ""}</Form.Label>
              <Form.Control as="textarea" rows={3} name={fields[5].name} placeholder="Enter address" value={formData[fields[5].name]} onChange={handleChange} onBlur={() => validateField(fields[5].name, formData[fields[5].name])} />
              {errors[fields[5].name] && <small className="text-danger">{errors[fields[5].name]}</small>}
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <KiduReset initialValues={initialValues} setFormData={setFormData} />
            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Update</Button>
          </div>

          <Row className="mb-2">
            <Col xs={12}>
              <Attachments tableName={tableName} recordId={recordId} />
            </Col>
          </Row>

          <div>
            <AuditTrailsComponent tableName={tableName} recordId={recordId} />
          </div>
        </Form>
      </Container>

      <Toaster position="top-right" />
    </>
  );
};

export default CustomerEdit;
