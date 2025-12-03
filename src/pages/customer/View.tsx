import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CustomerService from "../../services/Customer.services";
import Attachments from "../../components/KiduAttachments";
import AuditTrailsComponent from "../../components/KiduAuditLogs";
import KiduLoader from "../../components/KiduLoader";
import KiduPrevious from "../../components/KiduPrevious";

const ViewCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CustomerService.getById(Number(customerId));
        if (res.isSucess && res.value) setData(res.value);
        else toast.error("Customer not found.");
      } catch {
        toast.error("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [customerId]);

  if (loading) return <KiduLoader type="customer details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No customer details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  const fields = [
    { key: "customerName", label: "Name" },
    { key: "dob", label: "Registered Date" },
    { key: "nationality", label: "Nationality" },
    { key: "customerPhone", label: "Phone Number" },
    { key: "customerEmail", label: "Email" },
    { key: "customerAddress", label: "Address" }
  ];

  const formatDate = (dob: string) => {
    if (!dob) return "";
    return new Date(dob).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const handleEdit = () => navigate(`/dashboard/customer-edit/${data.customerId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await CustomerService.delete(data.customerId);
      toast.success("Customer deleted successfully");
      setTimeout(() => navigate("/dashboard/customer-list"), 800);
    } catch {
      toast.error("Failed to delete customer.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>Customer Details</h5>
          </div>

          <div className="d-flex">
            <Button className="d-flex align-items-center gap-2 me-1"
              style={{ fontWeight: 500, backgroundColor: "#18575A", fontSize: "15px", border: "none" }}
              onClick={handleEdit}>
              <FaEdit /> Edit
            </Button>

            <Button variant="danger" className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500, fontSize: "15px" }}
              onClick={() => setShowConfirm(true)}>
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{data.customerName}</h5>
          <p className="small mb-0 fw-bold text-danger" style={{ color: "#18575A" }}>ID : {data.customerId}</p>
        </div>

        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => {
                const value = key === "dob" ? formatDate(data[key]) : data[key];
                return (
                  <tr key={key}>
                    <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>{label}</td>
                    <td>{String(value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <Attachments tableName="customer" recordId={data.customerId} />
        <AuditTrailsComponent tableName="customer" recordId={data.customerId} />
      </Card>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (<><Spinner animation="border" size="sm" className="me-2" />Deleting...</>) : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default ViewCustomer;
