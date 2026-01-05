import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

// ✅ Import Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShiftSwapRequests = () => {
  const [shiftRequests, setShiftRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null); // ✅ Extracted Manager ID

  const username = localStorage.getItem("username"); // ✅ Get username from local storage

  // ✅ Step 1: Fetch Employee ID using Username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
          },
        });

        setEmployeeId(response.data.employeeId); // ✅ Extracted Manager ID
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

  // ✅ Step 2: Fetch Shift Requests Using Employee ID (Manager ID)
  useEffect(() => {
    const fetchShiftRequests = async () => {
      try {
        console.log("Fetching pending shift swap requests...");
        const response = await api.get(`shift/request-status/${employeeId}`, {
          params: { status: "PENDING" },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
          },
        });

        console.log("API Response:", response.data); // ✅ Debugging Response
        setShiftRequests(response.data);
      } catch (error) {
        console.error("Error fetching shift swap requests:", error);
        setError("Failed to fetch shift swap requests.");
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchShiftRequests();
    }
  }, [employeeId]);

  /**
   * Handle approval or rejection of a shift swap request.
   * @param {number} requestId - The ID of the shift swap request.
   * @param {number} approved - 1 for approval, 0 for rejection.
   * @param {number} employeeId - The ID of the employee associated with the request.
   */
  const handleAction = async (requestId, approved, employeeId) => {
    try {
      console.log(`Updating shift request ID: ${requestId}, Approved: ${approved}`);

      await api.post("/shift/approve-swap", null, { params: { requestId, approved } });

      // ✅ Save approval/rejection in local storage for employee notification
      localStorage.setItem(`shiftSwap_${employeeId}`, approved ? "APPROVED" : "REJECTED");

      // ✅ Show success notification for the manager
      toast.success(`Shift swap request ${approved ? "approved" : "rejected"}! ✅`, {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Update UI after approval/rejection
      setShiftRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: approved ? "APPROVED" : "REJECTED", approvedByManager: !!approved }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating shift request:", error);
      setError("Failed to update shift request.");
    }
  };

  if (loading) return <p className="text-center text-primary">Loading pending shift requests...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Pending Shift Swap Requests</h2>
        </div>
        <div className="card-body">
          {shiftRequests.length === 0 ? (
            <p className="text-center text-warning">No pending shift swap requests found.</p>
          ) : (
            <div className="table-responsive mt-4">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-white">
                  <tr>
                    <th>Request ID</th>
                    <th>Requested Shift ID</th>
                    <th>Employee ID</th>
                    <th>Status</th>
                    <th>Approve</th>
                    <th>Reject</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftRequests.map((request, index) => (
                    <tr key={index} className="text-center">
                      <td className="fw-bold">{request.id}</td>
                      <td>{request.requestedShiftId}</td> {/* ✅ Uses DTO Property */}
                      <td>{request.employee.employeeId}</td>
                      <td className={request.status === "APPROVED" ? "text-success fw-bold" : "text-warning fw-bold"}>
                        {request.status}
                      </td>
                      <td>
                        <button
                          className="btn btn-success fw-bold"
                          onClick={() => handleAction(request.id, 1, request.employee.employeeId)}
                          disabled={request.status === "APPROVED"} // ✅ Disable if already approved
                        >
                          Approve
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger fw-bold"
                          onClick={() => handleAction(request.id, 0, request.employee.employeeId)}
                          disabled={request.status === "REJECTED"} // ✅ Disable if already rejected
                        >
                          Reject
                        </button>
                      </td>
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

export default ShiftSwapRequests;
