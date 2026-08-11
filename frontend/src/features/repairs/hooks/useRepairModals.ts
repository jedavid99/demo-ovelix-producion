import { useState, useRef } from 'react';

export function useRepairModals(allRepairs: any[] = []) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement>>({});

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [selectedRepairIdForDelivery, setSelectedRepairIdForDelivery] = useState<string | null>(null);

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedRepairIdForStatus, setSelectedRepairIdForStatus] = useState<string | null>(null);
  const [selectedRepairCurrentStatus, setSelectedRepairCurrentStatus] = useState<string>('');

  const closeDropdown = () => setActiveDropdown(null);

  const openMarkDeliveredModal = (repairId: string) => {
    setSelectedRepairIdForDelivery(repairId);
    setIsMarkDeliveredModalOpen(true);
    closeDropdown();
  };

  const openEditStatusModal = (repairId: string) => {
    const repair = allRepairs.find(r => r.id === repairId);
    if (repair) {
      setSelectedRepairIdForStatus(repairId);
      setSelectedRepairCurrentStatus(repair.estado);
      setIsEditStatusModalOpen(true);
      closeDropdown();
    }
  };

  const openPreviewModal = (repairId: string) => {
    setSelectedRepairId(repairId);
    setPreviewModalOpen(true);
    closeDropdown();
  };

  return {
    activeDropdown, setActiveDropdown, dropdownRefs, closeDropdown,
    previewModalOpen, setPreviewModalOpen,
    selectedRepairId, setSelectedRepairId,
    isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen,
    selectedRepairIdForDelivery,
    isEditStatusModalOpen, setIsEditStatusModalOpen,
    selectedRepairIdForStatus, setSelectedRepairIdForStatus,
    selectedRepairCurrentStatus, setSelectedRepairCurrentStatus,
    openMarkDeliveredModal, openEditStatusModal, openPreviewModal,
  };
}
