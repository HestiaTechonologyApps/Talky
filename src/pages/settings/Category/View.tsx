import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import CategoryService from "../../../services/settings/Category.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduPrevious from "../../../components/KiduPrevious";



const CategoryView: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CategoryService.getCategoryById(String(categoryId));
        setData(res);
      } catch {
        toast.error("Failed to load category details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  if (loading) return <KiduLoader type="Category details..." />;

  if (!data)
    return (
      <div className="text-center mt-5">
        <h5>No category details found.</h5>
        <Button className="mt-3" onClick={() => navigate(-1)}>
          Go Back
        </Button>
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

  // DELETE ACTION
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await CategoryService.deleteCategoryById(String(data.categoryId), data);

      toast.success("Category deleted successfully");
      setTimeout(() => navigate("/dashboard/settings/Category"), 800);

    } catch {
      toast.error("Failed to delete category.");
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
              Category Details
            </h5>
          </div>

          <div className="d-flex">
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
          <h5 className="fw-bold mb-1">Name: {data.categoryName}</h5>
          <p className="small mb-0 fw-bold text-danger">
          Category {data.categoryId} 
          </p>
        </div>

        {/* Table Section */}
        <div className="table-responsive">
          <Table bordered hover responsive className="align-middle mb-0">
            <tbody>
              {fields.map(({ key, label }) => (
                <tr key={key}>
                  <td style={{ width: "40%", fontWeight: 600, color: "#18575A" }}>
                    {label}
                  </td>
                  <td>{String(data[key] ?? "N/A")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this category?
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

export default CategoryView;
