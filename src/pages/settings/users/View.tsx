import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../../services/settings/User.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import AuditTrailsComponent from "../../../components/KiduAuditLogs";
import Attachments from "../../../components/KiduAttachments";

const ViewUser: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await UserService.getById(Number(userId));
                if (res.isSucess && res.value) setData(res.value);
                else toast.error("User not found.");
            } catch {
                toast.error("Failed to load user details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <KiduLoader type="user details..." />;

    if (!data)
        return (
            <div className="text-center mt-5">
                <h5>No user details found.</h5>
                <Button className="mt-3" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        );

    const fields = [
        { key: "userName", label: "Name" },
        { key: "userEmail", label: "Email" },
        { key: "companyName", label: "Company" },
        { key: "phoneNumber", label: "Phone Number" },
        { key: "address", label: "Address" },
    ];

    const handleEdit = () =>
        navigate(`/dashboard/settings/edit-user/${data.userId}`);

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            await UserService.delete(data.userId);
            toast.success("User deleted successfully");
            setTimeout(
                () => navigate("/dashboard/settings/user-list"),
                800
            );
        } catch {
            toast.error("Failed to delete user.");
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
                style={{
                    maxWidth: "1300px",
                    borderRadius: "15px",
                    border: "none",
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <KiduPrevious />
                        <h5
                            className="fw-bold m-0 ms-2"
                            style={{ color: "#18575A" }}
                        >
                            User Details
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

                {/* User Title */}
                <div className="text-center mb-4">
                    <h5 className="fw-bold mb-1">{data.userName}</h5>
                    <p
                        className="small mb-0 fw-bold text-danger"
                        style={{ color: "#18575A" }}
                    >
                        ID : {data.userId}
                    </p>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <Table bordered hover responsive className="align-middle mb-0">
                        <tbody>
                            {fields.map(({ key, label }) => (
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
                                    <td>{String(data[key] || "-")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                 <Attachments tableName="USER" recordId={data.userId} />

                {/*Audit Logs */}
                <AuditTrailsComponent tableName="User" recordId={data.userId} />
            </Card>

            {/* Delete Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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

export default ViewUser;
