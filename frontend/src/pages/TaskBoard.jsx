import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as tasksApi from '../api/tasks';
import * as sprintsApi from '../api/sprints';

const columns = ['TODO', 'IN_PROGRESS', 'DONE'];
const columnLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const columnColors = { TODO: '#e2e8f0', IN_PROGRESS: '#bfdbfe', DONE: '#bbf7d0' };

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const priorityColors = {
  LOW: { backgroundColor: '#dbeafe', color: '#1e40af' },
  MEDIUM: { backgroundColor: '#fef3c7', color: '#92400e' },
  HIGH: { backgroundColor: '#fed7aa', color: '#9a3412' },
  CRITICAL: { backgroundColor: '#fecaca', color: '#991b1b' },
};

const types = ['USER_STORY', 'BUG', 'TECHNICAL_TASK'];
const categories = ['PROJECT', 'SUPPORT', 'MEETING', 'TRAINING', 'OTHER'];

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
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
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    minHeight: '400px',
  },
  column: {
    borderRadius: '8px',
    padding: '12px',
    minHeight: '300px',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '12px',
    color: '#475569',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'grab',
  },
  taskTitle: { fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  taskMeta: { fontSize: '12px', color: '#64748b', marginTop: '6px' },
  badge: {
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: '600',
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
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
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
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'center',
  },
};

export default function TaskBoard() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [filterSprint, setFilterSprint] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [draggedId, setDraggedId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'USER_STORY',
    category: 'PROJECT',
    priority: 'MEDIUM',
    estimation: '',
    assigneeId: '',
    sprintId: '',
  });

  const fetchTasks = async () => {
    try {
      let res;
      if (filterSprint) {
        res = await tasksApi.getBySprintId(filterSprint);
      } else if (projectId) {
        res = await tasksApi.getByProjectId(projectId);
      } else {
        res = await tasksApi.getAll();
      }
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadTasks = projectId
      ? tasksApi.getByProjectId(projectId)
      : tasksApi.getAll();
    loadTasks.then((res) => {
      if (!ignore) {
        let filtered = res.data;
        if (filterSprint) {
          filtered = filtered.filter((t) => String(t.sprintId) === String(filterSprint));
        }
        setTasks(Array.isArray(filtered) ? filtered : []);
      }
    }).catch(() => {
      if (!ignore) setError('Failed to load tasks');
    });

    if (projectId) {
      sprintsApi.getByProjectId(projectId).then((res) => {
        if (!ignore) setSprints(Array.isArray(res.data) ? res.data : []);
      }).catch(() => {});
    }
    return () => { ignore = true; };
  }, [projectId, filterSprint]);

  const handleDragStart = (e, taskId) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedId) return;
    const task = tasks.find((t) => t.id === draggedId);
    if (!task || task.status === newStatus) {
      setDraggedId(null);
      return;
    }
    try {
      await tasksApi.update(draggedId, { ...task, status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === draggedId ? { ...t, status: newStatus } : t)));
    } catch {
      setError('Failed to update task status');
    }
    setDraggedId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await tasksApi.create({
        ...form,
        projectId: projectId || undefined,
        estimation: form.estimation ? Number(form.estimation) : null,
        assigneeId: form.assigneeId || undefined,
        sprintId: form.sprintId || undefined,
      });
      setForm({
        title: '',
        description: '',
        type: 'USER_STORY',
        category: 'PROJECT',
        priority: 'MEDIUM',
        estimation: '',
        assigneeId: '',
        sprintId: '',
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Task Board</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {projectId && sprints.length > 0 && (
        <div style={styles.filterBar}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Filter by Sprint:</label>
          <select
            style={{ ...styles.select, width: 'auto', minWidth: '200px' }}
            value={filterSprint}
            onChange={(e) => setFilterSprint(e.target.value)}
          >
            <option value="">All Tasks</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Type</label>
              <select style={styles.select} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {types.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select style={styles.select} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select style={styles.select} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Estimation (hours)</label>
              <input style={styles.input} type="number" value={form.estimation} onChange={(e) => setForm({ ...form, estimation: e.target.value })} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Assignee ID</label>
              <input style={styles.input} value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Sprint</label>
              <select style={styles.select} value={form.sprintId} onChange={(e) => setForm({ ...form, sprintId: e.target.value })}>
                <option value="">No Sprint</option>
                {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <button style={styles.btn} type="submit">Create Task</button>
        </form>
      )}

      <div style={styles.board}>
        {columns.map((status) => (
          <div
            key={status}
            style={{ ...styles.column, backgroundColor: columnColors[status] }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div style={styles.columnTitle}>
              {columnLabels[status]} ({getColumnTasks(status).length})
            </div>
            {getColumnTasks(status).map((task) => (
              <div
                key={task.id}
                style={{ ...styles.taskCard, opacity: draggedId === task.id ? 0.5 : 1 }}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <div style={styles.taskTitle}>{task.title}</div>
                <div style={styles.taskMeta}>
                  <span style={{ ...styles.badge, ...(priorityColors[task.priority] || {}) }}>
                    {task.priority}
                  </span>
                  {task.type && (
                    <span style={{ ...styles.badge, backgroundColor: '#f1f5f9', color: '#475569' }}>
                      {task.type.replace('_', ' ')}
                    </span>
                  )}
                </div>
                {task.assigneeId && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Assignee: {task.assigneeId}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
