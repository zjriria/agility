import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as sprintsApi from '../api/sprints';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b' },
  btn: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  btnDanger: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '12px',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  field: { marginBottom: '12px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  row: { display: 'flex', gap: '12px' },
};

const statusColor = {
  PLANNED: { backgroundColor: '#dbeafe', color: '#1e40af' },
  ACTIVE: { backgroundColor: '#dcfce7', color: '#166534' },
  COMPLETED: { backgroundColor: '#f3f4f6', color: '#374151' },
};

export default function Sprints() {
  const { projectId } = useParams();
  const [sprints, setSprints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    durationWeeks: '',
    status: 'PLANNED',
  });

  const fetchSprints = async () => {
    try {
      const res = await sprintsApi.getByProjectId(projectId);
      setSprints(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load sprints');
    }
  };

  useEffect(() => {
    let ignore = false;
    sprintsApi.getByProjectId(projectId).then((res) => {
      if (!ignore) setSprints(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {
      if (!ignore) setError('Failed to load sprints');
    });
    return () => { ignore = true; };
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await sprintsApi.create({
        ...form,
        projectId,
        durationWeeks: form.durationWeeks ? Number(form.durationWeeks) : null,
      });
      setForm({ name: '', goal: '', startDate: '', endDate: '', durationWeeks: '', status: 'PLANNED' });
      setShowForm(false);
      fetchSprints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sprint');
    }
  };

  const handleDelete = async (id) => {
    try {
      await sprintsApi.remove(id);
      fetchSprints();
    } catch {
      setError('Failed to delete sprint');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Sprints</h1>
          <Link to="/projects" style={{ fontSize: '13px', color: '#64748b' }}>← Back to Projects</Link>
        </div>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Sprint'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Goal</label>
            <input style={styles.input} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Start Date</label>
              <input style={styles.input} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>End Date</label>
              <input style={styles.input} type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Duration (weeks)</label>
              <input style={styles.input} type="number" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })} />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select style={styles.select} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="PLANNED">PLANNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
          <button style={styles.btn} type="submit">Create Sprint</button>
        </form>
      )}

      {sprints.map((sprint) => (
        <div key={sprint.id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{sprint.name}</div>
              {sprint.goal && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{sprint.goal}</div>}
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                {sprint.startDate} → {sprint.endDate}
                {sprint.durationWeeks ? ` (${sprint.durationWeeks} weeks)` : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ ...styles.badge, ...(statusColor[sprint.status] || {}) }}>
                {sprint.status}
              </span>
              <Link to={`/projects/${projectId}/board`} style={{ ...styles.btn, fontSize: '12px', padding: '6px 12px', textDecoration: 'none' }}>
                Board
              </Link>
              <button style={styles.btnDanger} onClick={() => handleDelete(sprint.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {sprints.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          No sprints yet. Create your first sprint!
        </div>
      )}
    </div>
  );
}
