import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Importing Modal from React Bootstrap

const Shift = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleClose = () => setShowModal(false);

  // Retrieve employee ID from local storage
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    /**
     * Fetch shift data for the logged-in employee.
     * This includes both allocated shifts and available shifts.
     */
    const fetchShiftData = async () => {
      try {
        // Check if employee ID exists in local storage
        if (!employeeId) {
          console.error("No employee ID found in local storage.");
          setModalMessage("Employee ID is missing. Please log in again.");
          setShowModal(true);
          return;
        }

      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching shift data:", error);

        // Display a user-friendly error message
        setModalMessage("Failed to fetch shift data. Please try again later.");
        setShowModal(true);
      }
    };

    fetchShiftData();
  }, [employeeId]);

  return (
    <div className="shift-dashboard">
      <h2>Shift Management</h2>
      
      <div className="shift-links">
        {/* Navigation buttons for shift management */}
        <button onClick={() => navigate("/allocatedShift")} className="btn btn-warning fw-bold">Allocated Shift</button>
        <button onClick={() => navigate("/getAllShift")} className="btn btn-warning fw-bold">Available Shift</button>
        <button onClick={() => navigate("/shiftSwap")} className="btn btn-warning fw-bold">Shift Swap</button>
      </div>

      {/* Modal for displaying messages */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Shift;
