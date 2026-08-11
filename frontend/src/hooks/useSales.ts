import { useState, useEffect, useCallback } from 'react';
import { saleService } from '@/services/saleService';
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
  const [data, setData] = useState<Sale[]>([]);
  const [meta, setMeta] = useState<SaleListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractSales = useCallback((response: unknown): { sales: Sale[]; meta: SaleListMeta | null } => {
    const r = response as Record<string, unknown>;
    const inner = r?.data as Record<string, unknown> | undefined;
    let arr = inner?.data as Sale[] | undefined;
    const innerMeta = (inner?.meta as SaleListMeta | undefined) || null;
    if (!Array.isArray(arr)) {
      arr = inner as unknown as Sale[];
    }
    if (!Array.isArray(arr)) {
      arr = [];
    }
    return { sales: arr, meta: innerMeta };
  }, []);

  const fetch = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const response = await saleService.list(filters);
      const { sales, meta: responseMeta } = extractSales(response);
      setData(sales);
      setMeta(responseMeta);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar ventas');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, extractSales]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    meta,
    total: meta?.total ?? data.length,
    totalPages: meta?.totalPages ?? 1,
    loading,
    error,
    refetch: fetch,
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
