import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash, FaCheck, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'approve' | 'reject' | 'complete' | null>(null);

  useEffect(() => {
    const loadWithdrawal = async () => {
      try {
        console.log("URL Parameter - walletWithdrawalRequestId:", walletWithdrawalRequestId);

        if (!walletWithdrawalRequestId) {
          toast.error("No withdrawal request ID provided");
          navigate("/dashboard/wallet-withdrawal/list");
          return;
        }

        console.log("Fetching withdrawal data for ID:", walletWithdrawalRequestId);
        const response = await WalletWithdrawalService.getWithdrawalById(walletWithdrawalRequestId);
        
        console.log("API Response:", response);

        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load withdrawal request");
        }

        console.log("Withdrawal data received:", response.value);
        setData(response.value);
      } catch (error: any) {
        console.error("Failed to load withdrawal:", error);
        toast.error(`Error: ${error.message}`);
        setTimeout(() => {
          navigate("/dashboard/wallet-withdrawal/list");
        }, 2000);
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
        <p className="text-muted">Request ID: {walletWithdrawalRequestId}</p>
        <Button className="mt-3" onClick={() => navigate("/dashboard/wallet-withdrawal/list")}>
          Back to List
        </Button>
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
    const badgeStyle = {
      fontSize: "12px",
      minWidth: "100px",
      display: "inline-block",
      textAlign: "center" as const
    };

    switch (status) {
      case 0:
        return <Badge bg="warning" className="px-3 py-2" style={badgeStyle}>Pending</Badge>;
      case 1:
        return <Badge bg="success" className="px-3 py-2" style={badgeStyle}>Approved</Badge>;
      case 2:
        return <Badge bg="danger" className="px-3 py-2" style={badgeStyle}>Rejected</Badge>;
      case 3:
        return <Badge bg="info" className="px-3 py-2" style={badgeStyle}>Completed</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2" style={badgeStyle}>Unknown</Badge>;
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
    const actionMap: { [key: number]: 'approve' | 'reject' | 'complete' } = {
      1: 'approve',
      2: 'reject',
      3: 'complete'
    };
    const action = actionMap[newStatus];
    setLoadingAction(action);
    
    // Close all modals
    setShowConfirmApprove(false);
    setShowConfirmReject(false);
    setShowConfirmComplete(false);
    
    try {
      if (!walletWithdrawalRequestId) throw new Error("No request ID available");
      if (!data) throw new Error("No withdrawal data available");
      
      const dataToUpdate: WalletWithdrawal = {
        walletWithdrawalRequestId: data.walletWithdrawalRequestId,
        appUserId: data.appUserId,
        appUserName: data.appUserName,
        coins: data.coins,
        amount: data.amount,
        createdAt: data.createdAt,
        status: newStatus,
        isDeleted: data.isDeleted || false,
        companyId: data.companyId || 0
      };

      console.log("Updating withdrawal status:", dataToUpdate);
      const response = await WalletWithdrawalService.updateWithdrawalStatus(
        data.walletWithdrawalRequestId.toString(),
        dataToUpdate
      );
      
      console.log("Update response:", response);
      
      // Check if update was successful
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || `Failed to ${action} request`);
      }

      // Update local state immediately instead of refetching
      setData({
        ...data,
        status: newStatus
      });

      toast.success(`Withdrawal request ${action}d successfully!`);
      
      // Optional: Try to refresh data in background, but don't fail if it errors
      try {
        const updatedResponse = await WalletWithdrawalService.getWithdrawalById(
          data.walletWithdrawalRequestId.toString()
        );
        if (updatedResponse && updatedResponse.isSucess && updatedResponse.value) {
          setData(updatedResponse.value);
        }
      } catch (refreshError) {
        console.log("Background refresh failed, but update was successful:", refreshError);
        // Don't show error to user since the update was successful
      }
      
    } catch (error: any) {
      console.error(`${action} failed:`, error);
      
      // If update failed, try to reload the current state
      try {
        const currentResponse = await WalletWithdrawalService.getWithdrawalById(
          data.walletWithdrawalRequestId.toString()
        );
        if (currentResponse && currentResponse.isSucess && currentResponse.value) {
          setData(currentResponse.value);
          
          // Check if status was actually updated despite the error
          if (currentResponse.value.status === newStatus) {
            toast.success(`Withdrawal request ${action}d successfully!`);
            return; // Exit without showing error
          }
        }
      } catch (reloadError) {
        console.error("Failed to reload after error:", reloadError);
      }
      
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      if (!data) throw new Error("No withdrawal data available");
      
      console.log("Deleting withdrawal ID:", data.walletWithdrawalRequestId);
      const response = await WalletWithdrawalService.deleteWithdrawal(
        data.walletWithdrawalRequestId.toString()
      );
      
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
      setShowConfirmDelete(false);
    }
  };

  const renderActionButtons = () => {
    if (data.status === 0) {
      // Pending - show Approve and Reject buttons
      return (
        <>
          <Button
            className="d-flex align-items-center gap-2"
            style={{ backgroundColor: "#28a745", border: "none", fontWeight: 500 }}
            onClick={() => setShowConfirmApprove(true)}
            disabled={loadingAction !== null}>
            <FaCheck />
            Approve
          </Button>

          <Button
            className="d-flex align-items-center gap-2"
            style={{ backgroundColor: "#dc3545", border: "none", fontWeight: 500 }}
            onClick={() => setShowConfirmReject(true)}
            disabled={loadingAction !== null}>
            <FaTimes />
            Reject
          </Button>
        </>
      );
    } else if (data.status === 1) {
      // Approved - show Complete button
      return (
        <Button
          className="d-flex align-items-center gap-2"
          style={{ backgroundColor: "#17a2b8", border: "none", fontWeight: 500 }}
          onClick={() => setShowConfirmComplete(true)}
          disabled={loadingAction !== null}>
          <FaCheckCircle />
          Mark as Completed
        </Button>
      );
    }
    return null; // No action buttons for Rejected or Completed status
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
            {renderActionButtons()}

            <Button variant="danger" className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500 }}
              onClick={() => setShowConfirmDelete(true)}>
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* Request Info */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-2">Request ID: {data.walletWithdrawalRequestId || 'N/A'}</h5>
          <p className="mb-1">
            <strong>User:</strong> {data.appUserName || 'N/A'} (ID: {data.appUserId || 'N/A'})
          </p>
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
        {data.walletWithdrawalRequestId && (
          <KiduAuditLogs 
            tableName="WalletWithdrawalRequest" 
            recordId={data.walletWithdrawalRequestId.toString()} 
          />
        )}

      </Card>

      {/* APPROVE CONFIRMATION MODAL */}
      <Modal show={showConfirmApprove} onHide={() => setShowConfirmApprove(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #28a745" }}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaCheck style={{ color: "#28a745" }} />
            Confirm Approval
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaExclamationTriangle size={50} style={{ color: "#28a745", marginBottom: "15px" }} />
            <h6 className="mb-3">Are you sure you want to approve this withdrawal request?</h6>
            <div className="bg-light p-3 rounded">
              <p className="mb-1"><strong>User:</strong> {data.appUserName}</p>
              <p className="mb-1"><strong>Amount:</strong> ${data.amount}</p>
              <p className="mb-0"><strong>Coins:</strong> {data.coins}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmApprove(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: "#28a745", border: "none" }}
            onClick={() => handleStatusUpdate(1)} 
            disabled={loadingAction !== null}>
            {loadingAction === 'approve' ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Approving...
              </>
            ) : (
              <>
                <FaCheck className="me-2" />
                Approve
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* REJECT CONFIRMATION MODAL */}
      <Modal show={showConfirmReject} onHide={() => setShowConfirmReject(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #dc3545" }}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaTimes style={{ color: "#dc3545" }} />
            Confirm Rejection
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaExclamationTriangle size={50} style={{ color: "#dc3545", marginBottom: "15px" }} />
            <h6 className="mb-3">Are you sure you want to reject this withdrawal request?</h6>
            <div className="bg-light p-3 rounded">
              <p className="mb-1"><strong>User:</strong> {data.appUserName}</p>
              <p className="mb-1"><strong>Amount:</strong> ${data.amount}</p>
              <p className="mb-0"><strong>Coins:</strong> {data.coins}</p>
            </div>
            <p className="text-danger mt-3 mb-0"><small>This action cannot be undone.</small></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmReject(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={() => handleStatusUpdate(2)} 
            disabled={loadingAction !== null}>
            {loadingAction === 'reject' ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Rejecting...
              </>
            ) : (
              <>
                <FaTimes className="me-2" />
                Reject
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* COMPLETE CONFIRMATION MODAL */}
      <Modal show={showConfirmComplete} onHide={() => setShowConfirmComplete(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #17a2b8" }}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaCheckCircle style={{ color: "#17a2b8" }} />
            Confirm Completion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaExclamationTriangle size={50} style={{ color: "#17a2b8", marginBottom: "15px" }} />
            <h6 className="mb-3">Are you sure you want to mark this withdrawal request as completed?</h6>
            <div className="bg-light p-3 rounded">
              <p className="mb-1"><strong>User:</strong> {data.appUserName}</p>
              <p className="mb-1"><strong>Amount:</strong> ${data.amount}</p>
              <p className="mb-0"><strong>Coins:</strong> {data.coins}</p>
            </div>
            <p className="text-info mt-3 mb-0"><small>This will finalize the withdrawal process.</small></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmComplete(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: "#17a2b8", border: "none" }}
            onClick={() => handleStatusUpdate(3)} 
            disabled={loadingAction !== null}>
            {loadingAction === 'complete' ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Completing...
              </>
            ) : (
              <>
                <FaCheckCircle className="me-2" />
                Mark as Completed
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "2px solid #dc3545" }}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaTrash style={{ color: "#dc3545" }} />
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaExclamationTriangle size={50} style={{ color: "#dc3545", marginBottom: "15px" }} />
            <h6 className="mb-3">Are you sure you want to delete this withdrawal request?</h6>
            <div className="bg-light p-3 rounded">
              <p className="mb-1"><strong>Request ID:</strong> {data.walletWithdrawalRequestId}</p>
              <p className="mb-1"><strong>User:</strong> {data.appUserName}</p>
              <p className="mb-0"><strong>Amount:</strong> ${data.amount}</p>
            </div>
            <p className="text-danger mt-3 mb-0"><small><strong>Warning:</strong> This action cannot be undone!</small></p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default WalletWithdrawalView;