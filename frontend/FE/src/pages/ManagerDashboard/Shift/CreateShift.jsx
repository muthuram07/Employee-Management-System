import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from "react-bootstrap"; // ✅ Import Modal from React Bootstrap
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateShift.css";

const CreateShift = () => {
  // ✅ Initializing state for shift details
  const [shift, setShift] = useState({
    shiftId: "",
    shiftDate: null, // Using Date object for better control
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // ✅ State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success messages
  const [showErrorPopup, setShowErrorPopup] = useState(false); // ✅ State to control error modal
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ State to control success modal

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  /**
   * ✅ Handles input field updates
   * Updates shift state when user types into form fields
   */
  const handleChange = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  /**
   * ✅ Handles form submission
   * Ensures proper validation and sends data to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Input validation to ensure no empty fields
    if (!shift.shiftId || !shift.shiftDate || !shift.shiftStartTime || !shift.shiftEndTime) {
      setErrorMessage("⚠️ All fields are required.");
setShowErrorPopup(true);
      return;
    }

    // ✅ Validate that the start time is earlier than the end time
    if (shift.shiftStartTime >= shift.shiftEndTime) {
      setErrorMessage("⚠️ Shift start time must be earlier than shift end time.");
setShowErrorPopup(true);
      return;
    }

    try {
      console.log("Submitting shift data:", shift);

      // Send the shift data to the backend API
      await api.post("/shift/create-shift", {
        shiftId: parseInt(shift.shiftId, 10), // Convert to integer for API request
        shiftDate: shift.shiftDate.toISOString().split("T")[0], // Convert Date object to YYYY-MM-DD format
        shiftStartTime: `${shift.shiftStartTime}:00`, // Standardize time format
        shiftEndTime: `${shift.shiftEndTime}:00`, // Standardize time format
      });

      setSuccessMessage("✅ Shift created successfully!");
setShowSuccessPopup(true);
      setShift({ shiftId: "", shiftDate: null, shiftStartTime: "", shiftEndTime: "" });
    } catch (error) {
      console.error("❌ Error creating shift:", error);

      // ✅ Improved error handling to provide better feedback
      if (error.response) {
        setErrorMessage(`❌ Error: ${error.response.data.message || "Failed to create shift."}`);
      } else {
        setErrorMessage("❌ Network error: Unable to reach the server.");
      }

      setShowErrorPopup(true);
    }
  };

  return (
    <div className="create-shift-container">
      <h2 className="text-center mb-4">Create a New Shift</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">Shift ID:</label>
          <input
            type="number"
            name="shiftId"
            value={shift.shiftId}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Shift Date:</label>
          <DatePicker
            selected={shift.shiftDate}
            onChange={(date) => setShift({ ...shift, shiftDate: date })}
            filterDate={isWeekday} // ✅ Disable weekends dynamically
            dateFormat="yyyy-MM-dd"
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Shift Start Time:</label>
          <input
            type="time"
            name="shiftStartTime"
            value={shift.shiftStartTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Shift End Time:</label>
          <input
            type="time"
            name="shiftEndTime"
            value={shift.shiftEndTime}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="button-container mt-4">
          <button type="submit" className="btn btn-primary fw-bold">
            Create Shift
          </button>
        </div>
      </form>

      {/* Error Modal */}
      <Modal show={showErrorPopup} onHide={() => setShowErrorPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger fw-bold">{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorPopup(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessPopup} onHide={() => setShowSuccessPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-success fw-bold">{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessPopup(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateShift;
