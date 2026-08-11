import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { repairService } from '@/services/repairService';
import { toast } from '@/shared/components/ui/use-toast';
import type { RepairData } from '../../../RepairFlow';
import { useClientSearch } from '../useClientSearch';
import { useRepairForm } from '../useRepairForm';

export function useRepairCreate(data: RepairData | undefined, updateData: ((updates: Partial<RepairData>) => void) | undefined) {
  const navigate = useNavigate();

  const {
    search, setSearch, searchResults, searching, lastClient, loadingClients,
    handleSelectClient: handleSelectClientSearch, handleSelectLastClient,
  } = useClientSearch();

  const {
    state, applyUpdate, currentHardwareItems, currentSecurityOptions,
    handleHardwareToggle, functionalCount, handleGenerateSerial,
    getAccessoriesForDevice, handleAccessoryToggle,
  } = useRepairForm(data, updateData);

  const [orderStep, setOrderStep] = useState<'form' | 'confirm'>('form');
  const [repairPrice, setRepairPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectClient = useCallback((client: any) => {
    handleSelectClientSearch(client, (selectedClient: any) => {
      applyUpdate({ selectedClient });
    });
  }, [handleSelectClientSearch, applyUpdate]);

  const handleSelectLastClientWrapper = useCallback(() => {
    handleSelectLastClient((selectedClient: any) => {
      applyUpdate({ selectedClient });
    });
  }, [handleSelectLastClient, applyUpdate]);

  const handleClearClient = useCallback(() => {
    applyUpdate({ selectedClient: null });
  }, [applyUpdate]);

  const handleCreateOrder = useCallback(() => {
    if (!state.selectedClient) {
      toast({ title: 'Error', description: 'Debe seleccionar un cliente', variant: 'destructive' });
      return;
    }
    setOrderStep('confirm');
  }, [state.selectedClient]);

  const handleConfirmOrder = async () => {
    if (!repairPrice || parseFloat(repairPrice) <= 0) {
      toast({ title: 'Error', description: 'Debe ingresar un precio válido', variant: 'destructive' });
      return;
    }
    if (!state.selectedClient) {
      toast({ title: 'Error', description: 'Debe seleccionar un cliente', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        cliente_id: state.selectedClient.id,
        dispositivo: state.brand && state.model ? `${state.brand} ${state.model}` : state.deviceType,
        problema_reportado: state.issueDescription,
        fecha_ingreso: new Date().toISOString().split('T')[0],
      };

      if (state.deviceType) payload.categoria_dispositivo = state.deviceType;
      if (state.brand) payload.marca = state.brand;
      if (state.model) payload.modelo = state.model;
      if (state.serial) payload.numero_serie = state.serial;
      if (state.aestheticCondition) payload.condicion_estetica = state.aestheticCondition;
      if (state.accessories && state.accessories.length > 0) payload.accesorios_incluidos = state.accessories;
      if (state.priority) {
        const pMap: Record<string, string> = { Normal: 'medium', Baja: 'low', Alta: 'high' };
        payload.prioridad = pMap[state.priority] || 'critical';
      }
      if (state.estimatedDays) {
        payload.fecha_estimada_entrega = new Date(Date.now() + state.estimatedDays * 86400000).toISOString().split('T')[0];
        payload.tiempo_estimado_minutos = state.estimatedDays * 480;
      }
      if (repairPrice) payload.total_reparacion = parseFloat(repairPrice);
      if (state.technicianNotes) payload.notas = state.technicianNotes;

      if (state.securityType) {
        const secMap: Record<string, string> = {
          ninguno: 'none', pin: 'pin', patron: 'pattern', huella: 'fingerprint',
          none: 'none', con_pin: 'pin', con_patron: 'pattern',
          huella_digital: 'fingerprint', reconocimiento_facial: 'face',
        };
        payload.tipo_seguridad = secMap[state.securityType] || 'none';
      }
      if (state.securityType === 'pin' && state.accessPin) payload.pin_acceso = state.accessPin;
      if (state.hardwareChecks && Object.keys(state.hardwareChecks).length > 0) {
        payload.chequeo_hardware = state.hardwareChecks;
      }

      const response = await repairService.create(payload as any);
      toast({ title: 'Orden creada', description: 'La orden de servicio se ha creado exitosamente' });

      const createdOrder = (response as any)?.data?.data || (response as any)?.data;
      const orderId = createdOrder?.id || createdOrder?.numero_reparacion || createdOrder?._id;

      if (orderId) {
        navigate(`/reparaciones/confirmation?orderId=${orderId}`);
      } else {
        try {
          const repairsList = await repairService.list({ limit: 1, sort: 'created_at:desc' }) as any;
          let repairsArray = repairsList?.data?.data?.reparaciones ||
            repairsList?.data?.reparaciones || repairsList?.reparaciones;
          if (Array.isArray(repairsArray) && repairsArray.length > 0) {
            const lastOrder = repairsArray[0];
            const listOrderId = lastOrder.id || lastOrder.numero_reparacion || lastOrder._id;
            if (listOrderId) {
              navigate(`/reparaciones/confirmation?orderId=${listOrderId}`);
              return;
            }
          }
        } catch (_) { /* fall through */ }
        navigate('/reparaciones/list');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.errors?.join(', ') || error.response?.data?.message || 'No se pudo crear la orden',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToForm = useCallback(() => setOrderStep('form'), []);

  return {
    state, applyUpdate, currentHardwareItems, currentSecurityOptions,
    handleHardwareToggle, functionalCount, handleGenerateSerial,
    getAccessoriesForDevice, handleAccessoryToggle,
    search, setSearch, searchResults, searching, lastClient, loadingClients,
    handleSelectClient, handleSelectLastClientWrapper, handleClearClient,
    orderStep, repairPrice, setRepairPrice, submitting,
    handleCreateOrder, handleConfirmOrder, handleBackToForm,
  };
}
