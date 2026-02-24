import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as projectsApi from '../api/projects';
import * as tasksApi from '../api/tasks';
import * as timetrackingApi from '../api/timetracking';
import * as sprintsApi from '../api/sprints';

const styles = {
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    sprints: 0,
    tasks: 0,
    hours: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, sprintRes, taskRes, timeRes] = await Promise.allSettled([
          projectsApi.getAll(),
          sprintsApi.getAll(),
          tasksApi.getAll(),
          timetrackingApi.getAll(),
        ]);

        const projects = projRes.status === 'fulfilled' ? projRes.value.data : [];
        const sprints = sprintRes.status === 'fulfilled' ? sprintRes.value.data : [];
        const allTasks = taskRes.status === 'fulfilled' ? taskRes.value.data : [];
        const timeEntries = timeRes.status === 'fulfilled' ? timeRes.value.data : [];

        const activeSprints = Array.isArray(sprints)
          ? sprints.filter((s) => s.status === 'ACTIVE').length
          : 0;

        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const hoursThisWeek = Array.isArray(timeEntries)
          ? timeEntries
              .filter((e) => new Date(e.date) >= weekStart)
              .reduce((sum, e) => sum + (e.hoursSpent || 0), 0)
          : 0;

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          sprints: activeSprints,
          tasks: Array.isArray(allTasks) ? allTasks.length : 0,
          hours: Math.round(hoursThisWeek * 10) / 10,
        });
      } catch {
        // Stats will remain at defaults
      }
    };
    fetchStats();
  }, [user]);

  const cards = [
    { label: 'Total Projects', value: stats.projects },
    { label: 'Active Sprints', value: stats.sprints },
    { label: 'My Tasks', value: stats.tasks },
    { label: 'Hours This Week', value: stats.hours },
  ];

  return (
    <div>
      <h1 style={styles.heading}>Welcome back, {user?.fullName || user?.username || 'User'}!</h1>
      <p style={styles.subtitle}>Here&apos;s an overview of your workspace</p>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardValue}>{card.value}</div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
