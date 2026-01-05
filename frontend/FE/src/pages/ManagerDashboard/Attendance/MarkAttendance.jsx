import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; // ✅ Added Bootstrap Modal for error handling
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Attendance = () => {
  // State to store attendance entries
  const [entries, setEntries] = useState([]);
  // State to store selected date
  const [date, setDate] = useState(null);
  // State to store check-in and check-out times
  const [clockInTime, setCheckIn] = useState("");
  const [clockOutTime, setCheckOut] = useState("");
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  // State to store error messages
  const [errorMessage, setErrorMessage] = useState("");
  // State to control the visibility of the error popup
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  // State to store success messages
  const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success message
  // State to control the visibility of the success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ State for success popup
  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  useEffect(() => {
    /**
     * Fetch the employee ID based on the username stored in localStorage.
     */
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          setErrorMessage("Username not found. Please log in again.");
          setShowErrorPopup(true);
          return;
        }

        const response = await api.get(`employee/employee-username/${username}`);
        setEmployeeId(response.data.employeeId);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setErrorMessage("Failed to fetch employee details. Please try again.");
        setShowErrorPopup(true);
      }
    };

    fetchEmployeeId();
  }, [username]);

  /**
   * Filter out weekends from the date picker.
   * @param {Date} date - The selected date.
   * @returns {boolean} - True if the date is a weekday, false otherwise.
   */
  const isWeekday = (date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  /**
   * Reset form fields and open the modal for marking attendance.
   */
  const handleMarkAttendance = () => {
    setDate(null);
    setCheckIn("");
    setCheckOut("");
    setShowModal(true);
  };

  /**
   * Handle the submission of a single attendance entry.
   */
  const handleSingleEntrySubmit = async () => {
    // Ensure date is set to today's date if not selected
    const selectedDate = date || new Date();

    if (!selectedDate || !clockInTime || !clockOutTime || !employeeId) {
      setErrorMessage("⚠ Error: All fields are required.");
      setShowErrorPopup(true);
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedCheckIn = `${formattedDate}T${clockInTime}:00`;
    const formattedCheckOut = `${formattedDate}T${clockOutTime}:00`;

    const newEntry = {
      clockInTime: formattedCheckIn,
      clockOutTime: formattedCheckOut,
    };

    try {
      await api.post(`/attendance/attendanceRecords/${employeeId}`, newEntry);
      setEntries([...entries, newEntry]);
      setShowModal(false);
      setSuccessMessage("✅ Attendance recorded successfully!"); // ✅ Set success message
      setShowSuccessPopup(true); // ✅ Show success popup
    } catch (error) {
      console.error("❌ Error saving attendance:", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage("⚠ Attendance already marked for this date!");
      } else {
        setErrorMessage("❌ Failed to record attendance. Please try again.");
      }

      setShowErrorPopup(true);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold">Employee Attendance</h1>

      {/* Buttons for marking and viewing attendance */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-outline-primary btn-md rounded-pill"
          onClick={handleMarkAttendance}
        >
          <i className="bi bi-calendar-plus me-1"></i> Mark Attendance
        </button>
        <a
          href={`/viewAttendance`}
          className="btn btn-outline-secondary btn-md rounded-pill"
        >
          <i className="bi bi-eye"></i> View Attendance
        </a>
      </div>

      {/* Modal for adding attendance */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary">
                  Add Attendance
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Date:</label>
                    <DatePicker
                      selected={date || new Date()} // Default to today's date
                      onChange={(selectedDate) => setDate(selectedDate)}
                      filterDate={isWeekday} // Ensure only weekdays are selectable
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      minDate={new Date()} // Disable past dates
                      maxDate={new Date()} // Disable future dates
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Check-In Time:
                    </label>
                    <input
                      type="time"
                      className="form-control form-control-md"
                      name="checkIn"
                      value={clockInTime}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Check-Out Time:
                    </label>
                    <input
                      type="time"
                      className="form-control form-control-md"
                      name="checkOut"
                      value={clockOutTime}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill"
                  onClick={handleSingleEntrySubmit}
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal Popup */}
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

      {/* Success Modal Popup */}
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

export default Attendance;
