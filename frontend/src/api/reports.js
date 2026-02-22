import client from './client';

export const getSprintProgress = (sprintId) =>
  client.get(`/reports/sprint/${sprintId}/progress`);

export const getBurndown = (sprintId) =>
  client.get(`/reports/sprint/${sprintId}/burndown`);

export const getVelocity = (sprintId) =>
  client.get(`/reports/sprint/${sprintId}/velocity`);

export const getTeamWorkload = (projectId) =>
  client.get(`/reports/team/${projectId}/workload`);
