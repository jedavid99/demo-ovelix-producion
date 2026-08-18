import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { clientService } from '@/services/clientService';
import { Client, ClientCreate, ClientUpdate, ClientFilters, PaginatedResponse, ClientPurchase } from '@/types/client.types';
import { useLoading } from '@/contexts/LoadingContext';

export const useClients = (filters?: ClientFilters) => {
  const [data, setData] = useState<PaginatedResponse<Client> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clientService.list(filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useClient = (id: string) => {
  const [data, setData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await clientService.getById(id);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar cliente');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useClientMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading, setMessage: setGlobalMessage } = useLoading();

  const createClient = async (data: ClientCreate): Promise<Client | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Creando cliente...');
    setError(null);
    try {
      const response = await clientService.create(data);
      return response;
    } catch (err: any) {
      logger.error('useClientMutations.createClient - Error completo:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error al crear cliente';
      logger.error('useClientMutations.createClient - Error message:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const updateClient = async (id: string, data: ClientUpdate): Promise<Client | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Actualizando cliente...');
    setError(null);
    try {
      const response = await clientService.update(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Eliminando cliente...');
    setError(null);
    try {
      await clientService.delete(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      return false;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const activateClient = async (id: string): Promise<Client | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Activando cliente...');
    setError(null);
    try {
      const response = await clientService.activate(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al activar cliente');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const deactivateClient = async (id: string): Promise<Client | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Desactivando cliente...');
    setError(null);
    try {
      const response = await clientService.deactivate(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al desactivar cliente');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return { loading, error, createClient, updateClient, deleteClient, activateClient, deactivateClient };
};

export const useClientPurchases = (clientId: string) => {
  const [data, setData] = useState<ClientPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const response = await clientService.getCompras(clientId);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar compras');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
