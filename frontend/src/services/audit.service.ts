import api from './api';

export const getAuditLogs = async (params?: {
  page?: number;
  limit?: number;
  usuario_id?: string;
  entidad?: string;
}) => {
  const response = await api.get('/audit', { params });
  return response.data;
};

export const getAuditStats = async () => {
  const response = await api.get('/audit/stats');
  return response.data;
};
