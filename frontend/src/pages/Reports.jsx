import { useState, useEffect } from 'react';
import * as reportsApi from '../api/reports';
import * as sprintsApi from '../api/sprints';
import * as projectsApi from '../api/projects';

const styles = {
  heading: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' },
  section: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '12px' },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
    marginRight: '12px',
    minWidth: '200px',
  },
  filterRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '12px',
  },
  th: {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '8px 12px',
    fontSize: '14px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
  },
  bar: {
    height: '24px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    minWidth: '30px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
  },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#1976d2' },
  statLabel: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  empty: { textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '14px' },
};

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('');
  const [progress, setProgress] = useState(null);
  const [burndown, setBurndown] = useState(null);
  const [velocity, setVelocity] = useState(null);
  const [workload, setWorkload] = useState(null);

  useEffect(() => {
    projectsApi.getAll().then((res) => {
      setProjects(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setSprints([]);
      return;
    }
    sprintsApi.getByProjectId(selectedProject).then((res) => {
      setSprints(Array.isArray(res.data) ? res.data : []);
    }).catch(() => setSprints([]));
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedSprint) {
      setProgress(null);
      setBurndown(null);
      setVelocity(null);
      return;
    }
    reportsApi.getSprintProgress(selectedSprint).then((res) => setProgress(res.data)).catch(() => setProgress(null));
    reportsApi.getBurndown(selectedSprint).then((res) => setBurndown(res.data)).catch(() => setBurndown(null));
    reportsApi.getVelocity(selectedSprint).then((res) => setVelocity(res.data)).catch(() => setVelocity(null));
  }, [selectedSprint]);

  useEffect(() => {
    if (!selectedProject) {
      setWorkload(null);
      return;
    }
    reportsApi.getTeamWorkload(selectedProject).then((res) => setWorkload(res.data)).catch(() => setWorkload(null));
  }, [selectedProject]);

  const renderProgressBar = (value, max, color) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div style={{ backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ ...styles.bar, width: `${Math.max(pct, 5)}%`, backgroundColor: color }}>
          {pct}%
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={styles.heading}>Reports</h1>

      <div style={styles.filterRow}>
        <div>
          <label style={styles.label}>Project: </label>
          <select style={styles.select} value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); setSelectedSprint(''); }}>
            <option value="">Select a project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label style={styles.label}>Sprint: </label>
          <select style={styles.select} value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)} disabled={!selectedProject}>
            <option value="">Select a sprint</option>
            {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {selectedSprint && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Sprint Progress</h2>
            {progress ? (
              <div>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{progress.completionPercentage ?? progress.percentComplete ?? 0}%</div>
                    <div style={styles.statLabel}>Complete</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{progress.totalTasks ?? 0}</div>
                    <div style={styles.statLabel}>Total Tasks</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{progress.completedTasks ?? 0}</div>
                    <div style={styles.statLabel}>Completed</div>
                  </div>
                  <div style={styles.statCard}>
                    <div style={styles.statValue}>{progress.remainingTasks ?? (progress.totalTasks - progress.completedTasks) ?? 0}</div>
                    <div style={styles.statLabel}>Remaining</div>
                  </div>
                </div>
                {progress.tasksByStatus && (
                  <div>
                    <strong style={{ fontSize: '13px', color: '#475569' }}>By Status:</strong>
                    {Object.entries(progress.tasksByStatus).map(([status, count]) => (
                      <div key={status} style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span>{status}</span>
                          <span>{count}</span>
                        </div>
                        {renderProgressBar(count, progress.totalTasks, status === 'DONE' ? '#22c55e' : status === 'IN_PROGRESS' ? '#3b82f6' : '#94a3b8')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.empty}>No progress data available</div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Burndown</h2>
            {burndown && (Array.isArray(burndown) || burndown.dataPoints) ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Remaining</th>
                    <th style={styles.th}>Ideal</th>
                    <th style={styles.th}>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(burndown) ? burndown : burndown.dataPoints || []).map((point, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{point.date}</td>
                      <td style={styles.td}>{point.remaining ?? point.remainingEffort ?? 0}</td>
                      <td style={styles.td}>{point.ideal ?? point.idealRemaining ?? '-'}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <div style={{ ...styles.bar, width: `${Math.max((point.remaining ?? point.remainingEffort ?? 0) * 3, 10)}px`, backgroundColor: '#3b82f6', height: '16px', fontSize: '10px' }}>
                            {point.remaining ?? point.remainingEffort ?? 0}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.empty}>No burndown data available</div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Velocity</h2>
            {velocity ? (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statValue}>{velocity.currentVelocity ?? velocity.velocity ?? 0}</div>
                  <div style={styles.statLabel}>Current Velocity</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statValue}>{velocity.averageVelocity ?? velocity.average ?? 0}</div>
                  <div style={styles.statLabel}>Average Velocity</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statValue}>{velocity.committedPoints ?? velocity.committed ?? 0}</div>
                  <div style={styles.statLabel}>Committed</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statValue}>{velocity.completedPoints ?? velocity.completed ?? 0}</div>
                  <div style={styles.statLabel}>Completed</div>
                </div>
              </div>
            ) : (
              <div style={styles.empty}>No velocity data available</div>
            )}
          </div>
        </>
      )}

      {selectedProject && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Team Workload</h2>
          {workload && (Array.isArray(workload) || workload.members) ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Team Member</th>
                  <th style={styles.th}>Assigned Tasks</th>
                  <th style={styles.th}>Hours Logged</th>
                  <th style={styles.th}>Load Rate</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(workload) ? workload : workload.members || []).map((member, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{member.userName || member.name || member.userId}</td>
                    <td style={styles.td}>{member.assignedTasks ?? member.taskCount ?? 0}</td>
                    <td style={styles.td}>{member.hoursLogged ?? member.totalHours ?? 0}</td>
                    <td style={styles.td}>
                      {renderProgressBar(
                        member.loadRate ?? member.utilization ?? 0,
                        100,
                        (member.loadRate ?? member.utilization ?? 0) > 80 ? '#ef4444' : '#22c55e'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.empty}>No workload data available. Select a project above.</div>
          )}
        </div>
      )}

      {!selectedProject && !selectedSprint && (
        <div style={{ ...styles.section, ...styles.empty }}>
          Select a project and sprint above to view reports
        </div>
      )}
    </div>
  );
}
