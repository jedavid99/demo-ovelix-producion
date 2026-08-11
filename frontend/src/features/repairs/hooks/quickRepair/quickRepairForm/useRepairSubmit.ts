import { useNavigate } from 'react-router-dom';
import { DEVICE_TYPES } from '../../../constants/quickRepair/quickRepair.constants';
import { createBrand, createRepair } from '../../../services/quickRepair/quickRepairApi';
import type { QuickRepairFormProps, Client } from '../../../types/quickRepair/quickRepair.types';

interface SubmitState {
  step: number; setStep: (v: number) => void;
  loading: boolean; setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  selectedDeviceType: string | null;
  selectedBrand: string; existingBrands: string[]; setExistingBrands: (v: string[]) => void;
  model: string; serial: string;
  securityType: string; pinCode: string;
  patternPoints: string; patternSequence: string;
  selectedAccessories: string[];
  issue: string; priority: string;
  estimatedCost: string; deposit: string;
  paymentMethod: string; notes: string; estimatedDate: string;
  tieneGarantia: boolean; garantiaDuracion: string; garantiaUnidad: string; fechaInicioGarantia: string;
}

export function useRepairSubmit(
  state: SubmitState,
  selectedClient: Client | null,
  onSuccess?: () => void,
  onCancel?: () => void,
) {
  const navigate = useNavigate();

  const handleNext = () => {
    if (state.step === 1 && !selectedClient) {
      state.setError('Por favor selecciona un cliente');
      return;
    }
    if (state.step === 2 && !state.selectedDeviceType) {
      state.setError('Por favor selecciona un tipo de dispositivo');
      return;
    }
    if (state.step === 3 && !state.issue.trim()) {
      state.setError('Por favor describe el problema');
      return;
    }
    state.setError(null);
    state.setStep(state.step + 1);
  };

  const handleBack = () => {
    state.setError(null);
    state.setStep(state.step - 1);
  };

  const handleSubmit = async () => {
    try {
      state.setLoading(true);
      state.setError(null);
      const serviceCost = state.estimatedCost ? parseFloat(state.estimatedCost) : 0;
      const depositAmount = state.deposit ? parseFloat(state.deposit) : 0;
      const isPaid = depositAmount >= serviceCost && serviceCost > 0;

      if (state.selectedBrand && !state.existingBrands.includes(state.selectedBrand)) {
        try {
          await createBrand(state.selectedBrand);
          state.setExistingBrands([...state.existingBrands, state.selectedBrand]);
        } catch (brandError: any) {
          console.error('Error creating brand:', brandError);
        }
      }

      const repairData = {
        cliente_id: selectedClient?.id,
        categoria_dispositivo: DEVICE_TYPES.find(d => d.id === state.selectedDeviceType)?.name || 'Otro',
        dispositivo: DEVICE_TYPES.find(d => d.id === state.selectedDeviceType)?.name || 'Otro',
        marca: state.selectedBrand, modelo: state.model, numero_serie: state.serial,
        tipo_seguridad: state.securityType || undefined,
        pin_acceso: state.pinCode || undefined,
        patron_puntos: state.patternPoints ? state.patternPoints.split(',').map(p => parseInt(p.trim())).filter(n => !isNaN(n)) : undefined,
        secuencia_patron: state.patternSequence ? state.patternSequence.split(',').map(p => parseInt(p.trim())).filter(n => !isNaN(n)) : undefined,
        accesorios_incluidos: state.selectedAccessories.length > 0 ? state.selectedAccessories : undefined,
        problema_reportado: state.issue, prioridad: state.priority,
        costo_estimado: serviceCost || undefined, total_reparacion: serviceCost || undefined,
        abono: depositAmount || undefined, forma_pago: state.paymentMethod || undefined,
        pagado: isPaid, fecha_estimada_entrega: state.estimatedDate, notas: state.notes,
        tiene_garantia: state.tieneGarantia,
        garantia_duracion: state.tieneGarantia ? parseInt(state.garantiaDuracion) : undefined,
        garantia_unidad: state.tieneGarantia ? state.garantiaUnidad : undefined,
        fecha_inicio_garantia: state.tieneGarantia && state.fechaInicioGarantia ? state.fechaInicioGarantia : undefined,
      };

      await createRepair(repairData);
      if (onSuccess) onSuccess();
      else navigate('/reparaciones/list');
    } catch (err: any) {
      console.error('Error creating repair:', err);
      state.setError(err.response?.data?.message || 'Error al crear la reparaci\u00F3n');
    } finally {
      state.setLoading(false);
    }
  };

  return { handleNext, handleBack, handleSubmit };
}
