import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import type { ExpenseType } from "../../../types/settings/Expense.types";
import ExpenseTypeService from "../../../services/settings/ExpenseType.services";
import { KiduValidation, ValidationMessage } from "../../../components/KiduValidation";
import type { ValidationRule } from "../../../components/KiduValidation";
import Attachments from "../../../components/KiduAttachments";

interface TripPaymentModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (data: {
    expenseTypeId: number;
    amount: number;
    expenseVoucher: string;
    remark: string;
    mode: string;
  }) => Promise<number | void>;
  relatedEntityId?: number;
  relatedEntityType?: string;
  heading: string;
  editData?: {
    expenseMasterId: number;
    expenseTypeId: number;
    amount: number;
    expenseVoucher?: string;
    remark: string;
    mode: string;
  } | null;
}

const TripPaymentModal: React.FC<TripPaymentModalProps> = ({
  show,
  onHide,
  onSave,
  heading,
  editData
}) => {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [voucherNumber, setVoucherNumber] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [loadingExpenseTypes, setLoadingExpenseTypes] = useState<boolean>(false);
  const [expenseMasterId, setExpenseMasterId] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    paymentType: "",
    paymentMode: "",
    amount: "",
    remarks: ""
  });

  const rules: Record<string, ValidationRule> = {
    paymentType: {type: "select", required: true, label: "Payment Type"},
    paymentMode: {type: "select", required: true, label: "Payment Mode"},
    amount: {type: "number", required: true, label: "Amount"},
    remarks: {type: "textarea", maxLength: 300, label: "Remarks"}
  };

  useEffect(() => {
    const fetchExpenseTypes = async () => {
      try {
        setLoadingExpenseTypes(true);
        const response = await ExpenseTypeService.getAll();
        if (response.isSucess && Array.isArray(response.value)) {
          setExpenseTypes(response.value);
        } else {
          toast.error("Failed to load expense types!");
        }
      } catch {
        toast.error("Unable to fetch expense types!");
      } finally {
        setLoadingExpenseTypes(false);
      }
    };

    if (show) fetchExpenseTypes();
  }, [show]);

  useEffect(() => {
    if (editData && show) {
      setPaymentType(editData.expenseTypeId.toString());
      setPaymentMode(editData.mode);
      setAmount(editData.amount.toString());
      setVoucherNumber(editData.expenseVoucher || "");
      setRemarks(editData.remark);
      setExpenseMasterId(editData.expenseMasterId);
    } else {
      resetForm();
    }
  }, [editData, show]);

  const resetForm = () => {
    setPaymentType("");
    setPaymentMode("");
    setAmount("");
    setVoucherNumber("");
    setRemarks("");
    setExpenseMasterId(null);
    setErrors({paymentType: "", paymentMode: "", amount: "", remarks: ""});
  };

  const handleSubmit = async () => {
    const v1 = KiduValidation.validate(paymentType, rules.paymentType);
    const v2 = KiduValidation.validate(paymentMode, rules.paymentMode);
    const v3 = KiduValidation.validate(amount, rules.amount);
    const v4 = KiduValidation.validate(remarks, rules.remarks);

    setErrors({
      paymentType: v1.message || "",
      paymentMode: v2.message || "",
      amount: v3.message || "",
      remarks: v4.message || ""
    });

    if (!v1.isValid || !v2.isValid || !v3.isValid || !v4.isValid) return;

    const numAmount = parseFloat(amount);

    try {
      const newId = await onSave({
        expenseTypeId: parseInt(paymentType),
        amount: numAmount,
        expenseVoucher: voucherNumber,
        remark: remarks,
        mode: paymentMode
      });

      if (newId) setExpenseMasterId(newId);
      //toast.success(editData ? "Updated successfully" : "Saved successfully");

      if (editData) onHide();
    } catch {
      toast.error("Error saving payment details!");
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} size="lg" onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton style={{backgroundColor:"#18575A",color:"white"}}>
        <Modal.Title className="fs-5">
          {editData ? "Edit Payment Details" : heading}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{fontFamily:"Urbanist"}}>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={5}>
                  Payment Type <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={7}>
                  {loadingExpenseTypes ? (
                    <div className="d-flex align-items-center gap-2">
                      <Spinner animation="border" size="sm" /><span>Loading...</span>
                    </div>
                  ) : (
                    <Form.Select value={paymentType} onChange={e=>setPaymentType(e.target.value)}>
                      <option value="">Select</option>
                      {expenseTypes.map(type=>(
                        <option key={type.expenseTypeId} value={type.expenseTypeId}>
                          {type.expenseTypeName}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  <ValidationMessage message={errors.paymentType} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={5}>
                  Payment Mode <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={7}>
                  <Form.Select value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}>
                    <option value="">Select Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit">Debit</option>
                    <option value="POS">POS</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </Form.Select>
                  <ValidationMessage message={errors.paymentMode} />
                </Col>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={5}>
                  Amount <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={7}>
                  <Form.Control type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" />
                  <ValidationMessage message={errors.amount} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={5}>Remarks</Form.Label>
                <Col sm={7}>
                  <Form.Control as="textarea" rows={1} value={remarks} onChange={e=>setRemarks(e.target.value)} maxLength={300} placeholder="Enter remarks (optional)" />
                  <Form.Text className="text-muted">{remarks.length}/300 characters</Form.Text>
                  <ValidationMessage message={errors.remarks} />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          {expenseMasterId && (
            <Row><Attachments tableName="expense" recordId={expenseMasterId} /></Row>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button style={{backgroundColor:"#18575A",border:"none"}} onClick={handleSubmit}>
          {editData ? "Update Payment" : "Save Payment"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripPaymentModal;
