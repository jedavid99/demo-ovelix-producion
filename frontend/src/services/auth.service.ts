import api from './api';
import { logger } from '@/utils/logger';

export const login = async (email: string, password: string, codigoEmpresa: string) => {
  const payload: any = {
    email,
    password: password,
  };

  // Solo agregar codigo_empresa si tiene valor
  if (codigoEmpresa && codigoEmpresa.trim() !== '') {
    payload.codigo_empresa = codigoEmpresa;
  }

  try {
    const response = await api.post('/auth/login', payload);
    return response.data;
  } catch (error: any) {
    logger.error('auth.service.login error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('auth.service.getMe error:', error);
    throw error;
  }
};

export const register = async (data: any) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('auth.service.logout: Error al llamar al endpoint', error);
    // No lanzamos el error porque queremos que el logout local siempre se complete
    throw error;
  }
};