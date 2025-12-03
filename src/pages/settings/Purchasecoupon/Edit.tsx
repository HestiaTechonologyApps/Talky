import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import KiduPrevious from "../../../components/KiduPrevious";
import PurchaseCouponService from "../../../services/PurchaseCoupon.Services";
import KiduReset from "../../../components/ReuseButtons/KiduReset";
import KiduLoader from "../../../components/KiduLoader";
import { KiduValidation } from "../../../components/KiduValidation";


const PurchaseCouponEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const fields = [
    { name: "coins", rules: { required: true, type: "number", label: "Coins" } },
    { name: "amount", rules: { required: true, type: "number", label: "Amount" } },
    { name: "description", rules: { required: false, type: "text", label: "Description" } }
  ];

  useEffect(() => {
    const loadCoupon = async () => {
      // Check if id exists before making API call
      if (!id) {
        toast.error("Invalid coupon ID");
        navigate("/purchase-coupon");
        setLoading(false);
        return;
      }

      try {
        const res = await PurchaseCouponService.getCouponsById(id);

        if (res) {
          const loadedValues = {
            coins: String(res.coins ?? ""),
            amount: String(res.amount ?? ""),
            description: res.description ?? ""
          };

          setFormData(loadedValues);
          setInitialValues(loadedValues);

          const errValues: any = {};
          fields.forEach(f => { errValues[f.name] = ""; });
          setErrors(errValues);
        } else {
          toast.error("Failed to load purchase coupon");
          navigate("/purchase-coupon");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load purchase coupon");
        navigate("/purchase-coupon");
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const updated = type === "number" ? value.replace(/[^0-9]/g, "") : value;
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
    fields.forEach(f => { 
      if (!validateField(f.name, formData[f.name])) ok = false; 
    });
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Validate id exists
    if (!id) {
      toast.error("Invalid coupon ID");
      return;
    }

    try {
      const payload = {
        purchaseCouponId: Number(id),
        coins: Number(formData.coins),
        amount: Number(formData.amount),
        pastAmount: 0,
        description: formData.description,
        isActive: true,
        createdAppUserId: 1,
        createdAt: new Date().toISOString(),
      };

      await PurchaseCouponService.editCouponById(id, payload);
      toast.success("Coupon updated successfully!");
      setTimeout(() => navigate("/purchase-coupon"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  if (loading) return <KiduLoader type="purchase coupon details..." />;

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded bg-white" style={{ fontFamily: "Urbanist" }}>
        <div className="d-flex align-items-center mb-3">
          <div className="me-2 mt-3"><KiduPrevious /></div>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>
            Edit Purchase Coupon
          </h4>
        </div>

        <hr />

        <Form onSubmit={handleSubmit} className="p-4">
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                {fields[0].rules.label}{" "}
                {fields[0].rules.required ? <span className="text-danger">*</span> : ""}
              </Form.Label>
              <Form.Control
                type="number"
                name={fields[0].name}
                placeholder="Enter coin value"
                value={formData[fields[0].name]}
                onChange={handleChange}
                onBlur={() => validateField(fields[0].name, formData[fields[0].name])}
              />
              {errors[fields[0].name] && (
                <small className="text-danger">{errors[fields[0].name]}</small>
              )}
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label className="fw-semibold">
                {fields[1].rules.label}{" "}
                {fields[1].rules.required ? <span className="text-danger">*</span> : ""}
              </Form.Label>
              <Form.Control
                type="number"
                name={fields[1].name}
                placeholder="Enter amount"
                value={formData[fields[1].name]}
                onChange={handleChange}
                onBlur={() => validateField(fields[1].name, formData[fields[1].name])}
              />
              {errors[fields[1].name] && (
                <small className="text-danger">{errors[fields[1].name]}</small>
              )}
            </Col>

            <Col md={12} className="mb-3">
              <Form.Label className="fw-semibold">
                {fields[2].rules.label}
                {fields[2].rules.required ? <span className="text-danger">*</span> : ""}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name={fields[2].name}
                placeholder="Enter description"
                value={formData[fields[2].name]}
                onChange={handleChange}
                onBlur={() => validateField(fields[2].name, formData[fields[2].name])}
              />
              {errors[fields[2].name] && (
                <small className="text-danger">{errors[fields[2].name]}</small>
              )}
            </Col>
          </Row>

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

export default PurchaseCouponEdit;