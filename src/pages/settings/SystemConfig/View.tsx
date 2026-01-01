import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import SystemConfigService from "../../../services/settings/SystemConfig.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduAuditLogs from "../../../components/KiduAuditLogs";
import type { systemconfig } from "../../../types/settings/SystemConfig";

const SystemConfigView: React.FC = () => {
  const navigate = useNavigate();
  const { appMasterSettingId } = useParams<{ appMasterSettingId: string }>();

  const [data, setData] = useState<systemconfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Fetch System Config by ID
  useEffect(() => {
    const loadConfig = async () => {
      try {
        if (!appMasterSettingId) {
          toast.error("No ID provided");
          navigate("/dashboard/settings/system-config-list");
          return;
        }

        const response = await SystemConfigService.getAppmasterSetting();
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || "Failed to load system configuration");
        }

        const config = response.value.find(
          (item: systemconfig) => String(item.appMasterSettingId) === appMasterSettingId
        );
        if (!config) throw new Error("System configuration not found");

        setData(config);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
        navigate("/dashboard/settings/system-config-list");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [appMasterSettingId, navigate]);

  if (loading) return <KiduLoader type="system configuration details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No system configuration details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );

  const fields = [
    { key: "appMasterSettingId", label: "ID", icon: "bi-hash" },
    { key: "intCurrentFinancialYear", label: "Financial Year", icon: "bi-calendar" },
    { key: "staff_To_User_Rate_Per_Second", label: "Staff to User coins / Second", icon: "bi-clock" },
    { key: "one_paisa_to_coin_rate", label: "1 Paisa to Coin Rate", icon: "bi-currency-exchange" },
    { key: "isActive", label: "Is Active", icon: "bi-check-circle", isBoolean: true },
  ];

  const handleEdit = () => navigate(`/dashboard/settings/edit-systemconfig/${data.appMasterSettingId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await SystemConfigService.delete(String(data.appMasterSettingId));
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || "Failed to delete system configuration");
      }
      toast.success("System configuration deleted successfully");
      setTimeout(() => navigate("/dashboard/settings/systemconfig-list"), 600);
    } catch (error: any) {
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
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>
              System Configuration Details
            </h5>
          </div>

          <div className="d-flex">
            <Button
              className="d-flex align-items-center gap-2 me-1"
              style={{ backgroundColor: "#882626ff", border: "none", fontWeight: 500 }}
              onClick={handleEdit}
            >
              <FaEdit /> Edit
            </Button>

            <Button
              variant="danger"
              className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500 }}
              onClick={() => setShowConfirm(true)}
            >
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* System Config Info */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">Configuration ID: {data.appMasterSettingId}</h5>
        </div>

        {/* DETAILS TABLE */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0" style={{ fontFamily: "Urbanist", fontSize: "13px" }}>
            <tbody>
              {fields.map(({ key, label, icon, isBoolean }, index) => {
                let value = (data as any)[key];
                if (isBoolean) value = value ? "Yes" : "No";

                return (
                  <tr
                    key={key}
                    style={{ lineHeight: "1.2", backgroundColor: index % 2 === 1 ? "#ffe8e8" : "" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe6e6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 1 ? "#ffe8e8" : "")}
                  >
                    <td style={{ width: "40%", padding: "8px 6px", color: "#882626ff", fontWeight: 600 }}>
                      <i className={`bi ${icon} me-2`}></i>
                      {label}
                    </td>
                    <td style={{ padding: "8px 6px" }}>{value !== null && value !== undefined && value !== "" ? value : "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* AUDIT LOGS */}
        {data.appMasterSettingId && <KiduAuditLogs tableName="AppMasterSetting" recordId={String(data.appMasterSettingId)} />}
      </Card>

      {/* DELETE MODAL */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this system configuration?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" /> Deleting...
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

export default SystemConfigView;
