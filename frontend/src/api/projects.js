import client from './client';

export const getAll = () => client.get('/projects');
export const getById = (id) => client.get(`/projects/${id}`);
export const create = (project) => client.post('/projects', project);
export const update = (id, project) => client.put(`/projects/${id}`, project);
export const remove = (id) => client.delete(`/projects/${id}`);
