import React, { useState, useEffect } from "react";
import { api } from "../../service/api"; // API instance
import "./ViewEmployee.css"; // Import CSS

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); //  State for search functionality

  const username = localStorage.getItem("username"); //  Get username from local storage

  useEffect(() => {
    /**
     * Fetch the employee ID of the logged-in user.
     */
    const fetchEmployeeId = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, //  Include JWT Token
          },
        });

        setEmployeeId(response.data.employeeId); //  Extract Employee ID
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

  useEffect(() => {
    /**
     * Fetch all employees managed by the logged-in manager.
     */
    const fetchEmployees = async () => {
      try {
        const response = await api.get(`employee/get/all-employee-records/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, //  Include JWT Token
          },
        });

        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load employee details. Please try again.");
      }
    };

    if (employeeId) {
      fetchEmployees();
    }
  }, [employeeId]);

  /**
   * Filter employees based on the search term.
   */
  const filteredEmployees = employees.filter((employee) =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employees-container">
      <h2 className="employees-title">View Employees</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Employee Table */}
      {filteredEmployees.length > 0 ? (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Manager ID</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Department</th>
              <th>Shift ID</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.employeeId}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.managerId}</td>
                <td>{employee.email}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.department}</td>
                <td>{employee.shiftId}</td>
                <td>{employee.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p className="loading-message">No employee found...</p>
      )}
    </div>
  );
};

export default ViewEmployee;
