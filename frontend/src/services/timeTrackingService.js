import { api } from './authService';

const timeTrackingService = {
  logTime: (entry) => api.post('/api/time-entries', entry).then(r => r.data),

  getEntries: (params) => api.get('/api/time-entries', { params }).then(r => r.data),

  getEntryById: (id) => api.get(`/api/time-entries/${id}`).then(r => r.data),

  updateEntry: (id, entry) => api.put(`/api/time-entries/${id}`, entry).then(r => r.data),

  deleteEntry: (id) => api.delete(`/api/time-entries/${id}`).then(r => r.data),

  getUserCapacity: (userId, params) =>
    api.get(`/api/capacity/user/${userId}`, { params }).then(r => r.data),

  getTeamCapacity: (teamId, params) =>
    api.get(`/api/capacity/team/${teamId}`, { params }).then(r => r.data),

  getAlerts: (params) => api.get('/api/capacity/alerts', { params }).then(r => r.data),
};

export default timeTrackingService;
