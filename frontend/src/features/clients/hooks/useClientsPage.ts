import { useState, useMemo, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { useClientMutations } from '@/hooks/useClients';
import type { Client, StatusFilter } from '../types/clients.types';
import { PaginatedResponse } from '@/types/client.types';

export function useClientsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const pageSize = 5;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateAction, setDeactivateAction] = useState<'activate' | 'deactivate'>('deactivate');

  const { deleteClient, activateClient, deactivateClient, loading: mutationLoading } = useClientMutations();

  const extractClients = useCallback((response: unknown): Client[] => {
    const r = response as Record<string, unknown>;
    const d = r?.data as Record<string, unknown> | undefined;
    let arr = d?.data as Client[] | undefined;
    if (!Array.isArray(arr)) arr = d?.clientes as Client[] | undefined;
    if (!Array.isArray(arr)) arr = d as unknown as Client[];
    return Array.isArray(arr) ? arr : [];
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientService.list({ page: 1, limit: 100 });
      const arr = extractClients(response);
      setClients(arr);
      setTotal(arr.length);
    } catch (err: unknown) {
      console.error('[Clients] Error completo:', err);
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Error al cargar clientes');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [extractClients]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = clients;
    if (q) result = result.filter(c => c.nombre_completo?.toLowerCase().includes(q) || c.dni?.toLowerCase().includes(q) || c.telefono?.toLowerCase().includes(q));
    if (statusFilter !== 'all') result = result.filter(c => c.estado === statusFilter);
    return result;
  }, [clients, query, statusFilter]);

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onSearch = (value: string) => { setQuery(value); setPage(1); };
  const handleViewClient = (client: Client) => { setSelectedClient(client); setViewModalOpen(true); };
  const handleEditClient = (client: Client) => { setSelectedClient(client); setEditModalOpen(true); };
  const handleDeleteClick = (client: Client) => { setSelectedClient(client); setDeleteDialogOpen(true); };
  const handleDeactivateClick = (client: Client) => {
    setSelectedClient(client);
    setDeactivateAction(client.estado === 'activo' ? 'deactivate' : 'activate');
    setDeactivateDialogOpen(true);
  };

  const refreshClients = useCallback(async () => {
    const response = await clientService.list({ page: 1, limit: 100 });
    const arr = extractClients(response);
    setClients(arr);
    setTotal(arr.length);
  }, [extractClients]);

  const handleDeleteConfirm = async () => {
    if (!selectedClient?.id) return;
    try {
      await deleteClient(selectedClient.id);
      await refreshClients();
    } catch { /* ignore */ }
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedClient?.id) return;
    try {
      if (deactivateAction === 'deactivate') await deactivateClient(selectedClient.id);
      else await activateClient(selectedClient.id);
      await refreshClients();
    } catch { /* ignore */ }
  };

  const handleEditSuccess = () => { refreshClients(); };

  return {
    query, onSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages,
    paginatedData, totalFiltered, filtered,
    clients,
    loading, error,
    selectedClient,
    viewModalOpen, setViewModalOpen,
    editModalOpen, setEditModalOpen,
    deleteDialogOpen, setDeleteDialogOpen,
    deactivateDialogOpen, setDeactivateDialogOpen,
    deactivateAction,
    mutationLoading,
    handleViewClient, handleEditClient, handleDeleteClick, handleDeactivateClick,
    handleDeleteConfirm, handleDeactivateConfirm, handleEditSuccess,
  };
}
