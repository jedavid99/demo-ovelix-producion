import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { MdPerson } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { AsyncState } from '@/shared/components/async/AsyncState';
import { useClientsPage } from '../hooks/useClientsPage';
import { ClientsFilters } from '../components/ClientsFilters';
import { ClientsTable } from '../components/ClientsTable';
import { ClientsPagination } from '../components/ClientsPagination';
import ViewClientModal from '@/features/components/ViewClientModal';
import EditClientModal from '@/features/components/EditClientModal';
import DeleteClientDialog from '@/features/components/DeleteClientDialog';
import DeactivateClientDialog from '@/features/components/DeactivateClientDialog';

export default function ClientsPage() {
  const hook = useClientsPage();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu base de clientes ({hook.clients.length} registrados)</p>
        </div>
        <Link to="/clients/add">
          <Button className="gap-2"><Plus size={16} /> Nuevo cliente</Button>
        </Link>
      </div>

      <ClientsFilters query={hook.query} onSearch={hook.onSearch} statusFilter={hook.statusFilter} onStatusFilter={hook.setStatusFilter} totalFiltered={hook.totalFiltered} />

      <AsyncState
        loading={hook.loading}
        error={hook.error}
        empty={!hook.loading && !hook.error && hook.paginatedData.length === 0}
        onRetry={() => window.location.reload()}
        emptyIcon={MdPerson}
        emptyTitle={hook.query || hook.statusFilter !== 'all' ? 'No hay resultados' : 'No hay clientes aún'}
        emptyDescription={hook.query || hook.statusFilter !== 'all' ? 'Prueba con otros filtros o términos de búsqueda' : 'Comienza agregando tu primer cliente'}
        emptyActionLabel={!hook.query && hook.statusFilter === 'all' ? 'Agregar primer cliente' : undefined}
        onEmptyAction={() => navigate('/clients/add')}
      >
        <ClientsTable data={hook.paginatedData} onView={hook.handleViewClient} onEdit={hook.handleEditClient} onDeactivate={hook.handleDeactivateClick} onDelete={hook.handleDeleteClick} />
        <ClientsPagination page={hook.page} totalPages={hook.totalPages} totalFiltered={hook.totalFiltered} pageSize={5} onPageChange={hook.setPage} />
      </AsyncState>

      <ViewClientModal open={hook.viewModalOpen} onOpenChange={hook.setViewModalOpen} client={hook.selectedClient} />
      <EditClientModal open={hook.editModalOpen} onOpenChange={hook.setEditModalOpen} client={hook.selectedClient} onSuccess={hook.handleEditSuccess} />
      <DeleteClientDialog open={hook.deleteDialogOpen} onOpenChange={hook.setDeleteDialogOpen} client={hook.selectedClient} onConfirm={hook.handleDeleteConfirm} loading={hook.mutationLoading} />
      <DeactivateClientDialog open={hook.deactivateDialogOpen} onOpenChange={hook.setDeactivateDialogOpen} client={hook.selectedClient} onConfirm={hook.handleDeactivateConfirm} loading={hook.mutationLoading} action={hook.deactivateAction} />
    </motion.div>
  );
}
