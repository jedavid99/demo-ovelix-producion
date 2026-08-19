import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRepairFilters } from './useRepairFilters';
import { useRepairPagination } from './useRepairPagination';
import { useRepairMutations } from './useRepairMutations';
import { toast } from '@/shared/components/ui/use-toast';
import { fetchRepairsData, getRepairsCache } from '../services/repairsCache';
import type { Repair } from '../types/repairs.types';

export const useRepairList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(() => !getRepairsCache());
  const [allRepairs, setAllRepairs] = useState<Repair[]>(() => getRepairsCache()?.repairs || []);
  const [totalRepairs, setTotalRepairs] = useState(() => getRepairsCache()?.total || 0);
  const [error, setError] = useState<string | null>(null);

  const loadRepairs = useCallback(async () => {
    try {
      const cached = getRepairsCache();
      if (!cached) setLoading(true);
      setError(null);
      const data = await fetchRepairsData();
      setAllRepairs(data.repairs);
      setTotalRepairs(data.total);
    } catch (error: any) {
      console.error('Error al cargar reparaciones:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar las reparaciones', variant: 'destructive' });
      if (!getRepairsCache()) {
        setError(error?.response?.data?.message || error?.message || 'No se pudieron cargar las reparaciones');
      }
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

  const pendingToday = allRepairs.filter((r) => r.estado === 'ingresado').length;
  const expiringSoon = allRepairs.filter((r) => r.estado === 'esperando_repuesto_local' || r.estado === 'esperando_repuesto_importacion').length;
  const readyToPickup = allRepairs.filter((r) => r.estado === 'listo_para_retirar').length;
  const totalRevenue = allRepairs.filter((r) => r.estado === 'entregado_al_cliente' && r.total_reparacion)
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
