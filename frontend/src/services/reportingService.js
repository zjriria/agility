import { api } from './authService';

const reportingService = {
  getSprintReport: (sprintId) =>
    api.get(`/api/reports/sprint/${sprintId}`).then(r => r.data),

  getBurndownData: (sprintId) =>
    api.get(`/api/reports/burndown/${sprintId}`).then(r => r.data),

  getVelocity: (projectId) =>
    api.get(`/api/reports/velocity/${projectId}`).then(r => r.data),

  getCapacityReport: (projectId) =>
    api.get(`/api/reports/capacity/${projectId}`).then(r => r.data),

  exportReport: (sprintId, format = 'pdf') =>
    api.get(`/api/reports/export/${sprintId}`, {
      params: { format },
      responseType: 'blob',
    }).then(r => r.data),
};

export default reportingService;
