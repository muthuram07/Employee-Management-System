import React, { useEffect, useState } from "react";
import { api } from "../../../service/api";
// import "./LeaveRequests.css";

const LeaveRequests = () => {
  // State to store leave requests
  const [requests, setRequests] = useState([]);
  // State to handle loading state
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Fetch all leave requests from the API.
     */
    const fetchRequests = async () => {
      try {
        console.log("Fetching leave requests...");
        const response = await api.get("/leave-requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError("Failed to fetch leave requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p className="text-center text-primary">Loading leave requests...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="leave-requests-container container mt-5">
      <h2 className="text-center mb-4">Leave Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-warning">No leave requests found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Request ID</th>
                <th className="text-center">Employee Name</th>
                <th className="text-center">Start Date</th>
                <th className="text-center">End Date</th>
                <th className="text-center">Leave Type</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="text-center">{request.id}</td>
                  <td className="text-center">{request.employeeName}</td>
                  <td className="text-center">{request.startDate}</td>
                  <td className="text-center">{request.endDate}</td>
                  <td className="text-center">{request.leaveType}</td>
                  <td className={`text-center fw-bold ${request.status === "Approved" ? "text-success" : request.status === "Rejected" ? "text-danger" : "text-warning"}`}>
                    {request.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
