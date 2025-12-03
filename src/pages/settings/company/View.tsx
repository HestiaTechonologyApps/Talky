import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CompanyService from "../../../services/settings/Company.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import Attachments from "../../../components/KiduAttachments";

const ViewCompany: React.FC = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CompanyService.getCompanyById(String(companyId));

        if (res) {
          setCompanyDetails(res);
        } else {
          toast.error("Company not found.");
        }
      } catch (error) {
        toast.error("Failed to load company details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  if (loading) return <KiduLoader type="company details..." />;

  if (!companyDetails)
    return (
      <div className="text-center mt-5">
        <h5>No company details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  const handleEdit = () => {
    navigate(`/dashboard/settings/edit-company/${companyDetails.companyId}`);
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await CompanyService.deleteCompanyById(String(companyDetails.companyId), companyDetails);

      toast.success("Company deleted successfully");

      setTimeout(() => navigate("/dashboard/settings/company-list"), 1000);
    } catch (error) {
      toast.error("Failed to delete company.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>
              Company Details
            </h5>
          </div>

          <div className="d-flex">
            <Button
              className="d-flex align-items-center gap-2 me-1"
              style={{ fontWeight: 500, backgroundColor: "#18575A", fontSize: "15px", border: "none" }}
              onClick={handleEdit}
            >
              <FaEdit /> Edit
            </Button>

            <Button
              variant="danger"
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500, fontSize: "15px" }}
              onClick={() => setShowConfirm(true)}
            >
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{companyDetails.comapanyName}</h5>
          <p className="small mb-0 fw-bold text-danger">ID : {companyDetails.companyId}</p>
        </div>

        {/* DETAILS */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {Object.entries(companyDetails).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>
                    {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </td>
                  <td>{String(value ?? "-")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Attachments tableName="COMPANY" recordId={Number(companyId)} />
      </Card>

      {/* DELETE CONFIRMATION */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you sure you want to delete this company?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default ViewCompany;
