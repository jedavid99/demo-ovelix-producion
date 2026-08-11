import { useEffect } from 'react';
import { useQuickRepairState } from './useQuickRepairState';
import { useClientSearchState } from './useClientSearch';
import { usePatternCanvas } from './usePatternCanvas';
import { useRepairSubmit } from './useRepairSubmit';
import { DEVICE_TYPES, securityOptionsByDevice, SECURITY_LABELS, accessoriesByDevice } from '../../../constants/quickRepair/quickRepair.constants';
import { loadBrands } from '../../../services/quickRepair/quickRepairApi';
import type { QuickRepairFormProps } from '../../../types/quickRepair/quickRepair.types';

export function useQuickRepair({ onSuccess, onCancel }: QuickRepairFormProps) {
  const state = useQuickRepairState();
  const client = useClientSearchState();
  const pattern = usePatternCanvas({
    drawnPattern: state.drawnPattern,
    setDrawnPattern: state.setDrawnPattern,
    setPatternPoints: state.setPatternPoints,
    setPatternSequence: state.setPatternSequence,
    canvasRef: state.canvasRef,
  });
  const submit = useRepairSubmit(state, client.selectedClient, onSuccess, onCancel);

  useEffect(() => {
    (async () => {
      try {
        const brandNames = await loadBrands();
        state.setExistingBrands(brandNames);
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (state.selectedDeviceType && state.securityType) {
      const availableOptions = state.selectedDeviceType
        ? (securityOptionsByDevice[state.selectedDeviceType] || securityOptionsByDevice.smartphone)
        : securityOptionsByDevice.smartphone;
      if (!availableOptions.includes(state.securityType)) {
        state.setSecurityType('');
        state.setPinCode('');
        state.setPatternPoints('');
        state.setPatternSequence('');
        state.setDrawnPattern([]);
      }
    }
    state.setSelectedAccessories([]);
  }, [state.selectedDeviceType]);

  const getSecurityOptions = () => {
    if (!state.selectedDeviceType) return securityOptionsByDevice.smartphone;
    return securityOptionsByDevice[state.selectedDeviceType] || securityOptionsByDevice.smartphone;
  };

  const getSecurityLabel = (value: string) => SECURITY_LABELS[value] || value;

  const getAccessories = () => {
    if (!state.selectedDeviceType) return accessoriesByDevice.smartphone;
    return accessoriesByDevice[state.selectedDeviceType] || accessoriesByDevice.other;
  };

  const toggleAccessory = (accessoryId: string) => {
    state.setSelectedAccessories((prev: string[]) =>
      prev.includes(accessoryId)
        ? prev.filter((id: string) => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  return {
    ...state,
    ...client,
    ...pattern,
    ...submit,
    getSecurityOptions, getSecurityLabel, getAccessories, toggleAccessory,
    DEVICE_TYPES,
    onSuccess, onCancel,
  };
}
