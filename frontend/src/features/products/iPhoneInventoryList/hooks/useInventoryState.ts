import { useState, useEffect, useCallback } from 'react';
import { stockService } from '@/services/stockService';
import type { StockItem } from '@/types/stock.types';
import type { iPhone, StatusFilter, SeriesOption } from '../types';

function mapStockItemToIPhone(item: StockItem): iPhone {
  const outOfStock = item.estado !== 'activo' || item.stock_actual <= 0;
  return {
    id: item.id,
    model: item.modelo || item.nombre,
    color: '',
    modelNumber: item.modelo || '',
    storage: '',
    imei: item.codigo,
    battery: 0,
    status: outOfStock ? 'Out of Stock' : 'Available',
    image: null,
  };
}

export function useInventoryState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState<SeriesOption>('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [iphones, setIPhones] = useState<iPhone[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.list({
        page: 1,
        limit: 200,
        search: searchQuery || undefined,
        categoria: seriesFilter !== 'All' ? seriesFilter : undefined,
      });
      const r = response as Record<string, unknown>;
      const inner = r?.data as Record<string, unknown> | undefined;
      const arr = (inner?.data as StockItem[] | undefined) ?? (inner as unknown as StockItem[]);
      const items = Array.isArray(arr) ? arr : [];
      setIPhones(items.map(mapStockItemToIPhone));
      setTotal((inner?.meta as { total?: number } | undefined)?.total ?? items.length);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar el inventario');
      setIPhones([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, seriesFilter]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock, refreshKey]);

  const statusFilter: StatusFilter = seriesFilter === 'All' ? 'All' : 'Available';

  return {
    searchQuery, setSearchQuery,
    seriesFilter, setSeriesFilter,
    conditionFilter, setConditionFilter,
    currentPage, setCurrentPage,
    iphones, total, loading, error,
    statusFilter,
    refetch: () => setRefreshKey(k => k + 1),
  };
}
