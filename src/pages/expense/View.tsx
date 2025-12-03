import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import KiduLoader from "../../components/KiduLoader";
import KiduPrevious from "../../components/KiduPrevious";
import ExpenseMasterService from "../../services/Expense.services";
import ExpenseTypeService from "../../services/settings/ExpenseType.services";
import Attachments from "../../components/KiduAttachments";
import AuditTrailsComponent from "../../components/KiduAuditLogs";

const ViewExpense: React.FC = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ExpenseMasterService.getById(Number(expenseId));

        if (res.isSucess && res.value) {
          const expenseData = res.value;

          let expenseTypeName = "N/A";
          if (expenseData.expenseTypeId) {
            const typeRes = await ExpenseTypeService.getById(expenseData.expenseTypeId);
            if (typeRes.isSucess && typeRes.value)
              expenseTypeName = typeRes.value.expenseTypeName;
          }

          const transformed = {
            expenseMasterId: expenseData.expenseMasterId,
            expenseVoucher: expenseData.expenseVoucher || "",
            expenseType: expenseTypeName,
            createdOn: expenseData.createdOnString || "",
            amount: expenseData.amount || "0",
            paymentMode: expenseData.paymentMode || "",
            relatedEntityType: expenseData.relatedEntityType || "",
            relatedEntityId: expenseData.relatedEntityId || "",
            remark: expenseData.remark || "",
          };

          setData(transformed);
        } else {
          toast.error("Expense not found.");
        }
      } catch {
        toast.error("Failed to load expense details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseId]);

  if (loading) return <KiduLoader type="expense details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No expense details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  const fields = [
    { key: "expenseMasterId", label: "Expense ID" },
    { key: "expenseVoucher", label: "Expense Voucher" },
    { key: "createdOn", label: "Expense Date" },
    { key: "amount", label: "Amount (₹)" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "relatedEntityType", label: "Related Entity Type" },
    { key: "relatedEntityId", label: "Related Entity ID" },
    { key: "remark", label: "Remarks" },
  ];

  const handleEdit = () =>
    navigate(`/dashboard/edit-expense/${data.expenseMasterId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await ExpenseMasterService.delete(data.expenseMasterId);
      toast.success("Expense deleted successfully");
      setTimeout(() => navigate("/dashboard/expense-list"), 800);
    } catch {
      toast.error("Failed to delete expense.");
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
        style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>
              Expense Details
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

        {/* Title Section */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{data.expenseType}</h5>
          <p className="small mb-0 fw-bold text-danger" style={{ color: "#18575A" }}>
            ID:{data.expenseMasterId}
          </p>
        </div>

        {/* Details Table */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => (
                <tr key={key}>
                  <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>
                    {label}
                  </td>
                  <td>{String(data[key]) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Attachments tableName="expense" recordId={data.expenseMasterId} />
        <AuditTrailsComponent tableName="expenseMaster" recordId={data.expenseMasterId} />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this expense?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
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

export default ViewExpense;
