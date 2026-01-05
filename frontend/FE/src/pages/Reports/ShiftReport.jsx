import React, { useState } from 'react';
import { api } from '../../service/api';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const ShiftReports = () => {
  const [shiftData, setShiftData] = useState([]);
  const [showHeaders, setShowHeaders] = useState(false); // ✅ Tracks header visibility
  const [error, setError] = useState(''); // ✅ State for error messages

  /**
   * Generate the shift report by fetching data from the API.
   */
  const generateShiftReport = async () => {
    try {
      const response = await api.get('shifts/get-all-shift-records'); // Adjust endpoint as needed
      setShiftData(response.data);
      setShowHeaders(true); // ✅ Show table headers once data is loaded
      setError(''); // ✅ Clear any previous errors
    } catch (error) {
      console.error('Error fetching shift data:', error);
      setError('❌ Failed to fetch shift data. Please try again.');
    }
  };

  /**
   * Format time to a more readable format (HH:MM AM/PM).
   * @param {string} time - The time string in HH:MM:SS format.
   * @returns {string} - The formatted time string.
   */
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour time to 12-hour format
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div className="container mt-4 px-4" style={{ minWidth: '100vh' }}>
      <h2 className="mb-4">Shift Reports</h2>

      {/* Error Message */}
      {error && <p className="text-danger fw-bold">{error}</p>}

      {/* Action Buttons */}
      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2 text-nowrap" onClick={generateShiftReport}>
          Generate Report
        </button>
        <button
          className="btn btn-primary me-2 text-nowrap"
          onClick={() => exportToPDF('shiftReport')}
          disabled={shiftData.length === 0} // ✅ Disable if no data
        >
          Export to PDF
        </button>
        <button
          className="btn btn-primary me-2 text-nowrap"
          onClick={() => exportToExcel('shiftReport')}
          disabled={shiftData.length === 0} // ✅ Disable if no data
        >
          Export to Excel
        </button>
      </div>

      {/* Shift Report Table */}
      <div className="table-responsive">
        <table id="shiftReport" className="table table-bordered table-striped">
          {showHeaders && ( // ✅ Show headers **only** after clicking "Generate Report"
            <thead className="table-dark">
              <tr>
                <th>Shift ID</th>
                <th>Shift Date</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
          )}
          <tbody>
            {shiftData.map((shift, index) => (
              <tr key={index}>
                <td>{shift.shiftId}</td>
                <td>{shift.shiftDate}</td>
                <td>{formatTime(shift.shiftStartTime)}</td>
                <td>{formatTime(shift.shiftEndTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftReports;
