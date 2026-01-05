import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendanceReports = () => {
  const [reportType, setReportType] = useState("all");
  const [employee, setEmployee] = useState("");
  const [reportData, setReportData] = useState([]);
  const [showHeaders, setShowHeaders] = useState(false);
  const [error, setError] = useState("");
  const [managerId, setManagerId] = useState(null);

  // ✅ Fetch employee ID (managerId) from the backend using the username
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("❌ Username not found in localStorage.");
      return;
    }

    api.get(`/employee/employee-username/${username}`)
      .then((response) => {
        if (response.data && response.data.employeeId) {
          setManagerId(response.data.employeeId); // ✅ Correct managerId
        } else {
          setError("❌ Employee ID not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Employee ID:", err);
        setError("❌ Failed to fetch Employee ID.");
      });
  }, []);

  /**
   * ✅ Generate the attendance report using the correct managerId
   */
  const generateReport = async () => {
    try {
      let response;
      
      if (reportType === "all") {
        if (!managerId) {
          setError("❌ Manager ID is required to fetch the report.");
          return;
        }
        response = await api.get(`/attendance/all-records-manager/${managerId}`); // ✅ Correct API endpoint
      } else if (reportType === "employee") {
        if (!employee) {
          setError("⚠️ Please enter a valid Employee ID.");
          return;
        }
        response = await api.get(`/attendance/all-records/${employee}`);
      }

      setReportData(response.data);
      setShowHeaders(true);
      setError("");
    } catch (error) {
      console.error("Error generating report:", error);
      setError("❌ Failed to generate the report. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Attendance Reports</h2>

      {/* Error Message */}
      {error && <p className="text-danger fw-bold text-center">{error}</p>}

      {/* Report Type and Employee ID Selection */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Report Type</label>
          <select
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="all">All Employees</option>
            <option value="employee">By Employee ID</option>
          </select>
        </div>

        {reportType === "employee" && (
          <div className="col-md-6">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-control"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Enter Employee ID"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-primary me-2" onClick={generateReport}>
          Generate Report
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => exportToPDF("attendanceReport")}
          disabled={reportData.length === 0}
        >
          Export to PDF
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => exportToExcel("attendanceReport")}
          disabled={reportData.length === 0}
        >
          Export to Excel
        </button>
      </div>

      {/* Attendance Report Table */}
      <div className="table-responsive">
        <table id="attendanceReport" className="table table-bordered table-striped">
          {showHeaders && (
            <thead className="table-dark">
              <tr>
                <th>Attendance ID</th>
                <th>Employee ID</th>
                <th>Is Present</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Work Hours</th>
              </tr>
            </thead>
          )}
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.attendanceID}</td>
                <td>{item.employeeId}</td>
                <td>{item.isPresent ? "Yes" : "No"}</td>
                <td>{new Date(item.clockInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{new Date(item.clockOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{item.workHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReports;
