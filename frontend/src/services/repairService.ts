import api from './api';
import { Repair, RepairCreate, RepairUpdate, RepairFilters, PaginatedResponse, RepairStatusUpdate } from '@/types/repair.types';

export const repairService = {
  // Listar reparaciones con paginación y filtros
  list: (filters?: RepairFilters): Promise<PaginatedResponse<Repair>> => {
    return api.get('/repairs', { params: filters }).then(res => res.data);
  },

  // Obtener una reparación por ID
  getById: (id: string): Promise<Repair> => {
    return api.get(`/repairs/${id}`).then(res => res.data);
  },

  // Crear una nueva reparación
  create: (data: RepairCreate): Promise<Repair> => {
    return api.post('/repairs', data).then(res => res.data);
  },

  // Actualizar una reparación
  update: (id: string, data: RepairUpdate): Promise<Repair> => {
    return api.put(`/repairs/${id}`, data).then(res => res.data);
  },

  // Eliminar una reparación
  delete: (id: string): Promise<void> => {
    return api.delete(`/repairs/${id}`).then(res => res.data);
  },

  // Cambiar estado de una reparación
  updateStatus: (id: string, data: RepairStatusUpdate): Promise<Repair> => {
    // Convertir estado a mayúsculas para el backend
    const backendData = {
      ...data,
      estado: data.estado.toUpperCase() as any
    };
    return api.patch(`/repairs/${id}/estado`, backendData).then(res => res.data);
  },

  // Completar una reparación
  complete: (id: string, data?: { costo_final?: number; notas?: string }): Promise<Repair> => {
    return api.patch(`/repairs/${id}/complete`, data).then(res => res.data);
  },

  // Asignar técnico
  assignTechnician: (id: string, tecnico_id: string): Promise<Repair> => {
    return api.patch(`/repairs/${id}/assign`, { tecnico_id }).then(res => res.data);
  },

  // Agregar repuesto usado
  addPart: (id: string, part: { repuesto_id: string; cantidad: number }): Promise<Repair> => {
    return api.post(`/repairs/${id}/parts`, part).then(res => res.data);
  },

  // Obtener reparaciones por cliente
  getByClient: (cliente_id: string, filters?: RepairFilters): Promise<PaginatedResponse<Repair>> => {
    return api.get(`/clients/${cliente_id}/repairs`, { params: filters }).then(res => res.data);
  },

  // Obtener reparaciones por técnico
  getByTechnician: (tecnico_id: string, filters?: RepairFilters): Promise<PaginatedResponse<Repair>> => {
    return api.get(`/technicians/${tecnico_id}/repairs`, { params: filters }).then(res => res.data);
  }
};
