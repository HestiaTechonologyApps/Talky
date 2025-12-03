import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import VehicleMaintenanceService from "../../../services/vehicle/Maintenance.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import Attachments from "../../../components/KiduAttachments";
import AuditTrailsComponent from "../../../components/KiduAuditLogs";
import KiduPaymentAccordion from "../../../components/KiduPaymentAccordion";

const ViewMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const { maintenanceId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

    const recordId = Number(maintenanceId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await VehicleMaintenanceService.getById(Number(maintenanceId));
        if (res.isSucess && res.value) setData(res.value);
        else toast.error("Record not found.");
      } catch {
        toast.error("Failed to load vehicle maintenance details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [maintenanceId]);

  if (loading) return <KiduLoader type="maintenance details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No maintenance details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  // FIELDS EXACT LIKE CUSTOMER VIEW STYLE
  const fields = [
    { key: "vehicleName", label: "Vehicle" },
    { key: "maintenanceType", label: "Maintenance Type" },
    { key: "maintenanceDateString", label: "Maintenance Date" },
    { key: "workshopName", label: "Workshop" },
    { key: "odometerReading", label: "Odometer Reading" },
    { key: "cost", label: "Cost" },
    { key: "performedBy", label: "Performed By" },
    { key: "description", label: "Description" },
    { key: "remarks", label: "Remarks" }
  ];

  const formatDate = (d: string) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleEdit = () =>
    navigate(`/dashboard/vehicles/edit-maintenance/${data.vehicleMaintenanceRecordId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await VehicleMaintenanceService.delete(data.vehicleMaintenanceRecordId);
      toast.success("Record deleted successfully");
      setTimeout(() => navigate("/dashboard/vehicle/maintenance-list"), 900);
    } catch {
      toast.error("Failed to delete record.");
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
              Maintenance Details
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
          <h5 className="fw-bold mb-1">{data.maintenanceType}</h5>
          <p className="small mb-0 fw-bold text-danger" style={{ color: "#18575A" }}>
            ID : {data.vehicleMaintenanceRecordId}
          </p>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => {
                const rawValue = data[key];
                const value =
                  key === "maintenanceDate" ? formatDate(rawValue) : rawValue || "-";

                return (
                  <tr key={key}>
                    <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>
                      {label}
                    </td>
                    <td>{String(value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Attachments & Audit Logs */}
         <KiduPaymentAccordion
                relatedEntityId={recordId}
                relatedEntityType="vehicleMaintenance"
                heading="Payment Details"
              />
        <Attachments
          tableName="VehicleMaintenanceRecord"
          recordId={data.vehicleMaintenanceRecordId}
        />
        <AuditTrailsComponent
          tableName="VehicleMaintenanceRecord"
          recordId={data.vehicleMaintenanceRecordId}
        />
      </Card>

      {/* Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this vehicle maintenance record?
        </Modal.Body>

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

export default ViewMaintenance;
