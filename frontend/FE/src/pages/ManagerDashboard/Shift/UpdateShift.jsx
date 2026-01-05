import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateShift = () => {
  const [shiftId, setShiftId] = useState("");
  const [shiftDetails, setShiftDetails] = useState({
    shiftDate: null,
    shiftStartTime: "",
    shiftEndTime: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Function to disable weekends in DatePicker
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  // ✅ Handles shift details input field updates
  const handleChange = (e) => {
    setShiftDetails({ ...shiftDetails, [e.target.name]: e.target.value });
  };

  // ✅ Handles shift ID input updates separately
  const handleShiftIdChange = (e) => {
    setShiftId(e.target.value);
  };

  // ✅ Handles form submission, validates data, and sends API request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!shiftId) {
      setMessage("⚠️ Shift ID is required.");
      return;
    }

    if (!shiftDetails.shiftDate || !shiftDetails.shiftStartTime || !shiftDetails.shiftEndTime) {
      setMessage("⚠️ All fields are required.");
      return;
    }

    if (shiftDetails.shiftStartTime >= shiftDetails.shiftEndTime) {
      setMessage("⚠️ Shift start time must be earlier than shift end time.");
      return;
    }

    try {
      console.log("Updating shift with ID:", shiftId);

      // Send PUT request to update shift details
      await api.put(`/shift/update-shift-details/${shiftId}`, {
        shiftDate: shiftDetails.shiftDate ? shiftDetails.shiftDate.toISOString().split("T")[0] : "",
        shiftStartTime: `${shiftDetails.shiftStartTime}:00`,
        shiftEndTime: `${shiftDetails.shiftEndTime}:00`,
      });

      setMessage("✅ Shift updated successfully!");
      setShiftId("");
      setShiftDetails({ shiftDate: null, shiftStartTime: "", shiftEndTime: "" });
    } catch (error) {
      console.error("❌ Error updating shift:", error);

      if (error.response) {
        setMessage(`❌ Error: ${error.response.data.message || "Failed to update shift."}`);
      } else {
        setMessage("❌ Network error: Unable to reach the server.");
      }
    }
  };

  return (
    <div className="container mt-5 p-5 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">Update Shift</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="fw-bold">Shift ID:</label>
          <input
            type="number"
            name="shiftId"
            value={shiftId}
            onChange={handleShiftIdChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="fw-bold">Shift Date:</label>
          <DatePicker
            selected={shiftDetails.shiftDate}
            onChange={(date) => setShiftDetails({ ...shiftDetails, shiftDate: date })}
            filterDate={isWeekday} // ✅ Disable weekends dynamically
            dateFormat="yyyy-MM-dd"
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="fw-bold">Shift Start Time:</label>
          <input
            type="time"
            name="shiftStartTime"
            value={shiftDetails.shiftStartTime}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="fw-bold">Shift End Time:</label>
          <input
            type="time"
            name="shiftEndTime"
            value={shiftDetails.shiftEndTime}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-warning fw-bold mt-3">
            Update Shift
          </button>
        </div>
      </form>

      {/* Display success or error messages */}
      {message && (
        <p
          className={`text-center mt-3 ${
            message.startsWith("✅") ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdateShift;
