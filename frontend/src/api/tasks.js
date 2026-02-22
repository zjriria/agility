import client from './client';

export const getAll = () => client.get('/tasks');
export const getByProjectId = (projectId) => client.get(`/tasks/project/${projectId}`);
export const getBySprintId = (sprintId) => client.get(`/tasks/sprint/${sprintId}`);
export const getByAssigneeId = (assigneeId) => client.get(`/tasks/assignee/${assigneeId}`);
export const getById = (id) => client.get(`/tasks/${id}`);
export const create = (task) => client.post('/tasks', task);
export const update = (id, task) => client.put(`/tasks/${id}`, task);
export const remove = (id) => client.delete(`/tasks/${id}`);
