import React, { useEffect, useState } from "react";
import "./EmployeeDashboard.css";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";

// ✅ Import Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeDashboard = () => {
  // State to store employee data
  const [data, setData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ State to toggle sidebar
  // Retrieve username from local storage
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Fetch employee details based on the username stored in localStorage.
     */
    const fetchEmployeeData = async () => {
      try {
        // Ensure username exists before making the API call
        if (!username) {
          console.error("No username found in localStorage.");
          toast.error("Username not found. Please log in again.");
          navigate("/");
          return;
        }
        // Fetch employee details from the API
        const response = await api.get(`/employee/employee-username/${username}`);
        setData(response.data);
      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching employee data:", error);

        // Display a user-friendly error message
        toast.error("Failed to load employee data. Please try again.");
      }
    };

    fetchEmployeeData();
  }, [username, navigate]);

  useEffect(() => {
    /**
     * Show shift swap notification on login if applicable.
     */
    const swapStatus = localStorage.getItem(`shiftSwap_${data.employeeId}`);

    if (swapStatus) {
      toast.info(`Your shift swap request was ${swapStatus}.`, {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Clear notification after showing once
      localStorage.removeItem(`shiftSwap_${data.employeeId}`);
    }
  }, [data]);

  useEffect(() => {
    /**
     * Show leave approval/rejection notification on login if applicable.
     */
    const leaveStatus = localStorage.getItem(`leaveRequest_${data.employeeId}`);

    if (leaveStatus) {
      toast.info(`Your leave request has been ${leaveStatus.toLowerCase()}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // ✅ Remove notification after displaying
      localStorage.removeItem(`leaveRequest_${data.employeeId}`);
    }
  }, [data]);

  useEffect(() => {
    /**
     * Prevent back navigation using the browser's back button.
     */
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
      console.log("Back button disabled!");
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  /**
   * Handle user logout by clearing localStorage and redirecting to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken"); // Remove token if stored
    console.log("Logged out");
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to login page
  };

  /**
   * Toggle the sidebar visibility.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button className="menu-icon" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* Sidebar Navigation */}
      {isSidebarOpen && (
        <div className="sidebar">
          <button className="close-icon" onClick={toggleSidebar}>
            <i className="bi bi-x"></i>
          </button>
          <ul className="nav flex-column">
            <li className="nav-item" onClick={() => navigate("/profile")}>
              <i className="bi bi-person-fill"></i> Profile
            </li>
            <li className="nav-item" onClick={() => navigate("/attendance")}>
              <i className="bi bi-calendar-check-fill"></i> Attendance
            </li>
            <li className="nav-item" onClick={() => navigate("/empLeave")}>
              <i className="bi bi-file-earmark-text-fill"></i> Leave Requests
            </li>
            <li className="nav-item" onClick={() => navigate("/empShift")}>
              <i className="bi bi-clock-fill"></i> Shift Details
            </li>
            <li className="nav-item text-danger fw-bold" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content container mt-5 p-4 rounded shadow-lg bg-light">
        <h2 className="text-center text-dark border-bottom pb-3">Welcome to Your Employee Dashboard</h2>
        <div className="content text-center">
          <img src="/emp1.gif" alt="Employee Workspace" className="img-fluid mb-4" />
          <p className="text-muted">
            This dashboard gives employees access to key details regarding attendance, leave requests, shifts,
            and assigned projects. Stay connected, track progress, and manage your work-life balance efficiently.
          </p>

          <h3 className="text-primary mt-4">Work & Responsibilities</h3>
          <ul className="list-group list-group-flush text-start">
            <li className="list-group-item">
              <strong>Profile Management:</strong> Keep your details up to date.
            </li>
            <li className="list-group-item">
              <strong>Attendance Tracking:</strong> Monitor your work hours.
            </li>
            <li className="list-group-item">
              <strong>Leave Requests:</strong> Apply and check leave status.
            </li>
            <li className="list-group-item">
              <strong>Shift Information:</strong> View and manage your assigned shifts. className="list-group-item"
            </li>
<li>
              <strong>Project Assignments:</strong> Stay updated on tasks.
            </li>
            <li className="list-group-item">
              <strong>Performance Metrics:</strong> Receive feedback and track growth.
            </li>
          </ul>

          <h3 className="text-primary mt-4">Company Announcements</h3>
          <p className="text-muted">
            Stay informed about upcoming company events, training sessions, and important updates regarding
            workplace policies and growth initiatives.
          </p>

          <h3 className="text-primary mt-4">Employee Growth & Learning</h3>
          <ul className="list-group list-group-flush text-start">
            <li className="list-group-item">
Access <strong>career development programs</strong> to enhance skills.
</li>
            <li className="list-group-item">
Engage in <strong>mentorship & training</strong> sessions.
</li>
            <li className="list-group-item">
Participate in <strong>team-building activities</strong> for collaboration.
</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
