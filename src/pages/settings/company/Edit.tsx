// src/pages/company/CompanydetailsEdit.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CompanyService from "../../../services/settings/Company.services";
import type { Company } from "../../../types/settings/Company.types";
import { KiduValidation } from "../../../components/KiduValidation";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduLoader from "../../../components/KiduLoader";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

const CompanyDetailsEdit: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>(); // ✅ Changed from 'id' to 'companyId'
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  console.log("Company ID from params:", companyId); // Debug log

  const fields = [
    { name: "comapanyName", label: "Company Name", rules: { required: true, type: "text" } },
    { name: "website", label: "Website", rules: { required: false, type: "text" } },
    { name: "contactNumber", label: "Mobile Number", rules: { required: true, type: "number", minLength: 10, maxLength: 15 } },
    { name: "email", label: "Email", rules: { required: true, type: "email" } },
    { name: "taxNumber", label: "Tax Number", rules: { required: false, type: "text" } },
    { name: "addressLine1", label: "Address Line 1", rules: { required: true, type: "text" } },
    { name: "addressLine2", label: "Address Line 2", rules: { required: false, type: "text" } },
    { name: "city", label: "City", rules: { required: false, type: "text" } },
    { name: "state", label: "State", rules: { required: false, type: "text" } },
    { name: "country", label: "Country", rules: { required: false, type: "text" } },
    { name: "zipCode", label: "Zip Code", rules: { required: false, type: "text" } },
    { name: "invoicePrefix", label: "Invoice Prefix", rules: { required: false, type: "text" } },
    { name: "companyLogo", label: "Company Logo", rules: { required: false, type: "text" } },
  ];

  useEffect(() => {
    const loadCompany = async () => {
      try {
        if (!companyId) { // ✅ Changed from 'id' to 'companyId'
          toast.error("Invalid company ID");
          navigate("/dashboard/settings/company-list");
          return;
        }

        const res = await CompanyService.getCompanyById(companyId); // ✅ Changed from 'id' to 'companyId'
        if (res) {
          const loadedValues = {
            companyId: res.companyId || 0,
            comapanyName: res.comapanyName || "",
            website: res.website || "",
            contactNumber: res.contactNumber || "",
            email: res.email || "",
            taxNumber: res.taxNumber || "",
            addressLine1: res.addressLine1 || "",
            addressLine2: res.addressLine2 || "",
            city: res.city || "",
            state: res.state || "",
            country: res.country || "",
            zipCode: res.zipCode || "",
            invoicePrefix: res.invoicePrefix || "",
            companyLogo: res.companyLogo || "",
            isActive: res.isActive || false,
            isDeleted: res.isDeleted || false,
          };

          setFormData(loadedValues);
          setInitialValues(loadedValues);

          // Initialize errors object
          const errObj: any = {};
          fields.forEach(f => errObj[f.name] = "");
          setErrors(errObj);

        } else {
          toast.error("Failed to load company details");
          navigate("/dashboard/settings/company-list");
        }
      } catch (err: any) {
        console.error("Error loading company:", err);
        toast.error(err.message || "Error loading company");
        navigate("/dashboard/settings/company-list");
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, navigate]); // ✅ Changed dependency from 'id' to 'companyId'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const updated = type === "tel" ? value.replace(/[^0-9]/g, "") : value;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : updated 
    }));

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
    fields.forEach(f => {
      if (!validateField(f.name, formData[f.name])) ok = false;
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const companyData: Company = {
        companyId: formData.companyId,
        comapanyName: formData.comapanyName,
        website: formData.website,
        contactNumber: formData.contactNumber,
        email: formData.email,
        taxNumber: formData.taxNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        invoicePrefix: formData.invoicePrefix,
        companyLogo: formData.companyLogo,
        isActive: formData.isActive,
        isDeleted: formData.isDeleted,
      };

      const res = await CompanyService.updateCompany(companyId!, companyData); // ✅ Changed from 'id!' to 'companyId!'

      if (res) {
        toast.success("Company updated successfully!");
        setTimeout(() => navigate("/dashboard/settings/company-list"), 1500);
      } else {
        toast.error("Failed to update company");
      }

    } catch (err: any) {
      console.error("Error updating company:", err);
      toast.error(err.message || "Failed to update company");
    }
  };

  if (loading) return <KiduLoader type="company details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3"><KiduPrevious /></div>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Edit Company</h4>
        </div>

        <hr />

        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            {fields.map((field) => (
              <Col md={6} className="mb-3" key={field.name}>
                <Form.Label className="fw-semibold">
                  {field.label} {field.rules.required && <span className="text-danger">*</span>}
                </Form.Label>
                {field.name === "addressLine1" || field.name === "addressLine2" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={field.name}
                    value={formData[field.name]}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={handleChange}
                    onBlur={() => validateField(field.name, formData[field.name])}
                  />
                ) : (
                  <Form.Control
                    type={field.name === "contactNumber" ? "tel" : field.name === "email" ? "email" : "text"}
                    name={field.name}
                    value={formData[field.name]}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={handleChange}
                    onBlur={() => validateField(field.name, formData[field.name])}
                  />
                )}
                {errors[field.name] && <small className="text-danger">{errors[field.name]}</small>}
              </Col>
            ))}

            {/* IsActive Checkbox */}
            <Col md={12} className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* BUTTONS */}
          <div className="d-flex gap-2 justify-content-end mt-4">
            <KiduReset initialValues={initialValues} setFormData={setFormData} />
            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Update</Button>
          </div>
        </Form>
      </Container>

      <Toaster position="top-right" />
    </>
  );
};

export default CompanyDetailsEdit;