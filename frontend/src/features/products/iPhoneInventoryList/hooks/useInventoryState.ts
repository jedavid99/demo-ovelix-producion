import { useState } from 'react';
import { useListCache } from '@/shared/hooks/useListCache';
import { stockIPhoneCacheKey, stockIPhoneData } from '@/shared/lib/dataCaches';
import type { iPhone, StatusFilter, SeriesOption } from '../types';

export function useInventoryState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState<SeriesOption>('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, refresh } = useListCache<iPhone[]>(
    stockIPhoneCacheKey(searchQuery, seriesFilter),
    () => stockIPhoneData(searchQuery, seriesFilter),
  );

  const iphones = data ?? [];
  const total = iphones.length;

  const statusFilter: StatusFilter = seriesFilter === 'All' ? 'All' : 'Available';

  return {
    searchQuery, setSearchQuery,
    seriesFilter, setSeriesFilter,
    conditionFilter, setConditionFilter,
    currentPage, setCurrentPage,
    iphones, total, loading, error,
    statusFilter,
    refetch: () => refresh(),
  };
}