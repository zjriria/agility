import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as projectsApi from '../api/projects';
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
  btnSmall: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '6px',
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
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  projectTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    cursor: 'pointer',
  },
  projectMeta: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  sprintsSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #e2e8f0',
  },
  sprintItem: {
    padding: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f1f5f9',
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
};

const statusColor = {
  PLANNED: { backgroundColor: '#dbeafe', color: '#1e40af' },
  ACTIVE: { backgroundColor: '#dcfce7', color: '#166534' },
  COMPLETED: { backgroundColor: '#f3f4f6', color: '#374151' },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [sprints, setSprints] = useState({});
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    methodology: 'SCRUM',
    theoreticalCapacity: '',
  });
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpand = async (projectId) => {
    if (expandedId === projectId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(projectId);
    if (!sprints[projectId]) {
      try {
        const res = await sprintsApi.getByProjectId(projectId);
        setSprints((prev) => ({ ...prev, [projectId]: Array.isArray(res.data) ? res.data : [] }));
      } catch {
        setSprints((prev) => ({ ...prev, [projectId]: [] }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await projectsApi.create({
        ...form,
        theoreticalCapacity: form.theoreticalCapacity ? Number(form.theoreticalCapacity) : null,
      });
      setForm({ name: '', description: '', methodology: 'SCRUM', theoreticalCapacity: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectsApi.remove(id);
      fetchProjects();
    } catch {
      setError('Failed to delete project');
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.heading}>Projects</h1>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
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
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Methodology</label>
              <select style={styles.select} value={form.methodology} onChange={(e) => setForm({ ...form, methodology: e.target.value })}>
                <option value="SCRUM">SCRUM</option>
                <option value="KANBAN">KANBAN</option>
              </select>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Theoretical Capacity</label>
              <input style={styles.input} type="number" value={form.theoreticalCapacity} onChange={(e) => setForm({ ...form, theoreticalCapacity: e.target.value })} />
            </div>
          </div>
          <button style={styles.btn} type="submit">Create Project</button>
        </form>
      )}

      {projects.map((project) => (
        <div key={project.id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={styles.projectTitle} onClick={() => handleExpand(project.id)}>
                {project.name}
              </div>
              <div style={styles.projectMeta}>
                {project.methodology} {project.theoreticalCapacity ? `• Capacity: ${project.theoreticalCapacity}` : ''}
              </div>
              {project.description && (
                <div style={{ ...styles.projectMeta, marginTop: '6px' }}>{project.description}</div>
              )}
            </div>
            <div style={styles.actions}>
              <button style={styles.btnSmall} onClick={() => navigate(`/projects/${project.id}/sprints`)}>
                Sprints
              </button>
              <button style={styles.btnSmall} onClick={() => navigate(`/projects/${project.id}/board`)}>
                Board
              </button>
              <button style={styles.btnDanger} onClick={() => handleDelete(project.id)}>
                Delete
              </button>
            </div>
          </div>

          {expandedId === project.id && (
            <div style={styles.sprintsSection}>
              <strong style={{ fontSize: '13px', color: '#475569' }}>Sprints</strong>
              {(sprints[project.id] || []).length === 0 ? (
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>No sprints yet</div>
              ) : (
                (sprints[project.id] || []).map((sprint) => (
                  <div key={sprint.id} style={styles.sprintItem}>
                    <span style={{ fontSize: '14px' }}>{sprint.name}</span>
                    <span style={{ ...styles.badge, ...(statusColor[sprint.status] || {}) }}>
                      {sprint.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {projects.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          No projects yet. Create your first project!
        </div>
      )}
    </div>
  );
}
