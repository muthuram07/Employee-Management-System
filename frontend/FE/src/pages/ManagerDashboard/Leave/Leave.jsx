import React from "react";
import { useNavigate } from "react-router-dom";
import "./Leave.css";

const Leave = () => {
  const navigate = useNavigate(); // ✅ Enable navigation between leave-related pages

  return (
    <div className="leave-dashboard">
      <h2 className="text-center mb-4">Leave Management</h2>
      <div className="leave-links d-flex flex-column align-items-center gap-3">
        {/* Button to navigate to the Apply Leave page */}
        <button
          className="btn btn-primary fw-bold"
          onClick={() => navigate("/applyLeave")}
        >
          Apply Leave
        </button>

        {/* Button to navigate to the Leave History page */}
        <button
          className="btn btn-secondary fw-bold"
          onClick={() => navigate("/viewLeave")}
        >
          Leave History
        </button>

        {/* Button to navigate to the Pending Leave Requests page */}
        <button
          className="btn btn-warning fw-bold"
          onClick={() => navigate("/pendingLeaveRequests")}
        >
          Pending Leave Requests
        </button>

        {/* Button to navigate to the Leave Balance page */}
        <button
          className="btn btn-success fw-bold"
          onClick={() => navigate("/leaveBalance")}
        >
          Leave Balance
        </button>
      </div>
    </div>
  );
};

export default Leave;
