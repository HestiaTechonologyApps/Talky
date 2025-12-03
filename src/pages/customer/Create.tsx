import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomerService from "../../services/Customer.services";
import { KiduValidation } from "../../components/KiduValidation";
import KiduPrevious from "../../components/KiduPrevious";
import KiduReset from "../../components/ReuseButtons/KiduReset";

const CreateCustomer: React.FC = () => {
    const navigate = useNavigate();

    const fields = [
        { name: "customerName", rules: { required: true, type: "text", label: "Customer Name" } },
        { name: "dob", rules: { required: true, type: "date", label: "Registered Date" } },
        { name: "customerPhone", rules: { required: true, type: "number", minLength: 10, maxLength: 10, label: "Phone Number" } },
        { name: "nationalilty", rules: { required: true, type: "text", label: "Nationality" } },
        { name: "customerEmail", rules: { required: true, type: "email", label: "Email ID" } },
        { name: "customerAddress", rules: { required: true, type: "text", label: "Address" } }
    ];

    const initialValues: any = {};
    const initialErrors: any = {};
    fields.forEach(f => { initialValues[f.name] = ""; initialErrors[f.name] = ""; });

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState(initialErrors);

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
            const customerData = {
                ...formData,
                customerId: 0,
                dobString: formData.dob,
                gender: "",
                createdAt: new Date().toISOString(),
                isActive: true
            };

            const response = await CustomerService.create(customerData);
            if (response.isSucess) {
                toast.success("Customer added successfully!");
                setTimeout(() => navigate("/dashboard/customer-list"), 2000);
            } else {
                toast.error(response.customMessage || response.error);
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Container className="px-4 mt-5 shadow-sm rounded" style={{ backgroundColor: "white", fontFamily: "Urbanist" }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="me-2 mt-3"><KiduPrevious /></div>
                    <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Add New Customer</h4>
                </div>

                <hr />

                <Form onSubmit={handleSubmit} className="p-4">
                    <Row>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[0].rules.label} {fields[0].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control type="text" name="customerName" placeholder="Enter customer name" value={formData.customerName} onChange={handleChange} onBlur={() => validateField("customerName", formData.customerName)} />
                            {errors.customerName && <span className="text-danger">{errors.customerName}</span>}
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[1].rules.label} {fields[1].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} onBlur={() => validateField("dob", formData.dob)} />
                            {errors.dob && <small className="text-danger">{errors.dob}</small>}
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[2].rules.label} {fields[2].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control type="tel" name="customerPhone" placeholder="Enter phone number" value={formData.customerPhone} onChange={handleChange} onBlur={() => validateField("customerPhone", formData.customerPhone)} />
                            {errors.customerPhone && <small className="text-danger">{errors.customerPhone}</small>}
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[3].rules.label} {fields[3].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control type="text" name="nationalilty" placeholder="Enter nationalilty" value={formData.nationalilty} onChange={handleChange} onBlur={() => validateField("nationalilty", formData.nationalilty)} />
                            {errors.nationalilty && <small className="text-danger">{errors.nationalilty}</small>}
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[4].rules.label} {fields[4].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control type="email" name="customerEmail" placeholder="Enter email" value={formData.customerEmail} onChange={handleChange} onBlur={() => validateField("customerEmail", formData.customerEmail)} />
                            {errors.customerEmail && <small className="text-danger">{errors.customerEmail}</small>}
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-semibold">
                                {fields[5].rules.label} {fields[5].rules.required && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control as="textarea" rows={3} name="customerAddress" placeholder="Enter address" value={formData.customerAddress} onChange={handleChange} onBlur={() => validateField("customerAddress", formData.customerAddress)} />
                            {errors.customerAddress && <small className="text-danger">{errors.customerAddress}</small>}
                        </Col>

                    </Row>

                    <Row className="mb-3">
                        <Col><div className="alert alert-info"><strong>Note:</strong> You can add attachments after creating the customer.</div></Col>
                    </Row>

                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <KiduReset initialValues={initialValues} setFormData={setFormData} />
                        <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Submit</Button>
                    </div>
                </Form>
            </Container>

            <Toaster position="top-right" />
        </>
    );
};

export default CreateCustomer;  