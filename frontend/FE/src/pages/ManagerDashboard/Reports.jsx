import React from 'react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container mt-4 p-4 rounded shadow-lg text-white"
      style={{
        minWidth: '50vh',
        background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
      }}
    >
      <h2 className="mb-4 text-center fw-bold">Select Report Type</h2>

      {/* Buttons for navigating to different report types */}
      <div className="d-flex flex-column gap-3">
        <button
          className="btn btn-light fw-bold shadow-sm"
          onClick={() => navigate('/reports/employee')}
        >
          Employee Report
        </button>

        <button
          className="btn btn-light fw-bold shadow-sm"
          onClick={() => navigate('/reports/attendance')}
        >
          Attendance Report
        </button>

        <button
          className="btn btn-light fw-bold shadow-sm"
          onClick={() => navigate('/reports/shift')}
        >
          Shift Report
        </button>

        <button
          className="btn btn-light fw-bold shadow-sm"
          onClick={() => navigate('/reports/leave')}
        >
          Leave Report
        </button>


      </div>
    </div>
  );
};

export default Reports;
