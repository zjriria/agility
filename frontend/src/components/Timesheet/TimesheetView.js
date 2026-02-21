import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import taskService from '../../services/taskService';
import timeTrackingService from '../../services/timeTrackingService';
import authService from '../../services/authService';

function TimesheetView() {
  const [entries, setEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hoursLogged: '',
    description: '',
    taskType: 'USER_STORY',
  });
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user?.id]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await timeTrackingService.getEntries({ userId: user?.id });
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await timeTrackingService.logTime({ ...newEntry, userId: user?.id, hoursLogged: parseFloat(newEntry.hoursLogged) });
      setShowModal(false);
      setNewEntry({ taskId: '', date: new Date().toISOString().split('T')[0], hoursLogged: '', description: '', taskType: 'USER_STORY' });
      loadEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await timeTrackingService.deleteEntry(id);
      loadEntries();
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + (e.hoursLogged || 0), 0);

  return (
    <div className="container-fluid py-3">
      <nav className="navbar navbar-light bg-white border-bottom mb-3 px-3">
        <span className="navbar-brand fw-bold text-primary">Agility</span>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary btn-sm">Board</Link>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Dashboard</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { authService.logout(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Timesheet</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Log Time</button>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6>Total Hours Logged</h6>
              <h3>{totalHours.toFixed(1)}h</h3>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Task ID</th>
                  <th>Type</th>
                  <th>Hours</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr><td colSpan="6" className="text-center text-muted py-4">No time entries yet</td></tr>
                ) : (
                  entries.map(entry => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td><code>{entry.taskId}</code></td>
                      <td><span className="badge bg-info text-dark">{entry.taskType}</span></td>
                      <td><strong>{entry.hoursLogged}h</strong></td>
                      <td>{entry.description}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(entry.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log Time</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task ID</label>
                    <input className="form-control" value={newEntry.taskId}
                      onChange={e => setNewEntry({ ...newEntry, taskId: e.target.value })} required />
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <label className="form-label">Date</label>
                      <input type="date" className="form-control" value={newEntry.date}
                        onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} required />
                    </div>
                    <div className="col mb-3">
                      <label className="form-label">Hours</label>
                      <input type="number" step="0.5" min="0.5" max="24" className="form-control"
                        value={newEntry.hoursLogged}
                        onChange={e => setNewEntry({ ...newEntry, hoursLogged: e.target.value })} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Task Type</label>
                    <select className="form-select" value={newEntry.taskType}
                      onChange={e => setNewEntry({ ...newEntry, taskType: e.target.value })}>
                      {['USER_STORY', 'BUG', 'TECHNICAL_TASK', 'SUPPORT', 'MEETING', 'TRAINING'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={newEntry.description}
                      onChange={e => setNewEntry({ ...newEntry, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Log Time</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimesheetView;
