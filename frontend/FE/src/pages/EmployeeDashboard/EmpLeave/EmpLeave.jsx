import React from "react";
import { useNavigate } from "react-router-dom";
const EmpLeave = () => {
  const navigate = useNavigate();

  

  return (
    <div className="leave-dashboard">
      <h2>Leave Management</h2>
      <div className="leave-links">
        <button onClick={() => navigate("/applyLeave")}>Apply Leave</button>
        <button onClick={() => navigate("/viewLeave")}>Leave History</button>
        <button onClick={() => navigate("/leaveBalance")}>Leave Balance</button>
      </div>
    </div>
  );
};

export default EmpLeave;
