import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { toast } from '@/shared/components/ui/use-toast';
import type { Role, RoleFormData } from '../types';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoadError(null)
    try {
      const response = await api.get('/roles');
      const data = response.data.data.data;
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
      setLoadError('Error al cargar los roles. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleCreate = async (data: RoleFormData) => {
    await api.post('/roles', data);
    setShowModal(false);
    fetchRoles();
  };

  const handleEdit = async (id: string, data: RoleFormData) => {
    await api.put(`/roles/${id}`, data);
    setEditingRole(null);
    fetchRoles();
  };

  const handleDelete = async (role: Role) => {
    try {
      await api.delete(`/roles/${role.id}`);
      setDeletingRole(null);
      fetchRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Error al eliminar el rol', variant: 'destructive' });
    }
  };

  return {
    roles, loading, loadError, showModal, editingRole, deletingRole,
    setShowModal, setEditingRole, setDeletingRole,
    handleCreate, handleEdit, handleDelete,
  };
}
