import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const LeaveBalance = () => {
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  // State to store leave balances
  const [leaveBalances, setLeaveBalances] = useState([]);
  // State to handle loading state
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState("");

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
          setError("Username not found.");
          setLoading(false);
          return;
        }

        const response = await api.get(`employee/employee-username/${username}`);
        if (response.data && response.data.employeeId) {
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
          setError("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setError("Error fetching employee details. Please try again.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  useEffect(() => {
    /**
     * Fetch leave balances for the employee.
     */
    const fetchLeaveBalances = async () => {
      if (!employeeId) return;

      try {
        const response = await api.get(`/leaveBalance/all-leave-balance/${employeeId}`);
        setLeaveBalances(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error("Error fetching leave balances:", error);
        setError("Error fetching leave balances. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveBalances();
  }, [employeeId]);

  if (loading) return <p className="text-center text-primary">Loading leave balance...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Leave Balance for Employee ID - {employeeId || "Loading..."}</h2>
        </div>
        <div className="card-body">
          {leaveBalances.length === 0 ? (
            <p className="text-center text-warning">No leave balance data found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover mt-3">
                <thead className="table-dark text-white">
                  <tr>
                    <th className="text-center">Leave Balance ID</th>
                    <th className="text-center">Employee ID</th>
                    <th className="text-center">Leave Type</th>
                    <th className="text-center">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances.map((leave, index) => (
                    <tr key={index} className="text-center">
                      <td className="fw-bold">{leave.leaveBalanceID}</td>
                      <td>{leave.employeeId}</td>
                      <td>{leave.leaveType}</td>
                      <td className="text-success fw-bold">{leave.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;
