import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [warningMessage, setWarningMessage] = useState(""); // ✅ State for warning message
  const [showToast, setShowToast] = useState(false);

  /**
   * Handle user logout by clearing localStorage and redirecting to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken");
    console.log("Logged out successfully.");
    navigate("/");
  };

  useEffect(() => {
    /**
     * Prevent back navigation using the browser's back button.
     */
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  /**
   * Handle the display of the delete employee modal.
   */
  const handleDeletePopup = () => {
    setWarningMessage(""); // ✅ Clear any previous warnings
    setShowDeletePopup(true);
  };

  /**
   * Confirm and delete the employee based on the entered Employee ID.
   */
  const confirmDelete = async () => {
    if (!employeeId || isNaN(employeeId)) {
      setWarningMessage("⚠ Please enter a valid Employee ID."); // ✅ Show warning message
      return;
    }

    try {
      await api.delete(`/employee/delete/employee-record/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });

      setShowDeletePopup(false);
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error.message);

      if (error.response && error.response.status === 404) {
        setWarningMessage("❌ Employee not found. Check the ID and try again.");
      } else if (error.response && error.response.status === 500) {
        setWarningMessage("❌ Something went wrong on our end. Please try again or reach out for assistance.");
      } else {
        setWarningMessage("❌ Failed to delete employee. Please try again.");
      }
    }
  };

  /**
   * Toggle the sidebar visibility.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    /**
     * Add scroll animations for sections.
     */
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section, .small-content");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="dashboard">
      {!isSidebarOpen && (
        <button className="menu-icon" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* ✅ Bootstrap Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>✅ Employee deleted successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      {isSidebarOpen && (
        <div className="sidebar">
          <button className="close-icon" onClick={toggleSidebar}>
            <i className="bi bi-x"></i>
          </button>
          <ul className="nav flex-column">
            <li className="nav-item" onClick={() => navigate("/createEmployee")}>
              <i className="bi bi-person-plus-fill"></i> Register Employee
            </li>
            <li className="nav-item" onClick={() => navigate("/viewEmployee")}>
              <i className="bi bi-people-fill"></i> View Employees
            </li>
            <li className="nav-item" onClick={() => navigate("/attendance")}>
              <i className="bi bi-calendar-check-fill"></i> Attendance
            </li>
            <li className="nav-item" onClick={() => navigate("/leave")}>
              <i className="bi bi-file-earmark-text-fill"></i> Leaves
            </li>
            <li className="nav-item" onClick={() => navigate("/shift")}>
              <i className="bi bi-clock-fill"></i> Shifts
            </li>
            <li className="nav-item" onClick={() => navigate("/reports")}>
              <i className="bi bi-bar-chart-line-fill"></i> Reports
            </li>
            <li className="nav-item" onClick={() => navigate("/profile")}>
              <i className="bi bi-person-fill"></i> Profile
            </li>
            <li className="nav-item text-danger fw-bold" onClick={handleDeletePopup}>
              <i className="bi bi-trash-fill"></i> Delete Employee
            </li>
            <li className="nav-item text-danger fw-bold" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </li>
          </ul>
        </div>
      )}

      {/* ✅ Delete Employee Modal */}
      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Employee Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {warningMessage && <p className="text-warning fw-bold">{warningMessage}</p>}
          <Form>
            <Form.Group>
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Employee</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Main Content */}
      <div className="main-content">
        <h2 className="main-heading">About Company</h2>
        <div className="content-container">
          <img src="/manager.gif" className="dashImg" alt="Presentation Board" />
          <div className="content">
            <p className="intro-text">
              As a global leader in digital transformation and technology solutions, we drive innovation, deliver strategic consulting, and empower businesses worldwide.
            </p>
            <div className="list-container">
              <div className="list-item">
                <h4>Innovation</h4>
                <p>Continuous improvements through AI and automation.</p>
              </div>
              <div className="list-item">
                <h4>Integrity</h4>
                <p>Trust and transparency in every engagement.</p>
              </div>
              <div className="list-item">
                <h4>Collaboration</h4>
                <p>Partnering with businesses to drive impactful solutions.</p>
              </div>
              <div className="list-item">
                <h4>Sustainability</h4>
                <p>Committing to responsible business practices.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ New Section: Company Vision */}
        <div className="section">
          <h3>Our Vision</h3>
          <p>To be the most trusted partner for businesses worldwide, enabling them to achieve their goals through cutting-edge technology and innovative solutions.</p>
          <ul>
            <li>Empower businesses with digital transformation.</li>
            <li>Foster a culture of innovation and creativity.</li>
            <li>Promote sustainability and ethical practices.</li>
            <li>Deliver exceptional value to our clients and stakeholders.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
