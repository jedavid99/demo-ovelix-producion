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

  logger.log('auth.service.login payload:', payload);

  try {
    const response = await api.post('/auth/login', payload);
    logger.log('auth.service.login response:', response.data);
    return response.data;
  } catch (error: any) {
    logger.error('auth.service.login error:', error);
    throw error;
  }
};

export const getMe = async () => {
  console.log('auth.service.getMe llamado');
  try {
    const response = await api.get('/auth/me');
    console.log('auth.service.getMe response:', response.data);
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
    console.log('auth.service.logout: Llamando a /auth/logout');
    const response = await api.post('/auth/logout');
    console.log('auth.service.logout: Respuesta del servidor', response.data);
    return response.data;
  } catch (error) {
    console.error('auth.service.logout: Error al llamar al endpoint', error);
    // No lanzamos el error porque queremos que el logout local siempre se complete
    throw error;
  }
};
