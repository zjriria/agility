import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import taskService from '../../services/taskService';
import authService from '../../services/authService';

const STATUS_COLORS = {
  TODO: 'secondary',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

function SprintBoard() {
  const { sprintId } = useParams();
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (sprintId) {
      loadData();
    }
  }, [sprintId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sprintData, tasksData] = await Promise.all([
        taskService.getSprintById(sprintId),
        taskService.getTasks({ sprintId }),
      ]);
      setSprint(sprintData);
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      await taskService.updateTask(taskId, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="container-fluid py-3">
      <nav className="navbar navbar-light bg-white border-bottom mb-3 px-3">
        <span className="navbar-brand fw-bold text-primary">Agility</span>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-secondary btn-sm">Kanban Board</Link>
          <Link to="/timesheet" className="btn btn-outline-secondary btn-sm">Timesheet</Link>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Dashboard</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { authService.logout(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </nav>

      {sprint && (
        <div className="mb-3">
          <h4>Sprint {sprint.number}: {sprint.goal}</h4>
          <div className="d-flex gap-3 text-muted small">
            <span>📅 {sprint.startDate} → {sprint.endDate}</span>
            <span className={`badge bg-${sprint.status === 'ACTIVE' ? 'success' : sprint.status === 'COMPLETED' ? 'secondary' : 'warning'}`}>
              {sprint.status}
            </span>
          </div>
        </div>
      )}

      <div className="btn-group mb-3" role="group">
        {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
          <button
            key={s}
            type="button"
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-2">
          {filteredTasks.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">No tasks found</div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="col-md-4 col-lg-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="card-title">{task.title}</h6>
                    <p className="card-text text-muted small">{task.description}</p>
                    <div className="d-flex gap-1 mb-2 flex-wrap">
                      <span className="badge bg-info text-dark" style={{ fontSize: '0.65rem' }}>{task.type}</span>
                      <span className={`badge bg-${STATUS_COLORS[task.status]}`} style={{ fontSize: '0.65rem' }}>{task.status}</span>
                      {task.estimation && (
                        <span className="badge bg-light text-dark border" style={{ fontSize: '0.65rem' }}>{task.estimation}h</span>
                      )}
                    </div>
                    <select
                      className="form-select form-select-sm"
                      value={task.status}
                      onChange={e => updateStatus(task.id, e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SprintBoard;
