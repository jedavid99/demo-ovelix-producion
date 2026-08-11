import { useState, useMemo } from 'react';
import type { Repair } from '../types/repairs.types';

export function useRepairFilters(allRepairs: Repair[]) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepairs = useMemo(() => {
    return allRepairs.filter((repair) => {
      const normalizedEstado = repair.estado?.toUpperCase().replace(/-/g, '_') || '';
      const normalizedFilter = filterStatus.toUpperCase();

      const matchesStatus = filterStatus === 'all' || normalizedEstado === normalizedFilter;
      const matchesSearch =
        repair.numero_reparacion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.cliente_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.dni?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allRepairs, filterStatus, searchQuery]);

  return {
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    filteredRepairs,
  };
}
