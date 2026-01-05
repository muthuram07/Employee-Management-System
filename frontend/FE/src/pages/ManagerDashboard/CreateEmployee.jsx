import React, { useState, useEffect } from "react";
import { authApi, api } from "../../service/api"; // Import API instances
import "./CreateEmployee.css";
import DatePicker from "react-datepicker";
import { Modal, Button } from "react-bootstrap";

const RegisterEmployee = () => {
  const [employee, setEmployee] = useState({
    employeeId: "",
    managerId: localStorage.getItem("employeeId") || "", // Auto-filled from logged-in user
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "",
    shiftId: "",
    joinedDate: ""
  });

  const [availableShifts, setAvailableShifts] = useState([]); // For dropdown
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); //  Error handling for existing employee
  const [showErrorPopup, setShowErrorPopup] = useState(false); //  Added state to control error modal
  const [successMessage, setSuccessMessage] = useState(""); // Add this for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Add this for success popup

  useEffect(() => {
    // Fetch logged-in employee details and update managerId
    const fetchLoggedInEmployee = async () => {
      try {
        const response = await api.get(`employee/employee-username/${localStorage.getItem("username")}`);
        setEmployee((prev) => ({ ...prev, managerId: response.data.employeeId })); // Set managerId automatically
      } catch (error) {
        console.error("Error fetching logged-in employee data:", error);
      }
    };

    // Fetch available shifts for dropdown
    const fetchShifts = async () => {
      try {
        const response = await api.get("/shift/get-all-shift-records");
        setAvailableShifts(response.data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    fetchLoggedInEmployee();
    fetchShifts();
  }, []);

  const isWeekday = (date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation Patterns
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation Rules
    if (employee.employeeId < 1) {
      setErrorMessage("Employee ID must be greater than zero.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.managerId < 1) {
      setErrorMessage("Manager ID must be greater than zero.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.username.length < 2 || employee.username.length > 50) {
      setErrorMessage("Username must be between 2 and 50 characters.");
      setShowErrorPopup(true);
      return;
    }

    if (!passwordRegex.test(employee.password)) {
      setErrorMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.firstName.length < 2 || employee.firstName.length > 50) {
      setErrorMessage("First name must be between 2 and 50 characters.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.lastName.length < 2 || employee.lastName.length > 50) {
      setErrorMessage("Last name must be between 2 and 50 characters.");
      setShowErrorPopup(true);
      return;
    }

    if (!emailRegex.test(employee.email)) {
      setErrorMessage("Email should be valid.");
      setShowErrorPopup(true);
      return;
    }

    if (!phoneRegex.test(employee.phoneNumber)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.department.length < 2 || employee.department.length > 50) {
      setErrorMessage("Department must be between 2 and 50 characters.");
      setShowErrorPopup(true);
      return;
    }

    if (employee.role.length < 2 || employee.role.length > 50) {
      setErrorMessage("Role must be between 2 and 50 characters.");
      setShowErrorPopup(true);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (employee.joinedDate >= today) {
      setErrorMessage("Joined date must be in the past.");
      setShowErrorPopup(true);
      return;
    }

    try {
      await authApi.post("/register", {
        ...employee,
        shiftId: Number(employee.shiftId), // Ensure shiftId is sent as a number
      });
      setSuccessMessage("Employee registered successfully!");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error registering employee:", error);

      if (error.response && error.response.status === 404) {
        setErrorMessage("❌ Employee already registered!");
        setShowErrorPopup(true);
      } else {
        setErrorMessage("❌ Registration failed. Please try again.");
        setShowErrorPopup(true);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Register Employee</h2>

     {/* ✅ Show error message if Employee Already Registered */}
     {errorMessage && <p className="text-danger text-center fw-bold">{errorMessage}</p>}

      <form className="card p-4 shadow-lg" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Employee ID</label>
            <input type="number" className="form-control" name="employeeId" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Manager ID</label>
            <input type="number" className="form-control" name="managerId" value={employee.managerId} readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" name="firstName" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" name="lastName" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control" name="password" onChange={handleChange} required />
              <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? "👁 Hide" : "🔍 Show"}
              </button>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-control" name="phoneNumber" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Department</label>
            <input type="text" className="form-control" name="department" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Shift ID</label>
            <select
              className="form-select"
              name="shiftId"
              value={employee.shiftId}
              onChange={handleChange}
              required
            >
              <option value="">Select Shift</option>
              {availableShifts.map((shift) => (
                <option key={shift.shiftId} value={shift.shiftId}>
                  {shift.shiftId}  ({shift.shiftStartTime} - {shift.shiftEndTime})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
  <label className="form-label">Joined Date</label>
  <div className="input-group">
    <span className="input-group-text"><i className="bi bi-calendar"></i></span> {/* Bootstrap Calendar Icon */}
    <DatePicker
      selected={employee.joinedDate}
      onChange={(date) => setEmployee({ ...employee, joinedDate: date })}
      filterDate={isWeekday} 
      dateFormat="yyyy-MM-dd"
      className="form-control"
      maxDate={new Date()} // Prevent selection of future dates
      required
    />
  </div>

          </div>
          <div className="col-md-6 mb-3">
  <label className="form-label">Role</label>
  <select className="form-select" name="role" onChange={handleChange} required>
    <option value="" disabled selected>Select Role</option> 
    <option value="ROLE_EMPLOYEE">Employee</option>
    <option value="ROLE_MANAGER">Manager</option>
  </select>
</div>
        </div>
        <button type="submit" className="btn btn-success w-100 mt-3">Register Employee</button>
      </form>

      {/* Error Modal Popup */}
      <Modal show={showErrorPopup} onHide={() => setShowErrorPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger fw-bold">{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorPopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal Popup */}
      <Modal show={showSuccessPopup} onHide={() => setShowSuccessPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-success fw-bold">{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessPopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterEmployee;
