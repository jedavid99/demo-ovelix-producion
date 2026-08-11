import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { repairApi } from '../services/repairApi';
import { useRepairFilters } from './useRepairFilters';
import { useRepairPagination } from './useRepairPagination';
import { useRepairMutations } from './useRepairMutations';
import { toast } from '@/shared/components/ui/use-toast';
import type { Repair } from '../types/repairs.types';

export const useRepairList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [allRepairs, setAllRepairs] = useState<Repair[]>([]);
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsResponse = await repairApi.getClients(1000);
      const clientDniMap = (Array.isArray(clientsResponse) ? clientsResponse : []).reduce((acc: any, client: any) => {
        if (client.id) acc[client.id] = client.dni || null;
        return acc;
      }, {});
      const rawArray = await repairApi.getRepairs(1000, 'updated_at:desc');
      const repairsArray = (Array.isArray(rawArray) ? rawArray : []).map((r: any) => ({
        ...r,
        cliente_nombre: r.cliente_nombre || r.cliente?.nombre_completo || 'Cliente no especificado',
        dni: r.dni || r.cliente?.dni || clientDniMap[r.cliente_id] || null,
        problema_reportado: r.problema_reportado || 'Sin problema',
        categoria_dispositivo: r.categoria_dispositivo || 'Sin categoría',
        estado: r.estado?.toLowerCase() || r.estado,
      }));
      setAllRepairs(repairsArray);
      setTotalRepairs(
        (rawArray as any)?.total || repairsArray.length
      );
    } catch (error: any) {
      console.error('Error al cargar reparaciones:', error);
      setError(error?.response?.data?.message || error?.message || 'No se pudieron cargar las reparaciones');
      toast({ title: 'Error', description: 'No se pudieron cargar las reparaciones', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRepairs(); }, [loadRepairs]);
  useEffect(() => {
    if (location.state?.reload) {
      loadRepairs();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, loadRepairs, navigate]);

  const { filterStatus, setFilterStatus, searchQuery, setSearchQuery, filteredRepairs } = useRepairFilters(allRepairs);
  const { currentPage, setCurrentPage, paginatedRepairs, totalPages, totalFiltered } = useRepairPagination(filteredRepairs);
  const mutations = useRepairMutations(loadRepairs, allRepairs);

  const pendingToday = allRepairs.filter((r) => r.estado === 'pending' || r.estado === 'diagnostic').length;
  const expiringSoon = allRepairs.filter((r) => r.estado === 'waiting_parts').length;
  const readyToPickup = allRepairs.filter((r) => r.estado === 'ready').length;
  const totalRevenue = allRepairs.filter((r) => r.estado === 'delivered' && r.total_reparacion)
    .reduce((sum, r) => sum + (Number(r.total_reparacion) || 0), 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mutations.activeDropdown && mutations.dropdownRefs.current[mutations.activeDropdown] &&
          !mutations.dropdownRefs.current[mutations.activeDropdown].contains(event.target as Node)) {
        mutations.setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mutations.activeDropdown, mutations.dropdownRefs]);

  return {
    currentPage, setCurrentPage,
    filterStatus, setFilterStatus,
    searchQuery, setSearchQuery,
    loading, error, allRepairs, totalRepairs,
    ...mutations,
    pendingToday, expiringSoon, readyToPickup, totalRevenue,
    filteredRepairs, paginatedRepairs, totalPages, totalFiltered,
    loadRepairs,
  };
};
