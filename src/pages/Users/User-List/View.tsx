import React, { useEffect, useState } from "react";
import { Card, Table, Image, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";

import AppUserService from "../../../services/AppUserServices";
import { User } from "../../../types/ApiTypes";
import defaultProfile from "../../../assets/Images/profile.jpeg";

const UserPageView: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // fixed route param
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const baseWebsiteUrl = "http://sreenathganga-001-site12.jtempurl.com/";

  // Fetch user data
 
  console.log("userId from route:", userId);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        console.error("No userId found in route");
        return;
      }
  
      try {
        const data = await AppUserService.getUserById((userId));
        if (data) setUser(data);
        else toast.error("User not found.");
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [userId]);
  
  
  console.log("userId from route:", userId);

  if (loading) return <KiduLoader type="user details..." />;

  if (!user)
    return (
      <div className="text-center mt-5">
        <h5>No user details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );

  // Fields to show in table
  const fields = [
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "registeredDate", label: "Joined Date" },
    { key: "interests", label: "Hobby" },
    { key: "prefferedlanguage", label: "Preferred Language" },
    { key: "isBlocked", label: "Is Blocked" },
    { key: "isAudultVerificationCompleted", label: "Is Adult Verified" },
    { key: "isStaff", label: "Is Staff" },
    { key: "isLockedOut", label: "Is Locked Out" },
    { key: "isKYCCompleted", label: "Is KYC Completed" },
    { key: "walletBalance", label: "Wallet Balance" },
  ];

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = String(date.getDate()).padStart(2, "0");
    const time = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${day}-${month}-${year}  ${time}`;
  };

  const handleEdit = () => navigate(`/dashboard/user/edit-user/${user.appUserId}`);
  

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      if (!user) throw new Error("User data not loaded.");
      const updatedUser = { ...user, isDeleted: true, status: "Inactive" };
      await AppUserService.editApp(updatedUser);
      toast.success("User deleted successfully");
      setTimeout(() => navigate("/user/user-list"), 800);
      setUser(updatedUser);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  // Image URL
  const imageUrl = user.profileImagePath
    ? `${baseWebsiteUrl}${user.profileImagePath.replace(/^\/+/, "")}`
    : defaultProfile;

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5" style={{ fontFamily: "Urbanist" }}>
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#18575A" }}>User Details</h5>
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

        {/* User Image */}
        <div className="text-center mb-4">
          <Image
            src={imageUrl}
            alt={user.name}
            roundedCircle
            width={100}
            height={100}
            className="mb-3"
            style={{ border: "3px solid #18575A", objectFit: "cover" }}
            onError={(e: any) => { e.target.src = defaultProfile; }}
          />
          <h5 className="fw-bold mb-1">{user.name}</h5>
          <p className="small mb-0 fw-bold text-danger">ID: {user.appUserId}</p>
        </div>

        {/* User Details Table */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => {
                let value: any = (user as any)[key];
                if (key === "registeredDate") value = formatDate(value);
                if (typeof value === "boolean") value = value ? "Yes" : "No";
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

        {/* Wallet Balance */}
        <div className="mt-3">
          
        </div>

      </Card>

      {/* Delete Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={loadingDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (<><Spinner animation="border" size="sm" className="me-2" />Deleting...</>) : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
};

export default UserPageView;
