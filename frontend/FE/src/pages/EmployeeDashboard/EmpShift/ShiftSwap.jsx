import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const ShiftSwap = () => {
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  // State to store the shift ID entered by the user
  const [shiftId, setShiftId] = useState("");
  // State to store messages for user feedback
  const [message, setMessage] = useState("");
  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  useEffect(() => {
    /**
     * Fetch the employee ID based on the username stored in localStorage.
     */
    const fetchEmployeeId = async () => {
      try {
        // Check if username exists in localStorage
        if (!username) {
          console.error("No username found.");
          setMessage("Username not found.");
          return;
        }

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        // Check if the response contains a valid employee ID
        if (response.data && response.data.employeeId) {
          setEmployeeId(response.data.employeeId);
        } else {
          setMessage("Employee ID not found.");
        }
      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching employee details:", error);

        // Display a user-friendly error message
        setMessage("Error fetching employee details. Please try again later.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  /**
   * Handle input changes for the Shift ID field.
   * @param {Object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    setShiftId(e.target.value);
  };

  /**
   * Handle form submission for requesting a shift swap.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that both employee ID and shift ID are provided
    if (!employeeId || !shiftId) {
      setMessage("Both Employee ID and Shift ID are required.");
      return;
    }

    try {
      console.log(`Sending swap request for Employee ID: ${employeeId}, Shift ID: ${shiftId}`);
      // Send the shift swap request to the API
      await api.post("/shift/request-swap", null, {
        params: { employeeId, shiftId }, // Pass parameters correctly
      });

      // Provide success feedback to the user
      setMessage("Shift swap request submitted successfully!");
    } catch (error) {
      // Log error details for debugging
      console.error("Error requesting shift swap:", error);

      // Display a user-friendly error message
      setMessage("Failed to submit swap request. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Request Shift Swap</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="mb-3 w-50">
              <label className="form-label fw-bold">Shift ID:</label>
              <input
                type="number"
                name="shiftId"
                value={shiftId}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-warning fw-bold mt-3">
              Submit Swap Request
            </button>
          </form>

          {/* Display feedback messages */}
          {message && <p className="text-center text-danger mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShiftSwap;
