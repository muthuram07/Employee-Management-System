import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard/ManagerDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/EmployeeDashboard/Profile.jsx';
import CreateEmployee from './pages/ManagerDashboard/CreateEmployee.jsx';
import ViewEmployee from './pages/ManagerDashboard/ViewEmployee.jsx';
import Leave from './pages/ManagerDashboard/Leave/Leave.jsx';
import Attendance from './pages/ManagerDashboard/Attendance/MarkAttendance.jsx';
import Shift from './pages/ManagerDashboard/Shift/Shift.jsx';
import ApplyLeave from './pages/ManagerDashboard/Leave/ApplyLeave.jsx';
import LeaveRequests from './pages/ManagerDashboard/Leave/LeaveRequests.jsx';
import ViewAttendance from './pages/ManagerDashboard/Attendance/ViewAttendance.jsx';
import CreateShift from './pages/ManagerDashboard/Shift/CreateShift.jsx';
import ShiftAllocation from './pages/ManagerDashboard/Shift/ShiftAllocation.jsx';
import GetAllShift from './pages/ManagerDashboard/Shift/GetAllShift.jsx';
import UpdateShift from './pages/ManagerDashboard/Shift/UpdateShift.jsx'
import ViewLeave from './pages/ManagerDashboard/Leave/ViewLeave.jsx';
import LeaveBalance from './pages/ManagerDashboard/Leave/LeaveBalance.jsx';
import EmpShift from './pages/EmployeeDashboard/EmpShift/EmpShift.jsx'
import ShiftSwap from './pages/EmployeeDashboard/EmpShift/ShiftSwap.jsx';
import ShiftSwapRequests from './pages/ManagerDashboard/Shift/ShiftSwapRequests.jsx';
import Reports from './pages/ManagerDashboard/Reports.jsx'
import AttendanceReports from './pages/Reports/AttendanceReport.jsx';
import ShiftReports from './pages/Reports/ShiftReport.jsx';
import LeaveReports from './pages/Reports/LeaveReport.jsx';
import EmployeeReports from './pages/Reports/EmployeeReport.jsx';
import EditProfile from './pages/EmployeeDashboard/EditProfile.jsx';
import EmpLeave from './pages/EmployeeDashboard/EmpLeave/EmpLeave.jsx';
import PendingLeaveRequests from './pages/ManagerDashboard/Leave/PendingLeaveRequests.jsx';
import "bootstrap/dist/css/bootstrap.min.css";

// 404 Not Found Component
function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-3 text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

function App() {
  // const token = localStorage.getItem('token');
  // const role = localStorage.getItem('role');

  return (
    <div className="App">
      <Router>
      <div className="app-content">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createEmployee" element={<CreateEmployee />} />
        <Route path="/viewEmployee" element={<ViewEmployee />} />
        <Route path="/leave" element={<Leave />} />
         <Route path="/applyLeave" element={<ApplyLeave />} />
        <Route path="/leaveRequests" element={<LeaveRequests />} /> 
         <Route path="/attendance" element={<Attendance />} />
         <Route path="/shift" element={<Shift />} />
         <Route path="/viewAttendance" element={<ViewAttendance />} />
         <Route path="/createShift" element={<CreateShift />} />
         <Route path="/allocatedShift" element={<ShiftAllocation />} />
         <Route path="/getAllShift" element={<GetAllShift />} />
         <Route path="/updateShift" element={<UpdateShift />} />
         <Route path="/viewLeave" element={<ViewLeave />} />
         <Route path="/leaveBalance" element={<LeaveBalance />} />
         <Route path="/empShift" element={<EmpShift />} />
         <Route path="/shiftSwap" element={<ShiftSwap />} />
         <Route path="/shiftSwapRequests" element={<ShiftSwapRequests />} />
         <Route path="/reports" element={<Reports />} />
         <Route path="/reports/attendance" element={<AttendanceReports/>}/>
         <Route path="/reports/shift" element={<ShiftReports/>}/>
         <Route path="/reports/leave" element={<LeaveReports/>}/>
         <Route path="/reports/employee" element={<EmployeeReports/>}/>
         <Route path="/edit-profile" element={<EditProfile/>}/>
         <Route path="/empLeave" element={<EmpLeave/>}/>
         <Route path="/pendingLeaveRequests" element={<PendingLeaveRequests/>}/>
         {/* 404 Route - keep this as the last Route */}
         <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      
    </Router>
    </div>
    
  );
}

export default App;

