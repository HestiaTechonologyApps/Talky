import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import type { Driver } from "../../types/Driver.types";
import DriverService from "../../services/Driver.services";
import { KiduValidation } from "../../components/KiduValidation";
import defaultProfile from "../../assets/Images/profile.jpeg";

const DriverCreate: React.FC = () => {
  const navigate = useNavigate();

  const fields = [
    { name: "driverName", label: "Driver Name", rules: { required: true, type: "text" } },
    { name: "dob", label: "Date of Birth", rules: { required: true, type: "date" } },
    { name: "contactNumber", label: "Phone Number", rules: { required: true, type: "number", minLength: 10, maxLength: 10 } },
    { name: "nationality", label: "Nationality", rules: { required: true, type: "text" } },
    { name: "license", label: "License Number", rules: { required: true, type: "text", minLength: 5 } },
    { name: "nationalId", label: "IQAMA Number", rules: { required: true, type: "text", minLength: 5 } }
  ];

  const initialValues: any = { photo: null };
  const initialErrors: any = {};
  fields.forEach(f => { initialValues[f.name] = ""; initialErrors[f.name] = ""; });

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev: any) => ({ ...prev, photo: file }));

      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      return;
    }

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
    // AGE VALIDATION (Driver must be 18+)
  if (formData.dob) {
    const dob = new Date(formData.dob);
    const today = new Date();
    
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    const isUnder18 = age < 18 || (age === 18 && m < 0);

    if (isUnder18) {
      toast.error("Driver must be at least 18 years old");
      return;
    }
  }
    if (!validateForm()) return;

    try {
      const driverData: Driver = {
        driverId: 0,
        driverName: formData.driverName,
        license: formData.license,
        nationality: formData.nationality,
        contactNumber: formData.contactNumber,
        dob: formData.dob,
        dobString: formData.dob,
        nationalId: formData.nationalId,
        isRented: false,
        isActive: true,
        auditLogs: [],
        profileImagePath: "",
      };

      const response = await DriverService.create(driverData);

      if (!response.isSucess) {
        toast.error(response.customMessage || "Failed to add driver");
        return;
      }

      const newDriverId = response.value?.driverId;
      toast.success("Driver added successfully!");

      if (formData.photo && newDriverId) {
        await DriverService.uploadProfilePic(newDriverId, formData.photo);
      }

      setTimeout(() => navigate("/dashboard/driver-list"), 2000);

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReset = () => {
    setFormData(initialValues);
    setErrors(initialErrors);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  return (
    <>
      <Container className="px-4 mt-5 shadow-sm rounded" style={{ backgroundColor: "white", fontFamily: "Urbanist" }}>
        <div className="d-flex align-items-center mb-3">
          <Button size="sm" variant="link" className="me-2 mt-3 text-white"
            style={{ backgroundColor: "#18575A", padding: "0.2rem 0.5rem" }}
            onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </Button>
          <h4 className="fw-bold mb-0 mt-3" style={{ color: "#18575A" }}>Add New Driver</h4>
        </div>

        <hr />

        <Form onSubmit={handleSubmit} className="p-4">
          <Row>

            {/* LEFT IMAGE UPLOAD SECTION */}
            <Col xs={12} md={4} className="d-flex flex-column align-items-center mb-4">
              <div style={{ position: "relative", width: "160px", height: "160px" }}>
                <Image src={imagePreview || defaultProfile}
                  roundedCircle width={160} height={160}
                  style={{ objectFit: "cover", border: "1px solid #ccc" }} />

                <OverlayTrigger placement="bottom" overlay={<Tooltip>Upload Photo</Tooltip>}>
                  <label htmlFor="photoUpload"
                    style={{ position: "absolute", bottom: "5px", right: "5px", background: "#18575A", borderRadius: "50%", padding: "8px 11px", cursor: "pointer" }}>
                    <FaPen style={{ color: "#fff", fontSize: "14px" }} />
                  </label>
                </OverlayTrigger>

                <Form.Control type="file" id="photoUpload" name="photo"
                  onChange={handleChange} accept="image/*"
                  style={{ display: "none" }} />
              </div>
            </Col>

            {/* RIGHT FORM FIELDS */}
            <Col xs={12} md={8}>
              <Row>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[0].label} {fields[0].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="text" name="driverName"
                    placeholder="Enter driver name"
                    value={formData.driverName}
                    onChange={handleChange}
                    onBlur={() => validateField("driverName", formData.driverName)}
                  />
                  {errors.driverName && <small className="text-danger">{errors.driverName}</small>}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[1].label} {fields[1].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="date" name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    onBlur={() => validateField("dob", formData.dob)}
                  />
                  {errors.dob && <small className="text-danger">{errors.dob}</small>}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[2].label} {fields[2].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="tel" name="contactNumber"
                    placeholder="Enter phone number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    onBlur={() => validateField("contactNumber", formData.contactNumber)}
                  />
                  {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[3].label} {fields[3].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="text" name="nationality"
                    placeholder="Enter nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    onBlur={() => validateField("nationality", formData.nationality)}
                  />
                  {errors.nationality && <small className="text-danger">{errors.nationality}</small>}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[4].label} {fields[4].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="text" name="license"
                    placeholder="Enter license number"
                    value={formData.license}
                    onChange={handleChange}
                    onBlur={() => validateField("license", formData.license)}
                  />
                  {errors.license && <small className="text-danger">{errors.license}</small>}
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">
                    {fields[5].label} {fields[5].rules.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control type="text" name="nationalId"
                    placeholder="Enter iqama number"
                    value={formData.nationalId}
                    onChange={handleChange}
                    onBlur={() => validateField("nationalId", formData.nationalId)}
                  />
                  {errors.nationalId && <small className="text-danger">{errors.nationalId}</small>}
                </Col>

              </Row>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <div className="alert alert-info">
                <strong>Note:</strong> You can upload attachments later after creating this driver.
              </div>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button type="button" variant="outline-secondary" onClick={handleReset}>Reset</Button>
            <Button type="submit" style={{ backgroundColor: "#18575A", border: "none" }}>Submit</Button>
          </div>

        </Form>
      </Container>

      <Toaster position="top-right" />
    </>
  );
};

export default DriverCreate;