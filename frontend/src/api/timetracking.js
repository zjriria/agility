import client from './client';

export const getAll = () => client.get('/timetracking');
export const getByUserId = (userId) => client.get(`/timetracking/user/${userId}`);
export const getByTaskId = (taskId) => client.get(`/timetracking/task/${taskId}`);
export const getById = (id) => client.get(`/timetracking/${id}`);
export const create = (entry) => client.post('/timetracking', entry);
export const update = (id, entry) => client.put(`/timetracking/${id}`, entry);
export const remove = (id) => client.delete(`/timetracking/${id}`);
