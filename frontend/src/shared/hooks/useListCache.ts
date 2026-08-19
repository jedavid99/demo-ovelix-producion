import { useCallback, useEffect, useRef, useState } from 'react';
import { getListCache } from '@/shared/lib/listCache';

export interface UseListCacheResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useListCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ...extraDeps: unknown[]
): UseListCacheResult<T> {
  const initialCache = getListCache<T>(cacheKey);
  const cacheRef = useRef(initialCache);
  const fetcherRef = useRef(fetcher);

  const [data, setData] = useState<T | null>(() => initialCache.get());
  const [loading, setLoading] = useState<boolean>(() => !initialCache.get());
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      if (!cacheRef.current.get()) setLoading(true);
      setError(null);
      const result = await cacheRef.current.fetch(() => fetcherRef.current());
      setData(result);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      if (!cacheRef.current.get()) setError(e?.response?.data?.message || e?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cacheRef.current = getListCache<T>(cacheKey);
    fetcherRef.current = fetcher;
  }, [cacheKey, fetcher]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        if (!cacheRef.current.get()) setLoading(true);
        setError(null);
        const result = await cacheRef.current.fetch(() => fetcherRef.current());
        if (active) setData(result);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        if (active && !cacheRef.current.get()) setError(e?.response?.data?.message || e?.message || 'Error al cargar los datos');
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [cacheKey, ...extraDeps]);

  return { data, loading, error, refresh };
}