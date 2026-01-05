import React, { useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Shift.css";

const Shift = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [shiftId, setShiftId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const confirmDeleteShift = async () => {
    if (!shiftId || isNaN(shiftId)) {
      setErrorMessage("⚠️ Please enter a valid Shift ID.");
      setShowErrorModal(true);
      return;
    }

    try {
      await api.delete(`shift/delete-shift/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      setSuccessMessage(`✅ Shift ID ${shiftId} has been deleted successfully!`);
      setShowSuccessModal(true);
      setShowDeletePopup(false);
    } catch (error) {
      setErrorMessage("❌ Failed to delete shift. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold mb-4">Shift Management</h2>

      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <button className="btn btn-primary" onClick={() => navigate("/createShift")}>Create Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/allocatedShift")}>Allocated Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/getAllShift")}>Available Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/updateShift")}>Shift Changes</button>
        <button className="btn btn-primary" onClick={() => navigate("/shiftSwapRequests")}>Shift Swap Requests</button>
        <button className="btn btn-warning fw-bold" onClick={() => navigate("/shiftSwap")}>Shift Swap</button>
        <button className="btn btn-danger fw-bold" onClick={handleDeletePopup}>
          <i className="bi bi-trash-fill"></i> Delete Shift
        </button>
      </div>

      {showDeletePopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Shift Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeletePopup(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Shift ID"
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDeleteShift}>Delete Shift</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger fw-bold">{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-success fw-bold">{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Shift;
