import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as timetrackingApi from '../api/timetracking';

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
    padding: '4px 10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  btnSmall: {
    padding: '4px 10px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '6px',
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
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '60px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  row: { display: 'flex', gap: '12px' },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderCollapse: 'collapse',
    overflow: 'hidden',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  td: {
    padding: '10px 16px',
    fontSize: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    display: 'flex',
    gap: '24px',
  },
  summaryItem: {
    fontSize: '13px',
    color: '#64748b',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#1976d2',
    fontSize: '18px',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
};

export default function TimeTracking() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hoursSpent: '',
    description: '',
  });

  const fetchEntries = async () => {
    try {
      const res = user?.id
        ? await timetrackingApi.getByUserId(user.id)
        : await timetrackingApi.getAll();
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load time entries');
    }
  };

  useEffect(() => {
    let ignore = false;
    const userId = user?.id;
    const request = userId ? timetrackingApi.getByUserId(userId) : timetrackingApi.getAll();
    request.then((res) => {
      if (!ignore) setEntries(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {
      if (!ignore) setError('Failed to load time entries');
    });
    return () => { ignore = true; };
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        hoursSpent: Number(form.hoursSpent),
        userId: user?.id,
      };
      if (editId) {
        await timetrackingApi.update(editId, payload);
      } else {
        await timetrackingApi.create(payload);
      }
      setForm({ taskId: '', date: new Date().toISOString().split('T')[0], hoursSpent: '', description: '' });
      setShowForm(false);
      setEditId(null);
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save time entry');
    }
  };

  const handleEdit = (entry) => {
    setForm({
      taskId: entry.taskId || '',
      date: entry.date || '',
      hoursSpent: entry.hoursSpent || '',
      description: entry.description || '',
    });
    setEditId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await timetrackingApi.remove(id);
      fetchEntries();
    } catch {
      setError('Failed to delete entry');
    }
  };

  const totalHours = entries.reduce((s, e) => s + (e.hoursSpent || 0), 0);
  const today = new Date().toISOString().split('T')[0];
  const todayHours = entries
    .filter((e) => e.date === today)
    .reduce((s, e) => s + (e.hoursSpent || 0), 0);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Time Tracking</h1>
        <button style={styles.btn} onClick={() => { setShowForm(!showForm); setEditId(null); }}>
          {showForm ? 'Cancel' : '+ Log Time'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.summary}>
        <div>
          <div style={styles.summaryValue}>{Math.round(totalHours * 10) / 10}h</div>
          <div style={styles.summaryItem}>Total Hours</div>
        </div>
        <div>
          <div style={styles.summaryValue}>{Math.round(todayHours * 10) / 10}h</div>
          <div style={styles.summaryItem}>Today</div>
        </div>
        <div>
          <div style={styles.summaryValue}>{entries.length}</div>
          <div style={styles.summaryItem}>Entries</div>
        </div>
      </div>

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Task ID</label>
              <input style={styles.input} value={form.taskId} onChange={(e) => setForm({ ...form, taskId: e.target.value })} required />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Date</label>
              <input style={styles.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Hours Spent</label>
              <input style={styles.input} type="number" step="0.25" value={form.hoursSpent} onChange={(e) => setForm({ ...form, hoursSpent: e.target.value })} required />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button style={styles.btn} type="submit">{editId ? 'Update Entry' : 'Log Time'}</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Task</th>
            <th style={styles.th}>Hours</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td style={styles.td}>{entry.date}</td>
              <td style={styles.td}>{entry.taskId}</td>
              <td style={styles.td}>{entry.hoursSpent}</td>
              <td style={styles.td}>{entry.description}</td>
              <td style={styles.td}>
                <button style={styles.btnSmall} onClick={() => handleEdit(entry)}>Edit</button>
                <button style={styles.btnDanger} onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }} colSpan={5}>
                No time entries yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
