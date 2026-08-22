import { useState, useRef } from 'react';
import type { Repair } from '../types/repairs.types';

export function useRepairModals(allRepairs: Repair[] = []) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement>>({});

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);

  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [selectedRepairIdForDelivery, setSelectedRepairIdForDelivery] = useState<string | null>(null);

  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedRepairIdForStatus, setSelectedRepairIdForStatus] = useState<string | null>(null);
  const [selectedRepairCurrentStatus, setSelectedRepairCurrentStatus] = useState<string>('');

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedRepairIdForEvidence, setSelectedRepairIdForEvidence] = useState<string | null>(null);

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
      setSelectedRepairCurrentStatus(repair.estado ?? '');
      setIsEditStatusModalOpen(true);
      closeDropdown();
    }
  };

  const openPreviewModal = (repairId: string) => {
    setSelectedRepairId(repairId);
    setPreviewModalOpen(true);
    closeDropdown();
  };

  const openEvidenceModal = (repairId: string) => {
    setSelectedRepairIdForEvidence(repairId);
    setIsEvidenceModalOpen(true);
    closeDropdown();
  };

  return {
    activeDropdown, setActiveDropdown, dropdownRefs, closeDropdown,
    previewModalOpen, setPreviewModalOpen,
    selectedRepairId, setSelectedRepairId,
    isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen,
    selectedRepairIdForDelivery, setSelectedRepairIdForDelivery,
    isEditStatusModalOpen, setIsEditStatusModalOpen,
    selectedRepairIdForStatus, setSelectedRepairIdForStatus,
    selectedRepairCurrentStatus, setSelectedRepairCurrentStatus,
    isEvidenceModalOpen, setIsEvidenceModalOpen,
    selectedRepairIdForEvidence,
    openMarkDeliveredModal, openEditStatusModal, openPreviewModal, openEvidenceModal,
  };
}
