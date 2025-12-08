import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CategoryService from "../../../services/settings/Category.services";
import KiduValidation from "../../../components/KiduValidation";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import KiduAuditLogs from "../../../components/KiduAuditLogs";
import { CompanyLookup } from "../../../types/settings/Company.types";
import { Category } from "../../../types/settings/Category.type";

const CategoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const fields = [
    { name: "categoryName", rules: { required: true, type: "text" as const, label: "Category Name" } },
    { name: "categoryDescription", rules: { required: true, type: "text" as const, label: "Category Description" } },
    { name: "categoryTitle", rules: { required: true, type: "text" as const, label: "Category Title" } },
    { name: "categoryCode", rules: { required: true, type: "text" as const, label: "Category Code" } },
    { name: "companyId", rules: { required: true, type: "number" as const, label: "Company" } }
  ];

  const initialValues: any = {};
  const initialErrors: any = {};
  fields.forEach(f => {
    initialValues[f.name] = "";
    initialErrors[f.name] = "";
  });

  const [formData, setFormData] = useState<Category>({
    ...initialValues,
    categoryId: 0,
    companyName: "",
    companyId: 0,
    isDeleted: false,
  });

  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Category | null>(null);
  const [companyList, setCompanyList] = useState<CompanyLookup[]>([]);

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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        if (!categoryId) { 
          toast.error("No category ID provided"); 
          navigate("/dashboard/settings/Category"); 
          return; 
        }
        
        const response = await CategoryService.getCategoryById(categoryId);
        
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load category");
        }

        const data = response.value;
        const formattedData: Category = {
          categoryId: data.categoryId || 0,
          categoryName: data.categoryName || "",
          categoryDescription: data.categoryDescription || "",
          categoryTitle: data.categoryTitle || "",
          categoryCode: data.categoryCode || "",
          companyId: data.companyId || 0,
          companyName: data.companyName || "",
          isDeleted: Boolean(data.isDeleted),
          auditLogs: data.auditLogs
        };

        setFormData(formattedData);
        setInitialData(formattedData);
      } catch (error: any) {
        console.error("Failed to load category:", error);
        toast.error(`Error loading category: ${error.message}`);
        navigate("/dashboard/settings/Category");
      } finally { 
        setLoading(false); 
      }
    };
    fetchCategory();
  }, [categoryId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    let updatedValue: any = value;
    
    if (type === "checkbox") {
      updatedValue = target.checked;
    } else if (type === "number" || name === "companyId") {
      updatedValue = value === "" ? "" : Number(value);
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: updatedValue }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
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
      const msg = overrideMessage(name);
      setErrors((prev: any) => ({ ...prev, [name]: msg }));
      return false;
    }
    setErrors((prev: any) => ({ ...prev, [name]: "" }));
    return true;
  };

  const validateForm = () => {
    let ok = true;
    fields.forEach(f => {
      if (!validateField(f.name, formData[f.name as keyof Category])) ok = false;
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (!categoryId) throw new Error("No category ID available");
      
      const dataToUpdate: Category = {
        categoryId: Number(formData.categoryId),
        categoryName: formData.categoryName || "",
        categoryDescription: formData.categoryDescription || "",
        categoryTitle: formData.categoryTitle || "",
        categoryCode: formData.categoryCode || "",
        companyId: Number(formData.companyId) || 0,
        companyName: formData.companyName || "",
        isDeleted: Boolean(formData.isDeleted),
      };

      const response = await CategoryService.updateCategory(categoryId, dataToUpdate);
      
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || "Failed to update category");
      }

      toast.success("Category updated successfully!");
      setTimeout(() => navigate("/dashboard/settings/Category"), 1500);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(`Error updating category: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <KiduLoader type="Category..." />;

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
        <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <KiduPrevious />
              <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>Edit Category</h5>
            </div>
          </div>

          <Card.Body style={{ padding: "1.5rem" }}>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col xs={12}>
                  <Row className="g-2">
                    <Col md={4}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("categoryName")}</Form.Label>
                      <Form.Control 
                        size="sm" 
                        type="text" 
                        name="categoryName" 
                        value={formData.categoryName}
                        onChange={handleChange} 
                        onBlur={() => validateField("categoryName", formData.categoryName)} 
                        placeholder="Enter Category Name"
                      />
                      {errors.categoryName && <div className="text-danger small">{errors.categoryName}</div>}
                    </Col>

                    <Col md={4}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("categoryDescription")}</Form.Label>
                      <Form.Control 
                        size="sm" 
                        type="text" 
                        name="categoryDescription" 
                        value={formData.categoryDescription}
                        onChange={handleChange} 
                        onBlur={() => validateField("categoryDescription", formData.categoryDescription)} 
                        placeholder="Enter Category Description"
                      />
                      {errors.categoryDescription && <div className="text-danger small">{errors.categoryDescription}</div>}
                    </Col>

                    <Col md={4}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("categoryTitle")}</Form.Label>
                      <Form.Control 
                        size="sm" 
                        type="text" 
                        name="categoryTitle" 
                        value={formData.categoryTitle}
                        onChange={handleChange} 
                        onBlur={() => validateField("categoryTitle", formData.categoryTitle)} 
                        placeholder="Enter Category Title"
                      />
                      {errors.categoryTitle && <div className="text-danger small">{errors.categoryTitle}</div>}
                    </Col>

                    <Col md={4}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("categoryCode")}</Form.Label>
                      <Form.Control 
                        size="sm" 
                        type="text" 
                        name="categoryCode" 
                        value={formData.categoryCode}
                        onChange={handleChange} 
                        onBlur={() => validateField("categoryCode", formData.categoryCode)} 
                        placeholder="Enter Category Code"
                      />
                      {errors.categoryCode && <div className="text-danger small">{errors.categoryCode}</div>}
                    </Col>

                    <Col md={4}>
                      <Form.Label className="mb-1 fw-medium small">{getLabel("companyId")}</Form.Label>
                      <Form.Select
                        size="sm"
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        onBlur={() => validateField("companyId", formData.companyId)}
                      >
                        <option value="">Select Company</option>
                        {companyList.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.text}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.companyId && <div className="text-danger small">{errors.companyId}</div>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mb-3 mx-1">
                <Col xs={12}>
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check 
                      type="switch" 
                      id="isDeleted" 
                      name="isDeleted" 
                      label="Is Deleted"
                      checked={formData.isDeleted === true} 
                      onChange={handleChange} 
                      className="fw-semibold" 
                    />
                  </div>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4 me-2">
                <KiduReset initialValues={initialData} setFormData={setFormData} setErrors={setErrors} />
                <Button type="submit" style={{ backgroundColor: "#882626ff", border: "none" }} disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </Form>

            {formData.categoryId && <KiduAuditLogs tableName="Category" recordId={formData.categoryId.toString()} />}
          </Card.Body>
        </Card>

        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default CategoryEdit;