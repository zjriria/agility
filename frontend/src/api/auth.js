import client from './client';

export const login = (username, password) =>
  client.post('/users/auth/login', { username, password });

export const register = (user) =>
  client.post('/users/auth/register', user);
