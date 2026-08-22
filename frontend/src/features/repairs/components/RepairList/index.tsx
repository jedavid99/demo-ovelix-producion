import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairList } from '../../hooks/useRepairList';
import { RepairListHeader } from './RepairListHeader';
import { RepairListKPIs } from './RepairListKPIs';
import { RepairListFilters } from './RepairListFilters';
import { RepairListTable } from './RepairListTable';
import { MarkDeliveredModal } from './MarkDeliveredModal';
import { EditStatusModal } from './EditStatusModal';
import { EvidenceModal } from './EvidenceModal';
import RepairPreviewModal from '../../RepairPreviewModal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

export default function RepairsList() {
  const navigate = useNavigate();
  const {
    currentPage,
    setCurrentPage,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    previewModalOpen,
    setPreviewModalOpen,
    selectedRepairId,
    setSelectedRepairId,
    isMarkDeliveredModalOpen,
    setIsMarkDeliveredModalOpen,
    isMarkingDelivered,
    isEditStatusModalOpen,
    setIsEditStatusModalOpen,
    selectedRepairIdForStatus,
    setSelectedRepairIdForStatus,
    selectedRepairCurrentStatus,
    setSelectedRepairCurrentStatus,
    pendingToday,
    expiringSoon,
    readyToPickup,
    totalRevenue,
    paginatedRepairs,
    totalPages,
    totalFiltered,
    handleDelete,
    confirmDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    handleMarkAsDelivered,
    openMarkDeliveredModal,
    openEditStatusModal,
    openPreviewModal,
    openEvidenceModal,
    isEvidenceModalOpen,
    setIsEvidenceModalOpen,
    selectedRepairIdForEvidence,
    navigateToEdit,
    navigateToPDF,
    navigateToThermalPrint,
    loadRepairs,
  } = useRepairList();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <RepairListHeader onNewRepair={() => navigate('/reparaciones/add')} />

      {/* KPIs */}
      <RepairListKPIs
        pendingToday={pendingToday}
        expiringSoon={expiringSoon}
        readyToPickup={readyToPickup}
        totalRevenue={totalRevenue}
      />

      {/* Filtros */}
      <RepairListFilters
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tabla */}
      <RepairListTable
        loading={loading}
        error={error}
        onRetry={loadRepairs}
        paginatedRepairs={paginatedRepairs}
        currentPage={currentPage}
        totalPages={totalPages}
        totalFiltered={totalFiltered}
        onPreview={openPreviewModal}
        onEdit={navigateToEdit}
        onEditStatus={openEditStatusModal}
        onPDF={navigateToPDF}
        onThermalPrint={navigateToThermalPrint}
        onMarkDelivered={openMarkDeliveredModal}
        onDelete={handleDelete}
        onEvidencias={openEvidenceModal}
        onPageChange={handlePageChange}
      />

      {/* Modal para marcar entregado */}
      <MarkDeliveredModal
        isOpen={isMarkDeliveredModalOpen}
        onOpenChange={setIsMarkDeliveredModalOpen}
        onConfirm={() => {
          if (selectedRepairId) {
            handleMarkAsDelivered(selectedRepairId);
          }
        }}
        isProcessing={isMarkingDelivered}
      />

      {/* Modal para editar estado */}
      {selectedRepairIdForStatus && (
        <EditStatusModal
          open={isEditStatusModalOpen}
          onClose={() => {
            setIsEditStatusModalOpen(false);
            setSelectedRepairIdForStatus(null);
            setSelectedRepairCurrentStatus('');
          }}
          repairId={selectedRepairIdForStatus}
          currentStatus={selectedRepairCurrentStatus}
          onSuccess={() => {
            loadRepairs();
          }}
        />
      )}

      {/* Modal de vista previa */}
      {selectedRepairId && (
        <RepairPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setSelectedRepairId(null);
          }}
          repairId={selectedRepairId}
        />
      )}

      {/* Modal de evidencias */}
      {selectedRepairIdForEvidence && (
        <EvidenceModal
          open={isEvidenceModalOpen}
          onClose={() => {
            setIsEvidenceModalOpen(false);
          }}
          repairId={selectedRepairIdForEvidence}
          onUpdated={loadRepairs}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Eliminar reparación"
        description="¿Estás seguro de que deseas eliminar esta reparación?"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
