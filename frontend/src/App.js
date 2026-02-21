import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import KanbanBoard from './components/Board/KanbanBoard';
import SprintBoard from './components/Sprint/SprintBoard';
import TimesheetView from './components/Timesheet/TimesheetView';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />
        <Route path="/board/:projectId" element={<PrivateRoute><KanbanBoard /></PrivateRoute>} />
        <Route path="/sprint/:sprintId" element={<PrivateRoute><SprintBoard /></PrivateRoute>} />
        <Route path="/timesheet" element={<PrivateRoute><TimesheetView /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
