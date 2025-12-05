import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CompanyLookup } from "../../../types/settings/CompanyLookup";
import CategoryService from "../../../services/settings/Category.services";
import KiduValidation from "../../../components/KiduValidation";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";

//import KiduPrevious from "components/KiduPrevious";
//import KiduLoader from "components/KiduLoader";
//import KiduReset from "components/ReuseButtons/KiduReset";
//import { KiduValidation } from "components/KiduValidation";

//import CategoryService from "services/CategoryService";
//import { CompanyLookup } from "types/CompanyLookup";

const CategoryEdit: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const [companyList, setCompanyList] = useState<CompanyLookup[]>([]);

  // ---------------- FIELD RULES ----------------
  const fields = [
    { name: "categoryName", rules: { required: true, type: "text" as const, label: "Category Name" } },
    { name: "categoryDescription", rules: { required: true, type: "text" as const, label: "Category Description" } },
    { name: "categoryTitle", rules: { required: true, type: "text" as const, label: "Category Title" } },
    { name: "categoryCode", rules: { required: true, type: "text" as const, label: "Category Code" } },
    { name: "companyId", rules: { required: true, type: "number" as const, label: "Company" } }
  ];

  // ---------------- FETCH COMPANY LIST ----------------
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const list = await CategoryService.getCompanyIdsFromCategories();
        setCompanyList(list);
      } catch {
        toast.error("Failed to load company data");
      }
    };
    loadCompanies();
  }, []);

  // ---------------- LOAD CATEGORY ----------------
  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) {
        toast.error("Invalid category ID");
        navigate("/Category/CategoryPage");
        return;
      }

      try {
        const res = await CategoryService.getCategoryById(String(categoryId));

        const loadedValues = {
          categoryId: res.categoryId,
          categoryName: res.categoryName ?? "",
          categoryDescription: res.categoryDescription ?? "",
          categoryTitle: res.categoryTitle ?? "",
          categoryCode: res.categoryCode ?? "",
          companyId: res.companyId,
          isDeleted: res.isDeleted ?? false
        };

        setFormData(loadedValues);
        setInitialValues(loadedValues);

        const errMap: any = {};
        fields.forEach((f) => (errMap[f.name] = ""));
        setErrors(errMap);

      } catch (error) {
        toast.error("Failed to load category");
        navigate("/Category/CategoryPage");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, navigate]);

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox" ? e.target.checked :
      type === "number" ? Number(e.target.value) :
      e.target.value;

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  // ---------------- VALIDATION ----------------
  const validateField = (name: string, value: any) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    const result = KiduValidation.validate(value, field.rules);

    setErrors((prev: any) => ({
      ...prev,
      [name]: result.isValid ? "" : result.message
    }));

    return result.isValid;
  };

  const validateForm = () => {
    let valid = true;

    fields.forEach((f) => {
      if (!validateField(f.name, formData[f.name])) valid = false;
    });

    return valid;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      await CategoryService.updateCategory(String(formData.categoryId), formData);
      toast.success("Category updated successfully!");
      setTimeout(() => navigate("/dashboard/settings/Category"), 1200);
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  if (loading) return <KiduLoader type="Category details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        {/* HEADER */}
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3">
            <KiduPrevious />
          </div>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>
            Edit Category
          </h4>
        </div>

        <hr />

        {/* FORM */}
        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            {/* Category Name */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                Category Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                onBlur={() => validateField("categoryName", formData.categoryName)}
                isInvalid={!!errors.categoryName}
              />
              <Form.Control.Feedback type="invalid">{errors.categoryName}</Form.Control.Feedback>
            </Col>

            {/* Category Description */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                Category Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="categoryDescription"
                value={formData.categoryDescription}
                onChange={handleChange}
                onBlur={() => validateField("categoryDescription", formData.categoryDescription)}
                isInvalid={!!errors.categoryDescription}
              />
              <Form.Control.Feedback type="invalid">{errors.categoryDescription}</Form.Control.Feedback>
            </Col>

            {/* Category Title */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                Category Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="categoryTitle"
                value={formData.categoryTitle}
                onChange={handleChange}
                onBlur={() => validateField("categoryTitle", formData.categoryTitle)}
                isInvalid={!!errors.categoryTitle}
              />
              <Form.Control.Feedback type="invalid">{errors.categoryTitle}</Form.Control.Feedback>
            </Col>

            {/* Category Code */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                Category Code <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="categoryCode"
                value={formData.categoryCode}
                onChange={handleChange}
                onBlur={() => validateField("categoryCode", formData.categoryCode)}
                isInvalid={!!errors.categoryCode}
              />
              <Form.Control.Feedback type="invalid">{errors.categoryCode}</Form.Control.Feedback>
            </Col>

            {/* Company Dropdown */}
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                Company <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                onBlur={() => validateField("companyId", formData.companyId)}
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
            </Col>

            {/* Optional Switch (if needed later) */}
            {/* <Col md={4}>
              <Form.Check
                type="switch"
                label="Is Deleted"
                name="isDeleted"
                checked={formData.isDeleted}
                onChange={handleChange}
              />
            </Col> */}
          </Row>

          {/* BUTTONS */}
          <div className="d-flex gap-2 justify-content-end mt-4">
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

export default CategoryEdit;
