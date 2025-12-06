import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

import CategoryService from "../../../services/settings/Category.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";
import KiduAuditLogs from "../../../components/KiduAuditLogs";

const CategoryView: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await CategoryService.getCategoryById(String(categoryId));
        if (res) setCategory(res);
        else toast.error("Category not found.");
      } catch {
        toast.error("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);

  if (loading) return <KiduLoader type="Category details..." />;

  if (!category)
    return (
      <div className="text-center mt-5">
        <h5>No category details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  const fields = [
    { key: "categoryId", label: "Category ID" },
    { key: "categoryName", label: "Category Name" },
    { key: "categoryDescription", label: "Category Description" },
    { key: "categoryTitle", label: "Category Title" },
    { key: "categoryCode", label: "Category Code" },
    { key: "companyName", label: "Company" }
  ];

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const result = await CategoryService.deleteCategoryById(String(category.categoryId));
      console.log("Delete result:", result); // Check what's returned
  
      toast.success("Category deleted successfully");
      setTimeout(() => navigate("/dashboard/settings/Category"), 800);
    } catch (error: any) {
      console.error("Delete error details:", error);
      
      // Show more specific error message
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Failed to delete category.";
      
      toast.error(errorMessage);
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5"
      style={{ fontFamily: "Urbanist" }}>
      
      <Card 
        className="shadow-lg p-4 w-100"
        style={{ maxWidth: "1300px", borderRadius: "15px", border: "none" }}
      >

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <KiduPrevious />
            <h5 className="fw-bold m-0 ms-2" style={{ color: "#882626ff" }}>
              Category Details
            </h5>
          </div>

          <Button
            className="d-flex align-items-center gap-2"
            style={{ fontWeight: 500, backgroundColor: "#882626ff", border: "none", fontSize: "15px" }}
            onClick={() => setShowConfirm(true)}
          >
            <FaTrash /> Delete
          </Button>
        </div>

        {/* TITLE SECTION */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-1">{category.categoryName}</h5>
          <p className="small mb-0 fw-bold" style={{ color: "#882626ff" }}>
            ID: {category.categoryId}
          </p>
        </div>

        {/* TABLE SECTION */}
        <div className="table-responsive">
          <Table
            bordered
            hover
            responsive
            className="align-middle mb-0"
            style={{ fontFamily: "Urbanist", fontSize: "13px" }}
          >
            <tbody>
              {fields.map(({ key, label }, index) => (
                <tr
                  key={key}
                  style={{
                    backgroundColor: index % 2 === 1 ? "#ffe8e8" : "",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe6e6")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = index % 2 === 1 ? "#ffe8e8" : "")
                  }
                >
                  <td
                    style={{
                      width: "40%",
                      fontWeight: 600,
                      color: "#882626ff",
                      padding: "8px 6px",
                      verticalAlign: "middle"
                    }}
                  >
                    {label}
                  </td>

                  <td style={{ padding: "8px 6px", verticalAlign: "middle" }}>
                    {String(category[key] ?? "N/A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* AUDIT LOGS */}
        <div className="mt-4">
          {category.categoryId && (
            <KiduAuditLogs tableName="Category" recordId={category.categoryId} />
          )}
        </div>

      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>

          <Button variant="danger" onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Deleting...
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
