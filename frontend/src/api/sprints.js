import client from './client';

export const getAll = () => client.get('/sprints');
export const getByProjectId = (projectId) => client.get(`/sprints/project/${projectId}`);
export const getById = (id) => client.get(`/sprints/${id}`);
export const create = (sprint) => client.post('/sprints', sprint);
export const update = (id, sprint) => client.put(`/sprints/${id}`, sprint);
export const remove = (id) => client.delete(`/sprints/${id}`);
