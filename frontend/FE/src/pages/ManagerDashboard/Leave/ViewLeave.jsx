import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const ViewLeave = () => {
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  // State to store leave records
  const [leaveRecords, setLeaveRecords] = useState([]);
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

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          console.log("Received Employee ID:", response.data.employeeId);
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
          setError("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setError("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  useEffect(() => {
    /**
     * Fetch leave records for the employee.
     */
    const fetchLeaveRecords = async () => {
      if (!employeeId) return;

      try {
        console.log(`Fetching leave records for employee ID: ${employeeId}`);
        const response = await api.get(`/leave/all-leave-employee/${employeeId}`);
        setLeaveRecords(response.data);
      } catch (error) {
        console.error("Error fetching leave records:", error);
        setError("Error fetching leave records.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRecords();
  }, [employeeId]);

  if (loading) return <p className="text-center text-primary">Loading leave records...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  /**
   * Extract only the date from a timestamp.
   * @param {string} timestamp - The timestamp to extract the date from.
   * @returns {string} - The extracted date in YYYY-MM-DD format.
   */
  const extractDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toISOString().split("T")[0] : "Pending"; // Extracts YYYY-MM-DD
  };

  return (
    <div className="container mt-5 p-4 rounded shadow-lg bg-light">
      <h2 className="text-center text-dark border-bottom pb-3">
        Leave Records for Employee ID - {employeeId || "Loading..."}
      </h2>

      {leaveRecords.length === 0 ? (
        <p className="text-center text-warning">No leave records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover mt-3">
            <thead className="table-dark text-white">
              <tr>
                <th>Leave ID</th>
                <th>Applied Date</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Leave Type</th>
                <th>Approved Date</th>
              </tr>
            </thead>
            <tbody>
              {leaveRecords.map((leave, index) => (
                <tr key={index} className="text-center">
                  <td className="fw-bold">{leave.leaveId}</td>
                  <td>{extractDate(leave.appliedDate)}</td>
                  <td>{extractDate(leave.startDate)}</td>
                  <td>{extractDate(leave.endDate)}</td>
                  <td
                    className={
                      leave.status === "Approved"
                        ? "text-success fw-bold"
                        : leave.status === "Rejected"
                        ? "text-danger fw-bold"
                        : "text-warning fw-bold"
                    }
                  >
                    {leave.status}
                  </td>
                  <td>{leave.leaveType}</td>
                  <td>{extractDate(leave.approvedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewLeave;
