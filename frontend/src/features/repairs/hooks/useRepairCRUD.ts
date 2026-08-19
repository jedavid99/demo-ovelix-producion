import { useState } from 'react';
import { repairApi } from '../services/repairApi';
import { toast } from '@/shared/components/ui/use-toast';

export function useRepairCRUD(onSuccess: () => void) {
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [repairIdToDelete, setRepairIdToDelete] = useState<string | null>(null);

  const handleDelete = (repairId: string) => {
    setRepairIdToDelete(repairId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!repairIdToDelete) return;
    try {
      await repairApi.deleteRepair(repairIdToDelete);
      toast({ title: 'Éxito', description: 'Reparación eliminada correctamente' });
      onSuccess();
    } catch {
      toast({ title: 'Error', description: 'No se pudo eliminar la reparación', variant: 'destructive' });
    } finally {
      setDeleteConfirmOpen(false);
      setRepairIdToDelete(null);
    }
  };

  const markAsDelivered = async (repairId: string) => {
    setIsMarkingDelivered(true);
    try {
      await repairApi.updateRepairStatus(repairId, { estado: 'ENTREGADO_AL_CLIENTE' });
      toast({ title: 'Éxito', description: 'Reparación marcada como entregada' });
      onSuccess();
      return true;
    } catch {
      toast({ title: 'Error', description: 'No se pudo marcar la reparación como entregada', variant: 'destructive' });
      return false;
    } finally {
      setIsMarkingDelivered(false);
    }
  };

  return { handleDelete, confirmDelete, markAsDelivered, isMarkingDelivered, deleteConfirmOpen, setDeleteConfirmOpen };
}
