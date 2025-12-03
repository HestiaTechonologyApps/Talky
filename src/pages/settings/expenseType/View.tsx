import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import ExpenseTypeService from "../../../services/settings/ExpenseType.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import AuditTrailsComponent from "../../../components/KiduAuditLogs";

const ViewExpenseType: React.FC = () => {
  const navigate = useNavigate();
  const { expenseTypeId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ExpenseTypeService.getById(Number(expenseTypeId));
        if (res.isSucess && res.value) {
          setData(res.value);
        } else {
          toast.error(res.customMessage || "Expense Type not found.");
        }
      } catch {
        toast.error("Failed to load expense type details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [expenseTypeId]);

  if (loading) return <KiduLoader type="expense type details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No expense type details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  const fields = [
    { key: "expenseTypeName", label: "Expense Type Name" },
    { key: "expenseTypeCode", label: "Expense Type Code" },
    { key: "description", label: "Description" },
    { key: "creditDebitType", label: "Credit Debit Type" }
  ];

  const handleEdit = () =>
    navigate(`/dashboard/settings/edit-expenses-type/${data.expenseTypeId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await ExpenseTypeService.delete(data.expenseTypeId);
      toast.success("Expense Type deleted successfully");
      setTimeout(() => navigate("/dashboard/settings/expense-type-list"), 800);
    } catch {
      toast.error("Failed to delete expense type.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center mt-5"
      style={{ fontFamily: "Urbanist" }}
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{ maxWidth: "1280px", borderRadius: "15px", border: "none" }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>
              Expense Type Details
            </h5>
          </div>

          <div className="d-flex">
            <Button
              className="d-flex align-items-center gap-2 me-1"
              style={{
                fontWeight: 500,
                backgroundColor: "#18575A",
                fontSize: "15px",
                border: "none",
              }}
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

        {/* Name + ID */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{data.expenseTypeName}</h5>
          <p className="small mb-0 fw-bold text-danger" style={{ color: "#18575A" }}>
            ID : {data.expenseTypeId}
          </p>
        </div>

        {/* Details Table */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => {
                const value = data[key] || "-";
                return (
                  <tr key={key}>
                    <td
                      style={{
                        width: "40%",
                        fontWeight: 600,
                        color: "#18575A",
                      }}
                    >
                      {label}
                    </td>
                    <td>{String(value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Audit Logs */}
        <AuditTrailsComponent
          tableName="expenseType"
          recordId={data.expenseTypeId}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this expense type?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={loadingDelete}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
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

export default ViewExpenseType;
