import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";

const EmployeeReports = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState("");
  const [showHeaders, setShowHeaders] = useState(false); // ✅ Tracks header visibility

  const username = localStorage.getItem("username");

  useEffect(() => {
    /**
     * Fetch the employee ID of the logged-in user.
     */
    const fetchEmployeeId = async () => {
      try {
        if (!username) throw new Error("No username found in local storage.");

        const response = await api.get(`employee/employee-username/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        });

        setEmployeeId(response.data.employeeId);
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  /**
   * Fetch all employee reports managed by the logged-in manager.
   */
  const fetchEmployeeReports = async () => {
    try {
      if (!employeeId) throw new Error("Employee ID not available yet.");

      const response = await api.get(`employee/get/all-employee-records/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });

      setEmployeeData(response.data);
      setShowHeaders(true); // ✅ Show table headers when data is loaded
      setError(""); // ✅ Clear any previous errors
    } catch (err) {
      console.error("Error fetching employee reports:", err);
      setError("Failed to load employee reports. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ minWidth: "100vh" }}>
      <h2 className="mb-4" style={{ scrollMarginTop: "100px", paddingTop: "1rem" }}>
        Employee Reports
      </h2>

      {/* Action Buttons */}
      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2 text-nowrap" onClick={fetchEmployeeReports}>
          Generate Report
        </button>
        <button
          className="btn btn-primary me-2 text-nowrap"
          onClick={() => exportToPDF("employeeReport")}
          disabled={employeeData.length === 0} // ✅ Disable if no data
        >
          Export to PDF
        </button>
        <button
          className="btn btn-primary me-2 text-nowrap"
          onClick={() => exportToExcel("employeeReport")}
          disabled={employeeData.length === 0} // ✅ Disable if no data
        >
          Export to Excel
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Employee Report Table */}
      <div className="table-responsive">
        <table id="employeeReport" className="table table-bordered table-striped">
          {showHeaders && ( // ✅ Show headers only after clicking "Generate Report"
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Manager ID</th>
                <th>Shift ID</th>
                <th>Joined Date</th>
              </tr>
            </thead>
          )}
          <tbody>
            {employeeData.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.department}</td>
                <td>{emp.role}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.managerId}</td>
                <td>{emp.shiftId}</td>
                <td>{emp.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeReports;
