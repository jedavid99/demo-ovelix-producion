import { useRepairCRUD } from './useRepairCRUD';
import { useRepairModals } from './useRepairModals';
import { useRepairPDF } from './useRepairPDF';
import { useRepairNavigation } from './useRepairNavigation';
import type { Repair } from '../types/repairs.types';

export function useRepairMutations(onSuccess: () => void, allRepairs: Repair[] = []) {
  const crud = useRepairCRUD(onSuccess);
  const modals = useRepairModals(allRepairs);
  const pdf = useRepairPDF(modals.closeDropdown);
  const nav = useRepairNavigation(modals.closeDropdown);

  const handleMarkAsDelivered = async (repairId: string) => {
    const success = await crud.markAsDelivered(repairId);
    if (success) {
      modals.setIsMarkDeliveredModalOpen(false);
      modals.setSelectedRepairIdForDelivery(null);
    }
  };

  return {
    activeDropdown: modals.activeDropdown,
    setActiveDropdown: modals.setActiveDropdown,
    dropdownRefs: modals.dropdownRefs,
    previewModalOpen: modals.previewModalOpen,
    setPreviewModalOpen: modals.setPreviewModalOpen,
    selectedRepairId: modals.selectedRepairId,
    setSelectedRepairId: modals.setSelectedRepairId,
    isMarkDeliveredModalOpen: modals.isMarkDeliveredModalOpen,
    setIsMarkDeliveredModalOpen: modals.setIsMarkDeliveredModalOpen,
    selectedRepairIdForDelivery: modals.selectedRepairIdForDelivery,
    isMarkingDelivered: crud.isMarkingDelivered,
    isEditStatusModalOpen: modals.isEditStatusModalOpen,
    setIsEditStatusModalOpen: modals.setIsEditStatusModalOpen,
    selectedRepairIdForStatus: modals.selectedRepairIdForStatus,
    setSelectedRepairIdForStatus: modals.setSelectedRepairIdForStatus,
    selectedRepairCurrentStatus: modals.selectedRepairCurrentStatus,
    setSelectedRepairCurrentStatus: modals.setSelectedRepairCurrentStatus,
    handleDelete: crud.handleDelete,
    confirmDelete: crud.confirmDelete,
    deleteConfirmOpen: crud.deleteConfirmOpen,
    setDeleteConfirmOpen: crud.setDeleteConfirmOpen,
    handleMarkAsDelivered,
    openMarkDeliveredModal: modals.openMarkDeliveredModal,
    openEditStatusModal: modals.openEditStatusModal,
    openPreviewModal: modals.openPreviewModal,
    openEvidenceModal: modals.openEvidenceModal,
    isEvidenceModalOpen: modals.isEvidenceModalOpen,
    setIsEvidenceModalOpen: modals.setIsEvidenceModalOpen,
    selectedRepairIdForEvidence: modals.selectedRepairIdForEvidence,
    navigateToEdit: nav.navigateToEdit,
    navigateToPDF: pdf.navigateToPDF,
    navigateToThermalPrint: pdf.navigateToThermalPrint,
  };
}
