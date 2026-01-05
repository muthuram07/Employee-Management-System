import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "./ViewAttendance.css";

const ViewAttendance = () => {
  // State to store the employee ID
  const [employeeId, setEmployeeId] = useState(null);
  // State to store attendance records
  const [attendanceRecords, setAttendanceRecords] = useState([]);
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
          setError("Username not found. Please log in again.");
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
        setError("Error fetching employee details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeId();
  }, [username]);

  useEffect(() => {
    /**
     * Fetch attendance records for the employee.
     */
    const fetchAttendanceRecords = async () => {
      if (!employeeId) return;

      try {
        console.log(`Fetching attendance records for employee ID: ${employeeId}`);
        const response = await api.get(`/attendance/all-records/${employeeId}`);
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setError("Error fetching attendance records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [employeeId]);

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  /**
   * Extract only the date from a timestamp.
   * @param {string} timestamp - The timestamp to extract the date from.
   * @returns {string} - The extracted date in YYYY-MM-DD format.
   */
  const extractDate = (timestamp) => {
    return new Date(timestamp).toISOString().split("T")[0];
  };

  /**
   * Extract only the time from a timestamp.
   * @param {string} timestamp - The timestamp to extract the time from.
   * @returns {string} - The extracted time in HH:MM format.
   */
  const extractTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Records for Employee ID - {employeeId || "Loading..."}</h2>
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Attendance ID</th>
              <th>Date</th>
              <th>Clock-In Time</th>
              <th>Clock-Out Time</th>
              <th>Hours Worked</th>
              <th>Is Present</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.attendanceID}</td>
                <td>{extractDate(record.clockInTime)}</td> {/* Extracted Date */}
                <td>{extractTime(record.clockInTime)}</td> {/* Extracted Time */}
                <td>{extractTime(record.clockOutTime)}</td> {/* Extracted Time */}
                <td>{record.workHours}</td>
                <td>{record.isPresent ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAttendance;
