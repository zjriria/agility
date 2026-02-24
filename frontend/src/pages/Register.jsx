import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    textAlign: 'center',
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  success: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#64748b',
  },
};

const roles = ['ADMINISTRATEUR', 'PRODUCT_OWNER', 'SCRUM_MASTER', 'DEVELOPPEUR', 'MANAGER'];

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'DEVELOPPEUR',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Agility</h1>
        <p style={styles.subtitle}>Create your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input style={styles.input} name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <select style={styles.select} name="role" value={form.role} onChange={handleChange}>
              {roles.map((r) => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div style={styles.link}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
