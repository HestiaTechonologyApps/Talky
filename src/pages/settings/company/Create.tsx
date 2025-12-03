import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import CompanyService from "../../../services/settings/Company.services";
import KiduValidation from "../../../components/KiduValidation";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import KiduPrevious from "../../../components/KiduPrevious";

const CreateCompany: React.FC = () => {
    const navigate = useNavigate();

    // ---------------- INITIAL STATES -------------------
    const initialValues: any = {
        comapanyName: "",
        website: "",
        contactNumber: "",
        email: "",
        taxNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        invoicePrefix: "",
        companyLogo: ""
    };
    const initialErrors: any = {
        comapanyName: "",
        website: "",
        contactNumber: "",
        email: "",
        taxNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        invoicePrefix: "",
        companyLogo: ""
    };

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);
    const [isActive, setIsActive] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    // ---------------- HANDLE CHANGE --------------------
    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        const updated = type === "tel" || type === "number" ? value.replace(/[^0-9]/g, "") : value;
        setFormData((prev: any) => ({ ...prev, [name]: updated }));
        if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: "" }));
    };

    // ---------------- VALIDATE FIELD -------------------
    const validateField = (name: string, value: any) => {
        const rules: any = {
            comapanyName: { required: true, type: "text", label: "Company Name" },
            website: { required: true, type: "text", label: "Website" },
            contactNumber: { required: true, type: "number", label: "Contact Number", minLength: 10, maxLength: 10 },
            email: { required: true, type: "email", label: "Email" },
            taxNumber: { required: true, type: "text", label: "Tax Number" },
            addressLine1: { required: true, type: "text", label: "Address Line 1" },
            addressLine2: { required: false, type: "text", label: "Address Line 2" },
            city: { required: true, type: "text", label: "City" },
            state: { required: true, type: "text", label: "State" },
            country: { required: true, type: "text", label: "Country" },
            zipCode: { required: true, type: "number", label: "Zip Code" },
            invoicePrefix: { required: false, type: "text", label: "Invoice Prefix" },
            companyLogo: { required: false, type: "text", label: "Company Logo URL" }
        }[name];

        const result = KiduValidation.validate(value, rules);
        setErrors((prev: any) => ({ ...prev, [name]: result.isValid ? "" : result.message }));
        return result.isValid;
    };

    // ---------------- VALIDATE FULL FORM ----------------
    const validateForm = () => {
        let ok = true;
        Object.keys(formData).forEach(key => {
            if (!validateField(key, formData[key])) ok = false;
        });
        return ok;
    };

    // ---------------- HANDLE SUBMIT ---------------------
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const companyData = {
                ...formData,
                companyId: 0,
                isActive,
                isDeleted
            };
            const res = await CompanyService.addCompany(companyData);
            if (res.isSucess) {
                toast.success("Company created successfully!");
                setTimeout(() => navigate("/dashboard/settings/company-list"), 1500);
            } else {
                toast.error(res.customMessage || res.error || "Failed to create company");
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <>
            <Card className="mx-3 mt-5" style={{ backgroundColor: "#f0f0f0ff", fontSize: "0.85rem" }}>
                <Card.Header style={{ backgroundColor: "#18575A", color: "white", padding: "0.5rem" }}>
                    <div className="d-flex align-items-center">
                        <Button
                            size="sm"
                            variant="link"
                            className="me-2"
                            style={{ backgroundColor: "white", padding: "0.2rem 0.5rem", color: "#18575A" }}
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft />
                        </Button>
                        <h6 className="mb-0 p-2 fw-medium fs-5">Add New Company</h6>
                    </div>
                </Card.Header>

                <Card.Body style={{ padding: "1rem" }}>
                    <Form onSubmit={handleSubmit}>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="comapanyName"
                                    value={formData.comapanyName}
                                    placeholder="Enter Company Name"
                                    onChange={handleChange}
                                    onBlur={() => validateField("comapanyName", formData.comapanyName)}
                                />
                                {errors.comapanyName && <div className="text-danger small">{errors.comapanyName}</div>}
                            </Col>

                            <Col md={6}>
                                <Form.Label>Website <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    placeholder="Enter Website"
                                    onChange={handleChange}
                                    onBlur={() => validateField("website", formData.website)}
                                />
                                {errors.website && <div className="text-danger small">{errors.website}</div>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Contact Number <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    placeholder="Enter Contact Number"
                                    onChange={handleChange}
                                    onBlur={() => validateField("contactNumber", formData.contactNumber)}
                                />
                                {errors.contactNumber && <div className="text-danger small">{errors.contactNumber}</div>}
                            </Col>

                            <Col md={6}>
                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Enter Email"
                                    onChange={handleChange}
                                    onBlur={() => validateField("email", formData.email)}
                                />
                                {errors.email && <div className="text-danger small">{errors.email}</div>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Tax Number <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="taxNumber"
                                    value={formData.taxNumber}
                                    placeholder="Enter Tax Number"
                                    onChange={handleChange}
                                    onBlur={() => validateField("taxNumber", formData.taxNumber)}
                                />
                                {errors.taxNumber && <div className="text-danger small">{errors.taxNumber}</div>}
                            </Col>

                            <Col md={6}>
                                <Form.Label>Address Line 1 <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    placeholder="Enter Address Line 1"
                                    onChange={handleChange}
                                    onBlur={() => validateField("addressLine1", formData.addressLine1)}
                                />
                                {errors.addressLine1 && <div className="text-danger small">{errors.addressLine1}</div>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Address Line 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    placeholder="Enter Address Line 2"
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>City <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    placeholder="Enter City"
                                    onChange={handleChange}
                                    onBlur={() => validateField("city", formData.city)}
                                />
                                {errors.city && <div className="text-danger small">{errors.city}</div>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>State <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    placeholder="Enter State"
                                    onChange={handleChange}
                                    onBlur={() => validateField("state", formData.state)}
                                />
                                {errors.state && <div className="text-danger small">{errors.state}</div>}
                            </Col>

                            <Col md={6}>
                                <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    placeholder="Enter Country"
                                    onChange={handleChange}
                                    onBlur={() => validateField("country", formData.country)}
                                />
                                {errors.country && <div className="text-danger small">{errors.country}</div>}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Zip Code <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    placeholder="Enter Zip Code"
                                    onChange={handleChange}
                                    onBlur={() => validateField("zipCode", formData.zipCode)}
                                />
                                {errors.zipCode && <div className="text-danger small">{errors.zipCode}</div>}
                            </Col>

                            <Col md={6}>
                                <Form.Label>Invoice Prefix</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="invoicePrefix"
                                    value={formData.invoicePrefix}
                                    placeholder="Enter Invoice Prefix"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Company Logo URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="companyLogo"
                                    value={formData.companyLogo}
                                    placeholder="Enter Company Logo URL"
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        {/* Active / Deleted Switches */}
                        <Row className="mb-3">
                            <Col md={3}>
                                <Form.Check 
                                    type="switch" 
                                    label="Active" 
                                    checked={isActive} 
                                    onChange={e => setIsActive(e.target.checked)} 
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Check 
                                    type="switch" 
                                    label="Deleted" 
                                    checked={isDeleted} 
                                    onChange={e => setIsDeleted(e.target.checked)} 
                                />
                            </Col>
                        </Row>

                        <div className="d-flex gap-2 justify-content-end mt-4">
                            <KiduReset initialValues={initialValues} setFormData={setFormData} />
                            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Submit</Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
            <Toaster position="top-right" />
        </>
    );
};

export default CreateCompany;
