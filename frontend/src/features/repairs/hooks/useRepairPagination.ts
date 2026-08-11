import { useState, useMemo } from 'react';
import type { Repair } from '../types/repairs.types';
import { PAGE_SIZE } from '../constants/repairs.constants';

export function useRepairPagination(filteredRepairs: Repair[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalFiltered = filteredRepairs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  const paginatedRepairs = useMemo(() => {
    return filteredRepairs.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [filteredRepairs, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedRepairs,
    totalPages,
    totalFiltered,
  };
}
