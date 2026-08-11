import { useState, useEffect, useCallback } from 'react';
import { cashClosingService } from '@/services/cashClosingService';
import { CashClosingData, CashClosingFilters } from '@/types/cashClosing.types';
import { toast } from '@/shared/components/ui/use-toast';
import { useLoading } from '@/contexts/LoadingContext';

export const useCashClosing = (filters?: CashClosingFilters) => {
  const [data, setData] = useState<CashClosingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cashClosingService.list(filters);
      setData(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cierres de caja');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar los cierres de caja'
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useCashClosingByDate = (date: string) => {
  const [data, setData] = useState<CashClosingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const response = await cashClosingService.getByDate(date);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cierre de caja');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useCashClosingMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading, setMessage: setGlobalMessage } = useLoading();

  const createCashClosing = async (data: CashClosingData): Promise<CashClosingData | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Guardando cierre de caja...');
    setError(null);
    try {
      const response = await cashClosingService.create(data);
      toast({
        title: 'Éxito',
        description: 'Cierre de caja guardado correctamente'
      });
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al guardar cierre de caja');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar el cierre de caja'
      });
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const updateCashClosing = async (id: string, data: Partial<CashClosingData>): Promise<CashClosingData | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Actualizando cierre de caja...');
    setError(null);
    try {
      const response = await cashClosingService.update(id, data);
      toast({
        title: 'Éxito',
        description: 'Cierre de caja actualizado correctamente'
      });
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cierre de caja');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el cierre de caja'
      });
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const deleteCashClosing = async (id: string): Promise<boolean> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Eliminando cierre de caja...');
    setError(null);
    try {
      await cashClosingService.delete(id);
      toast({
        title: 'Éxito',
        description: 'Cierre de caja eliminado correctamente'
      });
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cierre de caja');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el cierre de caja'
      });
      return false;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    createCashClosing, 
    updateCashClosing, 
    deleteCashClosing 
  };
};
