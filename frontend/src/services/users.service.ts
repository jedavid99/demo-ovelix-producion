import api from './api';

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: any) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateSelf = async (data: any) => {
  const response = await api.patch('/users/me', data);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const changePassword = async (id: string, data: { currentPassword: string; newPassword: string }) => {
  const response = await api.post(`/users/${id}/change-password`, data);
  return response.data;
};
