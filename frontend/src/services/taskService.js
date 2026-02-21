import { api } from './authService';

const taskService = {
  createTask: (task) => api.post('/api/tasks', task).then(r => r.data),

  getTasks: (params) => api.get('/api/tasks', { params }).then(r => r.data),

  getTaskById: (id) => api.get(`/api/tasks/${id}`).then(r => r.data),

  updateTask: (id, task) => api.put(`/api/tasks/${id}`, task).then(r => r.data),

  deleteTask: (id) => api.delete(`/api/tasks/${id}`).then(r => r.data),

  getBacklog: (projectId) => api.get(`/api/backlog/${projectId}`).then(r => r.data),

  getProjects: () => api.get('/api/projects').then(r => r.data),

  createProject: (project) => api.post('/api/projects', project).then(r => r.data),

  getProjectById: (id) => api.get(`/api/projects/${id}`).then(r => r.data),

  getSprints: (projectId) => api.get(`/api/projects/${projectId}/sprints`).then(r => r.data),

  createSprint: (projectId, sprint) => api.post(`/api/projects/${projectId}/sprints`, sprint).then(r => r.data),

  getSprintById: (id) => api.get(`/api/sprints/${id}`).then(r => r.data),

  updateSprint: (id, sprint) => api.put(`/api/sprints/${id}`, sprint).then(r => r.data),

  getUsers: () => api.get('/api/users').then(r => r.data),
};

export default taskService;
