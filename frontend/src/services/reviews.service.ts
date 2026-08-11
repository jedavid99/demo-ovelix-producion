import api from './api';

export const getReviews = async (params?: {
  page?: number;
  limit?: number;
  entidad?: string;
  entidad_id?: string;
}) => {
  const response = await api.get('/reviews', { params });
  return response.data;
};
