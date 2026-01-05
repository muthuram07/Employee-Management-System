import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // ✅ Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // ✅ Import styles
import { Modal, Button } from "react-bootstrap"; // ✅ Import Modal from React Bootstrap
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplyLeave = () => {
  // State to store leave details
  const [leave, setLeave] = useState({ startDate: null, endDate: null, leaveType: "Vacation" });
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success messages
  const [showErrorPopup, setShowErrorPopup] = useState(false); // ✅ State to control error modal
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ State to control success modal
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

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          console.log("Received Employee ID:", response.data.employeeId);
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
          setErrorMessage("Employee ID not found. Please contact support.");
          setShowErrorPopup(true);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setErrorMessage("Failed to fetch employee details. Please try again.");
        setShowErrorPopup(true);
      }
    };

    fetchEmployeeId();
  }, [username]);

  /**
   * Disable Saturdays & Sundays in the calendar.
   * @param {Date} date - The selected date.
   * @returns {boolean} - True if the date is a weekday, false otherwise.
   */
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // ✅ Allow only weekdays
  };

  /**
   * Handle the submission of the leave request form.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!leave.startDate || !leave.endDate) {
      setErrorMessage("Please select both start and end dates.");
      setShowErrorPopup(true);
      return;
    }

    if (leave.leaveType.length < 2 || leave.leaveType.length > 30) {
      setErrorMessage("Leave Type must be between 2 and 30 characters.");
      setShowErrorPopup(true);
      return;
    }

    if (!employeeId) {
      setErrorMessage("Error: Employee ID not found.");
      setShowErrorPopup(true);
      return;
    }

    // Format dates for the API request
    const formattedStartDate = new Date(leave.startDate);
    formattedStartDate.setDate(formattedStartDate.getDate() + 1); // Add 1 day
    const formattedStartDateString = formattedStartDate.toISOString().split("T")[0] + "T09:00:00";

    const formattedEndDate = new Date(leave.endDate);
    formattedEndDate.setDate(formattedEndDate.getDate() + 1); // Add 1 day
    const formattedEndDateString = formattedEndDate.toISOString().split("T")[0] + "T18:00:00";

    try {
      console.log({ ...leave, startDate: formattedStartDateString, endDate: formattedEndDateString });

      // Submit leave request to the API
      await api.post(`/leave/apply-leave/${employeeId}`, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        leaveType: leave.leaveType,
      });

      setSuccessMessage("Leave request submitted successfully!");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error applying leave:", error);
      setErrorMessage("Failed to submit leave request. Please try again.");
      setShowErrorPopup(true);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Apply for Leave</h2>
      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Start Date:</label>
            <DatePicker
              selected={leave.startDate}
              onChange={(date) => setLeave({ ...leave, startDate: date })}
              filterDate={isWeekday} // ✅ Disable weekends dynamically
              minDate={new Date()} // ✅ Disable past dates
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date:</label>
            <DatePicker
              selected={leave.endDate}
              onChange={(date) => setLeave({ ...leave, endDate: date })}
              filterDate={isWeekday} // ✅ Disable weekends dynamically
              minDate={leave.startDate || new Date()} // ✅ Ensure end date is not before start date
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Leave Type:</label>
            <select
              className="form-select"
              name="leaveType"
              onChange={(e) => setLeave({ ...leave, leaveType: e.target.value })}
              value={leave.leaveType}
              required
            >
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button type="submit" className="btn btn-success fw-bold">
              Submit Leave Request
            </button>
            <button type="reset" className="btn btn-secondary fw-bold">
              Reset
            </button>
          </div>
        </form>
      </div>

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

export default ApplyLeave;