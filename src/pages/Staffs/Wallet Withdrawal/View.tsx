import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduAuditLogs from "../../../components/KiduAuditLogs";
import { WalletWithdrawal } from "../../../types/Staff/WalletWithdrawal.type";
import WalletWithdrawalService from "../../../services/Staff/WithdrawalWithdrawal.services";

const WalletWithdrawalView: React.FC = () => {
  const navigate = useNavigate();
  const { walletWithdrawalRequestId } = useParams();

  const [data, setData] = useState<WalletWithdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const loadWithdrawal = async () => {
      try {
        if (!walletWithdrawalRequestId) {
          toast.error("No withdrawal request ID provided");
          navigate("/dashboard/wallet-withdrawal/list");
          return;
        }

        const response = await WalletWithdrawalService.getWithdrawalById(walletWithdrawalRequestId);
        
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load withdrawal request");
        }

        setData(response.value);
      } catch (error: any) {
        console.error("Failed to load withdrawal:", error);
        toast.error(`Error: ${error.message}`);
        navigate("/dashboard/wallet-withdrawal/list");
      } finally {
        setLoading(false);
      }
    };
    loadWithdrawal();
  }, [walletWithdrawalRequestId, navigate]);

  if (loading) return <KiduLoader type="withdrawal request details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No withdrawal request details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Back</Button>
      </div>
    );

  const fields = [
    { key: "walletWithdrawalRequestId", label: "Request ID", icon: "bi-hash" },
    { key: "appUserId", label: "User ID", icon: "bi-person-badge" },
    { key: "appUserName", label: "User Name", icon: "bi-person" },
    { key: "coins", label: "Coins", icon: "bi-coin" },
    { key: "amount", label: "Amount", icon: "bi-currency-dollar" },
    { key: "status", label: "Status", icon: "bi-flag", isStatus: true },
    { key: "companyId", label: "Company ID", icon: "bi-building" },
    { key: "createdAt", label: "Created At", icon: "bi-calendar-check", isDate: true },
  ];

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge bg="warning" className="px-3 py-2">Pending</Badge>;
      case 1:
        return <Badge bg="success" className="px-3 py-2">Approved</Badge>;
      case 2:
        return <Badge bg="danger" className="px-3 py-2">Rejected</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2">Unknown</Badge>;
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      const time = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      return `${day}-${month}-${year} ${time}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleStatusUpdate = async (newStatus: number) => {
    const action = newStatus === 1 ? 'approve' : 'reject';
    setLoadingAction(action);
    
    try {
      if (!walletWithdrawalRequestId) throw new Error("No request ID available");
      
      // Prepare data to update - ensure all required fields are included
      const dataToUpdate: WalletWithdrawal = {
        walletWithdrawalRequestId: data.walletWithdrawalRequestId,
        appUserId: data.appUserId,
        appUserName: data.appUserName,
        coins: data.coins,
        amount: data.amount,
        createdAt: data.createdAt,
        status: newStatus, // Update status
        isDeleted: data.isDeleted || false,
        companyId: data.companyId || 0
      };

      const response = await WalletWithdrawalService.updateWithdrawalStatus(walletWithdrawalRequestId, dataToUpdate);
      
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || `Failed to ${action} request`);
      }

      toast.success(`Withdrawal request ${action}d successfully!`);
      
      // Reload data
      const updatedResponse = await WalletWithdrawalService.getWithdrawalById(walletWithdrawalRequestId);
      if (updatedResponse && updatedResponse.isSucess) {
        setData(updatedResponse.value);
      }
    } catch (error: any) {
      console.error(`${action} failed:`, error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      if (!walletWithdrawalRequestId) throw new Error("No request ID available");
      
      const response = await WalletWithdrawalService.deleteWithdrawal(walletWithdrawalRequestId);
      
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || "Failed to delete withdrawal request");
      }

      toast.success("Withdrawal request deleted successfully");
      setTimeout(() => navigate("/dashboard/wallet-withdrawal/list"), 600);
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>Withdrawal Request Details</h5>
          </div>

          <div className="d-flex gap-2">
            {data.status === 0 && (
              <>
                <Button
                  className="d-flex align-items-center gap-2"
                  style={{ backgroundColor: "#28a745", border: "none", fontWeight: 500 }}
                  onClick={() => handleStatusUpdate(1)}
                  disabled={loadingAction !== null}>
                  {loadingAction === 'approve' ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaCheck />
                  )}
                  Approve
                </Button>

                <Button
                  className="d-flex align-items-center gap-2"
                  style={{ backgroundColor: "#dc3545", border: "none", fontWeight: 500 }}
                  onClick={() => handleStatusUpdate(2)}
                  disabled={loadingAction !== null}>
                  {loadingAction === 'reject' ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaTimes />
                  )}
                  Reject
                </Button>
              </>
            )}

            <Button variant="danger" className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500 }}
              onClick={() => setShowConfirm(true)}>
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* Request Info */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-2">Request ID: {data.walletWithdrawalRequestId}</h5>
          <p className="mb-1">
            <strong>User:</strong> {data.appUserName} (ID: {data.appUserId})
          </p>
          {getStatusBadge(data.status)}
        </div>

        {/* DETAILS TABLE */}
        <div className="table-responsive">
          <Table
            bordered
            hover
            responsive
            className="align-middle mb-0"
            style={{ fontFamily: "Urbanist", fontSize: "13px" }}
          >
            <tbody>
              {fields.map(({ key, label, icon, isStatus, isDate }, index) => {
                let value = (data as any)[key];
                
                if (isStatus) {
                  value = getStatusBadge(value);
                } else if (isDate) {
                  value = formatDate(value);
                }

                return (
                  <tr
                    key={key}
                    style={{
                      lineHeight: "1.2",
                      backgroundColor: index % 2 === 1 ? "#ffe8e8" : ""
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffe6e6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 1 ? "#ffe8e8" : "";
                    }}
                  >
                    <td
                      style={{
                        width: "40%",
                        padding: "8px 6px",
                        color: "#882626ff",
                        fontWeight: 600
                      }}
                    >
                      <i className={`bi ${icon} me-2`}></i>
                      {label}
                    </td>
                    <td style={{ padding: "8px 6px" }}>
                      {value !== null && value !== undefined && value !== "" ? value : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* AUDIT LOGS */}
        <KiduAuditLogs tableName="WalletWithdrawalRequest" recordId={data.walletWithdrawalRequestId?.toString() ?? ""} />

      </Card>

      {/* DELETE MODAL */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this withdrawal request?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" /> Deleting...
              </>
            ) : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default WalletWithdrawalView;