import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { Category } from "../../../types/settings/Category.type";
import { CompanyLookup } from "../../../types/settings/CompanyLookup";
import CategoryService from "../../../services/settings/Category.services";
import KiduValidation from "../../../components/KiduValidation";

//import KiduValidation from "components/KiduValidation";
//import { Category } from "types/Category";
//import CategoryService from "services/CategoryService";
//import { CompanyLookup } from "types/CompanyLookup";

const fields = [
    { name: "categoryName", rules: { required: true, type: "text" as const, label: "Category Name" } },
    { name: "categoryDescription", rules: { required: true, type: "text" as const, label: "Category Description" } },
    { name: "categoryTitle", rules: { required: true, type: "text" as const, label: "Category Title" } },
    { name: "categoryCode", rules: { required: true, type: "text" as const, label: "Category Code" } },
    { name: "companyId", rules: { required: true, type: "number" as const, label: "Company" } },
  ];
  

const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Category>({
    categoryId: 0,
    categoryName: "",
    categoryDescription: "",
    categoryTitle: "",
    categoryCode: "",
    companyName: "",
    companyId: 0,
    isDeleted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companyList, setCompanyList] = useState<CompanyLookup[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await CategoryService.getCompanyIdsFromCategories();
        setCompanyList(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load company list");
      }
    };
    loadCompanies();
  }, []);

  const getLabel = (name: string) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return "";

    return (
      <>
        {field.rules.label}
        {field.rules.required && <span style={{ color: "red" }}> *</span>}
      </>
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    const updatedValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : type === "number"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    const validation = KiduValidation.validate(value, field.rules);

    if (!validation.isValid) {
      setErrors((prev) => ({
        ...prev,
        [name]: validation.message || `${field.rules.label} is required.`,
      }));
      return false;
    }

    return true;
  };

  const validateForm = () => {
    let valid = true;

    fields.forEach((f) => {
      if (!validateField(f.name, formData[f.name as keyof Category])) valid = false;
    });

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      await CategoryService.addCompany(formData);

      toast.success("Category created successfully!");
      setTimeout(() => navigate("/dashboard/settings/Category"), 800);
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="mx-3 mt-4" style={{ backgroundColor: "#f7f7f7" }}>
      <Card.Header
        className="d-flex align-items-center"
        style={{ backgroundColor: "#18575A", color: "white" }}
      >
        <Button size="sm" variant="light" className="me-2" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </Button>
        <h6 className="mb-0">Create Category</h6>
      </Card.Header>

      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            {/* Category Name */}
            <Col md={6}>
              <Form.Group controlId="categoryName">
                <Form.Label>{getLabel("categoryName")}</Form.Label>
                <Form.Control
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryName}
                />
                <Form.Control.Feedback type="invalid">{errors.categoryName}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Category Description */}
            <Col md={6}>
              <Form.Group controlId="categoryDescription">
                <Form.Label>{getLabel("categoryDescription")}</Form.Label>
                <Form.Control
                  type="text"
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryDescription}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.categoryDescription}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Category Title */}
            <Col md={6}>
              <Form.Group controlId="categoryTitle">
                <Form.Label>{getLabel("categoryTitle")}</Form.Label>
                <Form.Control
                  type="text"
                  name="categoryTitle"
                  value={formData.categoryTitle}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryTitle}
                />
                <Form.Control.Feedback type="invalid">{errors.categoryTitle}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Category Code */}
            <Col md={6}>
              <Form.Group controlId="categoryCode">
                <Form.Label>{getLabel("categoryCode")}</Form.Label>
                <Form.Control
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryCode}
                />
                <Form.Control.Feedback type="invalid">{errors.categoryCode}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            {/* Company Dropdown */}
            <Col md={6}>
              <Form.Group controlId="companyId">
                <Form.Label>{getLabel("companyId")}</Form.Label>
                <Form.Select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  isInvalid={!!errors.companyId}
                >
                  <option value="">Select Company</option>
                  {companyList.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.text}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.companyId}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CategoryCreate;
