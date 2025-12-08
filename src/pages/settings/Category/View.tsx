import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CategoryService from "../../../services/settings/Category.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduAuditLogs from "../../../components/KiduAuditLogs";

const CategoryView: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        if (!categoryId) {
          toast.error("No category ID provided");
          navigate("/dashboard/settings/Category");
          return;
        }

        const response = await CategoryService.getCategoryById(categoryId);
        
        if (!response || !response.isSucess) {
          throw new Error(response?.customMessage || response?.error || "Failed to load category");
        }

        setData(response.value);
      } catch (error: any) {
        console.error("Failed to load category:", error);
        toast.error(`Error: ${error.message}`);
        navigate("/dashboard/settings/Category");
      } finally {
        setLoading(false);
      }
    };
    loadCategory();
  }, [categoryId, navigate]);

  if (loading) return <KiduLoader type="category details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No category details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Back</Button>
      </div>
    );

  const fields = [
    { key: "categoryId", label: "Category ID", icon: "bi-hash" },
    { key: "categoryName", label: "Category Name", icon: "bi-tag" },
    { key: "categoryDescription", label: "Description", icon: "bi-file-text" },
    { key: "categoryTitle", label: "Title", icon: "bi-card-heading" },
    { key: "categoryCode", label: "Code", icon: "bi-code-square" },
    { key: "companyName", label: "Company", icon: "bi-building" },
    { key: "isDeleted", label: "Is Deleted", icon: "bi-trash", isBoolean: true }
  ];

  const handleEdit = () => navigate(`/dashboard/settings/edit-Category/${data.categoryId}`);

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const response = await CategoryService.deleteCategoryById(String(data.categoryId ?? ""));
      
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      setTimeout(() => navigate("/dashboard/settings/Category"), 600);
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
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>Category Details</h5>
          </div>

          <div className="d-flex">
            <Button
              className="d-flex align-items-center gap-2 me-1"
              style={{ backgroundColor: "#882626ff", border: "none", fontWeight: 500 }}
              onClick={handleEdit}>
              <FaEdit /> Edit
            </Button>

            <Button variant="danger" className="d-flex align-items-center gap-2"
              style={{ fontWeight: 500 }}
              onClick={() => setShowConfirm(true)}>
              <FaTrash size={12} /> Delete
            </Button>
          </div>
        </div>

        {/* Category Info */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{data.categoryName || "Unknown"}</h5>
          <p className="small mb-0 fw-bold" style={{ color: "#882626ff" }}>
            ID: {data.categoryId}
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
              {fields.map(({ key, label, icon, isBoolean }, index) => {
                let value = (data as any)[key];
                
                if (isBoolean) {
                  value = value ? "Yes" : "No";
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
        <KiduAuditLogs tableName="Category" recordId={data.categoryId ?? ""} />

      </Card>

      {/* DELETE MODAL */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
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

export default CategoryView;