import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Importing Modal from React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap for styling
import "./EditProfile.css"; // ✅ Custom CSS for layout improvements

const EditProfile = () => {
  // State to store the employee details
  const [employee, setEmployee] = useState(null);
  // State to store the fields to be updated
  const [updatedFields, setUpdatedFields] = useState([{ category: "", value: "", error: "" }]);
  // State to store error messages
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const MAX_FIELDS = 5;

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    /**
     * Fetch employee details based on the username stored in localStorage.
     */
    const fetchEmployeeData = async () => {
      try {
        // Ensure username exists before making the API call
        if (!username) {
          console.error("No username found in localStorage.");
          setError("Username not found. Please log in again.");
          return;
        }

        const response = await api.get(`employee/employee-username/${username}`);

        // Set the employee data if the response is successful
        setEmployee(response.data);
      } catch (err) {
        // Log error details for debugging
        console.error("Error fetching employee details:", err);

        // Display a user-friendly error message
        setError(err.response?.data || "Failed to load employee details.");
      }
    };

    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  /**
   * Add a new field to the list of fields to be updated.
   */
  const addField = () => {
    if (updatedFields.length >= MAX_FIELDS) {
      setModalMessage(`You can only update up to ${MAX_FIELDS} fields at a time.`);
      setShowModal(true);
      return;
    }
    setUpdatedFields([...updatedFields, { category: "", value: "", error: "" }]);
  };

  /**
   * Handle changes to the category dropdown for a specific field.
   * @param {number} index - The index of the field being updated.
   * @param {Object} event - The event object from the dropdown.
   */
  const handleCategoryChange = (index, event) => {
    const newFields = [...updatedFields];
    newFields[index].category = event.target.value;
    setUpdatedFields(newFields);
  };

  /**
   * Handle input changes for a specific field.
   * @param {number} index - The index of the field being updated.
   * @param {Object} event - The event object from the input field.
   */
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newFields = [...updatedFields];
    newFields[index].value = value;

    // Validate input based on the selected category
    if (newFields[index].category === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newFields[index].error = "Invalid email format!";
    } else if (newFields[index].category === "phoneNumber" && !/^\d{10}$/.test(value)) {
      newFields[index].error = "Phone number must be 10 digits!";
    } else if (newFields[index].category === "password" && value.length < 8) {
      newFields[index].error = "Password must be at least 8 characters long!";
    } else {
      newFields[index].error = "";
    }

    setUpdatedFields(newFields);
  };

  /**
   * Remove a field from the list of fields to be updated.
   * @param {number} index - The index of the field to be removed.
   */
  const removeField = (index) => {
    setUpdatedFields(updatedFields.filter((_, i) => i !== index));
  };

  /**
   * Handle the profile update by sending the updated fields to the API.
   */
  const handleUpdateProfile = async () => {
    // Validation: Check for empty fields and show error if any
    let hasError = false;
    const newFields = updatedFields.map((field) => {
      let error = "";
      if (!field.category) {
        error = "Category is required!";
        hasError = true;
      } else if (!field.value) {
        error = "Value is required!";
        hasError = true;
      }
      return { ...field, error };
    });

    setUpdatedFields(newFields);

    if (hasError) {
      setModalMessage("All fields must be selected and filled in before updating.");
      setShowModal(true);
      return;
    }

    try {
      // Ensure there is at least one field to update
      if (!employee || updatedFields.length === 0) {
        setModalMessage("Please add at least one field to update.");
        setShowModal(true);
        return;
      }

      // Prepare the data to be sent to the API
      const updatedData = updatedFields.reduce((acc, field) => {
        if (field.category && field.value && !field.error) {
          acc[field.category] = field.value;
        }
        return acc;
      }, {});

      // Send the update request to the API
      await api.patch(`employee/update/employee-record/${employee.employeeId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      setModalMessage("Profile updated successfully!");
      setShowModal(true);
      navigate("/profile");
    } catch (err) {
      // Log error details for debugging
      console.error("Error updating employee profile:", err);
      setModalMessage(err.response?.data || "Failed to update profile.");
      setShowModal(true);
    }
  };

  return (
    <div className="container-lg w-100 mx-auto p-4">
      <h2 className="text-center mb-4">Edit Profile</h2>

      {/* Display error messages */}
      {error && <div className="alert alert-danger">{error}</div>}

      {employee ? (
        <div className="card shadow-lg p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Update Your Profile</h4>
            <button
              className="btn btn-primary"
              onClick={addField}
              disabled={updatedFields.length >= MAX_FIELDS}
            >
              ➕ Add Field
            </button>
          </div>

          {updatedFields.length > 0 && (
            <div className="row g-3">
              {updatedFields.map((field, index) => (
                <div key={index} className="col-md-6">
                  
                  <label className="form-label">Select Category:</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleCategoryChange(index, e)}
                    value={field.category}
                  >
                    <option value="">Select Category</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="username">Username</option>
                    <option value="password">Password</option>
                    <option value="phoneNumber">Phone Number</option>
                  </select>

                  {field.category && (
                    <>
                      <input
                        className={`form-control mt-2 ${field.error ? "is-invalid" : ""}`}
                        type={field.category === "password" ? "password" : "text"}
                        value={field.value}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder={`Enter new ${field.category.replace(/([A-Z])/g, " $1")}`}
                      />
                      {field.error && <div className="invalid-feedback">{field.error}</div>}
                    </>
                  )}

                  {updatedFields.length > 1 && (
                    <button className="btn btn-danger mt-2" onClick={() => removeField(index)}>❌ Remove</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end gap-3 mt-4">
            <button className="btn btn-success" onClick={handleUpdateProfile}>✅ Save Changes</button>
            <button className="btn btn-secondary" onClick={() => navigate("/profile")}>❌ Cancel</button>
          </div>
        </div>
      ) : (
        !error && <p className="text-center text-muted">Loading employee details...</p>
      )}

      {/* Modal for displaying messages */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditProfile;
