import { useState, useEffect, useCallback } from 'react';
import { saleService } from '@/services/saleService';
import { useListCache } from '@/shared/hooks/useListCache';
import { salesCacheKey, salesData } from '@/shared/lib/dataCaches';
import { Sale, SaleFilters, SaleListMeta } from '@/types/sale.types';

interface UseSalesResult {
  data: Sale[];
  meta: SaleListMeta | null;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSales = (filters?: SaleFilters): UseSalesResult => {
  const { data: result, loading, error, refresh } = useListCache<{ sales: Sale[]; meta: SaleListMeta | null }>(
    salesCacheKey(filters),
    () => salesData(filters),
  );

  return {
    data: result?.sales ?? [],
    meta: result?.meta ?? null,
    total: result?.meta?.total ?? result?.sales.length ?? 0,
    totalPages: result?.meta?.totalPages ?? 1,
    loading,
    error,
    refetch: refresh,
  };
};

export const useSale = (id: string) => {
  const [data, setData] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await saleService.getById(id);
      setData(response);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar la venta');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
