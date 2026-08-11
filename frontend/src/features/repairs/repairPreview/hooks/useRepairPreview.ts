import { useState, useEffect } from 'react';
import { repairService } from '@/services/repairService';
import { toast } from '@/shared/components/ui/use-toast';
import { formatCurrency } from '@/utils/currency';
import type { RepairData } from '../types';

export function useRepairPreview(repairId: string, isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);

  useEffect(() => {
    if (isOpen && repairId) {
      loadRepairData();
    }
  }, [isOpen, repairId]);

  const loadRepairData = async () => {
    try {
      setLoading(true);
      const response = await repairService.getById(repairId) as any;
      const orderData = response?.data?.data || response?.data || response;
      setRepairData(orderData);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la reparación',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'warning' | 'default' | 'success' | 'destructive'; label: string }> = {
      pending: { variant: 'warning', label: 'Pendiente' },
      diagnostic: { variant: 'default', label: 'Diagnóstico' },
      in_progress: { variant: 'default', label: 'En Progreso' },
      waiting_parts: { variant: 'warning', label: 'Esperando Repuestos' },
      ready: { variant: 'success', label: 'Listo' },
      delivered: { variant: 'success', label: 'Entregado' },
      cancelled: { variant: 'destructive', label: 'Cancelado' },
    };
    return map[status] ?? { variant: 'default' as const, label: status };
  };

  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { variant: 'default' | 'warning' | 'destructive'; label: string }> = {
      low: { variant: 'default', label: 'Baja' },
      medium: { variant: 'default', label: 'Normal' },
      high: { variant: 'warning', label: 'Alta' },
      critical: { variant: 'destructive', label: 'Crítica' },
    };
    return map[priority] ?? { variant: 'default' as const, label: priority };
  };

  const calculateRepuestosTotal = () => {
    if (!repairData?.repuestos) return 0;
    return repairData.repuestos.reduce((sum, r) => {
      const costo = typeof r.costo_unitario === 'number' ? r.costo_unitario : parseFloat(r.costo_unitario as string) || 0;
      return sum + (r.cantidad * costo);
    }, 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return {
    loading,
    repairData,
    getStatusBadge,
    getPriorityBadge,
    calculateRepuestosTotal,
    formatDate,
    formatCurrency,
  };
}
