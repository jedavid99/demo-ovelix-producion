import { useState, useMemo } from 'react';
import { useClientMutations } from '@/hooks/useClients';
import { useListCache } from '@/shared/hooks/useListCache';
import { clientsCacheKey, clientsData } from '@/shared/lib/dataCaches';
import type { Client, StatusFilter } from '../types/clients.types';

export function useClientsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const pageSize = 5;

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateAction, setDeactivateAction] = useState<'activate' | 'deactivate'>('deactivate');

  const { deleteClient, activateClient, deactivateClient, loading: mutationLoading } = useClientMutations();

  const { data: cachedClients, loading, error, refresh: refreshClients } = useListCache<Client[]>(
    clientsCacheKey(),
    () => clientsData(),
  );

  const clients = useMemo(() => cachedClients ?? [], [cachedClients]);

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
