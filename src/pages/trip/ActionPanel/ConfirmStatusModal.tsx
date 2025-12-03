import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

interface ConfirmCancelPopupProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: (remarks: string) => void;
  confirmType: string;
}

const ConfirmCancelPopup: React.FC<ConfirmCancelPopupProps> = ({
  show,
  handleClose,
  handleConfirm,
  confirmType,
}) => {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (remarks.trim()) {
      handleConfirm(remarks);
      setRemarks("");
    }
    else {
      toast.error("Please enter remarks before confirming.");
    }
  };

  return (
   <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#18575A", color: "white" }}>
          <Modal.Title>
            {confirmType === "Trip Cancel" ? "Cancel Trip" : "Complete Trip"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Enter remarks for {confirmType === "Trip Cancel" ? "cancellation" : "completion"}:
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant={confirmType === "Trip Cancel" ? "danger" : "success"}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
       <Toaster position="top-right"/>
   </>
  );
};

export default ConfirmCancelPopup;
