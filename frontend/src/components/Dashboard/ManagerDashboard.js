import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import taskService from '../../services/taskService';
import reportingService from '../../services/reportingService';
import timeTrackingService from '../../services/timeTrackingService';
import authService from '../../services/authService';

function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [burndownData, setBurndownData] = useState(null);
  const [velocityData, setVelocityData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    taskService.getProjects().then(setProjects).catch(console.error);
    timeTrackingService.getAlerts({}).then(setAlerts).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      taskService.getSprints(selectedProject).then(setSprints).catch(console.error);
      reportingService.getVelocity(selectedProject).then(setVelocityData).catch(console.error);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedSprint) {
      reportingService.getBurndownData(selectedSprint).then(setBurndownData).catch(console.error);
    }
  }, [selectedSprint]);

  const handleExport = async (format) => {
    if (!selectedSprint) return;
    try {
      const blob = await reportingService.exportReport(selectedSprint, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sprint-report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const burndownChartData = burndownData
    ? burndownData.actualBurndown?.map((point, i) => ({
        date: point.date,
        actual: point.remainingPoints?.toFixed(1),
        ideal: burndownData.idealBurndown?.[i]?.remainingPoints?.toFixed(1),
      }))
    : [];

  return (
    <div className="container-fluid py-3">
      <nav className="navbar navbar-light bg-white border-bottom mb-3 px-3">
        <span className="navbar-brand fw-bold text-primary">Agility</span>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary btn-sm">Board</Link>
          <Link to="/timesheet" className="btn btn-outline-secondary btn-sm">Timesheet</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { authService.logout(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </nav>

      <h4 className="mb-3">Manager Dashboard</h4>

      {alerts.length > 0 && (
        <div className="alert alert-warning">
          <strong>⚠ Capacity Alerts:</strong>
          {alerts.map(a => (
            <span key={a.userId} className="badge ms-2 bg-warning text-dark">
              User {a.userId}: {a.alertLevel} ({a.loadRatePercentage?.toFixed(0)}%)
            </span>
          ))}
        </div>
      )}

      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" value={selectedProject || ''}
            onChange={e => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-select" value={selectedSprint || ''}
            onChange={e => setSelectedSprint(e.target.value)} disabled={!selectedProject}>
            <option value="">Select Sprint</option>
            {sprints.map(s => <option key={s.id} value={s.id}>Sprint {s.number}</option>)}
          </select>
        </div>
      </div>

      {selectedSprint && (
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleExport('pdf')}>
            📄 Export PDF
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleExport('excel')}>
            📊 Export Excel
          </button>
        </div>
      )}

      <div className="row g-3">
        {burndownChartData.length > 0 && (
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header fw-semibold">Burndown Chart</div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={burndownChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ideal" stroke="#6c757d" strokeDasharray="5 5" name="Ideal" />
                    <Line type="monotone" dataKey="actual" stroke="#0d6efd" name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {velocityData.length > 0 && (
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header fw-semibold">Team Velocity</div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sprintNumber" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="plannedPoints" fill="#6c757d" name="Planned" />
                    <Bar dataKey="completedPoints" fill="#0d6efd" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
