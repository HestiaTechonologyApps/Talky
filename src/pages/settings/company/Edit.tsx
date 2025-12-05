import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import CompanyService from "../../../services/settings/Company.services";
import { Company } from "../../../types/settings/Company.types";

import KiduValidation from "../../../components/KiduValidation";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

const CompanyDetailsEdit: React.FC = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  // ---------- VALIDATION RULES ----------
  const rules: any = {
    comapanyName: { required: true, type: "text", label: "Company Name" },
    website: { required: false, type: "text", label: "Website" },
    contactNumber: { required: true, type: "number", minLength: 10, maxLength: 15, label: "Mobile Number" },
    email: { required: true, type: "email", label: "Email" },
    taxNumber: { required: false, type: "text", label: "Tax Number" },
    addressLine1: { required: true, type: "text", label: "Address Line 1" },
    addressLine2: { required: false, type: "text", label: "Address Line 2" },
    city: { required: false, type: "text", label: "City" },
    state: { required: false, type: "text", label: "State" },
    country: { required: false, type: "text", label: "Country" },
    zipCode: { required: false, type: "text", label: "Zip Code" },
    invoicePrefix: { required: false, type: "text", label: "Invoice Prefix" },
    companyLogo: { required: false, type: "text", label: "Company Logo" }
  };

  // ---------- LOAD DATA ----------
  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) {
        toast.error("Invalid company ID");
        navigate("/dashboard/settings/company-list");
        return;
      }

      try {
        const res = await CompanyService.getCompanyById(companyId);

        const loaded = {
          companyId: res.companyId,
          comapanyName: res.comapanyName ?? "",
          website: res.website ?? "",
          contactNumber: res.contactNumber ?? "",
          email: res.email ?? "",
          taxNumber: res.taxNumber ?? "",
          addressLine1: res.addressLine1 ?? "",
          addressLine2: res.addressLine2 ?? "",
          city: res.city ?? "",
          state: res.state ?? "",
          country: res.country ?? "",
          zipCode: res.zipCode ?? "",
          invoicePrefix: res.invoicePrefix ?? "",
          companyLogo: res.companyLogo ?? "",
          isActive: res.isActive ?? false,
          isDeleted: res.isDeleted ?? false,
        };

        setFormData(loaded);
        setInitialValues(loaded);

        const err: any = {};
        Object.keys(rules).forEach((key) => (err[key] = ""));
        setErrors(err);

      } catch (error: any) {
        toast.error(error.message || "Failed to load company");
        navigate("/dashboard/settings/company-list");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  // ---------- HANDLE INPUT ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    let processedValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : type === "tel"
        ? value.replace(/[^0-9]/g, "")
        : value;

    setFormData((prev: any) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) setErrors((p: any) => ({ ...p, [name]: "" }));
  };

  // ---------- VALIDATION ----------
  const validateField = (name: string, value: any) => {
    const rule = rules[name];
    if (!rule) return true;

    const result = KiduValidation.validate(value, rule);
    setErrors((prev: any) => ({ ...prev, [name]: result.isValid ? "" : result.message }));
    return result.isValid;
  };

  const validateForm = () => {
    let ok = true;
    for (const key in rules) {
      if (!validateField(key, formData[key])) ok = false;
    }
    return ok;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await CompanyService.updateCompany(companyId!, formData);

      toast.success("Company updated successfully!");
      setTimeout(() => navigate("/dashboard/settings/company-list"), 1500);

    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  if (loading) return <KiduLoader type="Loading company details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        
        {/* HEADER */}
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3"><KiduPrevious /></div>
          <h4 className="fw-bold mt-3" style={{ color: "#18575A" }}>Edit Company</h4>
        </div>

        <hr />

        {/* FORM */}
        <Form onSubmit={handleSubmit} className="p-4">
          
          <Row>
            {/* Company Name */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Company Name *</Form.Label>
              <Form.Control
                type="text"
                name="comapanyName"
                value={formData.comapanyName}
                onChange={handleChange}
                onBlur={() => validateField("comapanyName", formData.comapanyName)}
              />
              {errors.comapanyName && <small className="text-danger">{errors.comapanyName}</small>}
            </Col>

            {/* Website */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Website</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Col>

            {/* Contact Number */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Mobile Number *</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={() => validateField("contactNumber", formData.contactNumber)}
              />
              {errors.contactNumber && (
                <small className="text-danger">{errors.contactNumber}</small>
              )}
            </Col>

            {/* Email */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => validateField("email", formData.email)}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </Col>

            {/* Tax Number */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Tax Number</Form.Label>
              <Form.Control
                type="text"
                name="taxNumber"
                value={formData.taxNumber}
                onChange={handleChange}
              />
            </Col>

            {/* Invoice Prefix */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Invoice Prefix</Form.Label>
              <Form.Control
                type="text"
                name="invoicePrefix"
                value={formData.invoicePrefix}
                onChange={handleChange}
              />
            </Col>

            {/* Address Line 1 */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Address Line 1 *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                onBlur={() => validateField("addressLine1", formData.addressLine1)}
              />
              {errors.addressLine1 && <small className="text-danger">{errors.addressLine1}</small>}
            </Col>

            {/* Address Line 2 */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Address Line 2</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </Col>

            {/* City */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Col>

            {/* State */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Col>

            {/* Country */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Col>

            {/* Zip Code */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">Zip Code</Form.Label>
              <Form.Control
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </Col>

            {/* Company Logo */}
            <Col md={12} className="mb-3">
              <Form.Label className="fw-semibold">Company Logo (Text URL)</Form.Label>
              <Form.Control
                type="text"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
              />
            </Col>

            {/* Switches */}
            <Col md={12} className="mt-3">
              <Form.Check
                type="switch"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <Form.Check
                type="switch"
                label="Deleted"
                name="isDeleted"
                checked={formData.isDeleted}
                onChange={handleChange}
                className="mt-2"
              />
            </Col>

          </Row>

          {/* BUTTONS */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <KiduReset initialValues={initialValues} setFormData={setFormData} />
            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>
              Update
            </Button>
          </div>

        </Form>
      </Container>

      <Toaster position="top-right" />
    </>
  );
};

export default CompanyDetailsEdit;
