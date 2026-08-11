import React from 'react';
import type { RepairData } from '../../RepairFlow';
import type { RepairFinalizeProps } from '../types';

const defaultData: RepairData = {
  selectedClient: null,
  deviceType: 'phone',
  brand: '', model: '', serial: '', aestheticCondition: '',
  accessories: [],
  issueDescription: '',
  priority: 'Normal', estimatedDays: 3,
  hardwareChecks: { power: true, display: true, wifi: false, bluetooth: true, cameras: true, audio: true },
  securityType: 'pin', accessPin: '920431',
  patternDots: [true, false, false, true, true, false, false, false, true],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false, signaturePad: '', printOption: 'both',
};

export function useRepairFinalize({ data, updateData }: RepairFinalizeProps) {
  const [localData, setLocalData] = React.useState<RepairData>(defaultData);
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [withWarranty, setWithWarranty] = React.useState(true);

  const state = data ?? localData;

  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData(prev => ({ ...prev, ...updates }));
  };

  const laborCost = 85.00;
  const partsCost = 210.00;
  const depositPaid = 150.00;
  const subtotal = laborCost + partsCost;
  const finalBalance = subtotal - depositPaid;

  return {
    state, paymentMethod, setPaymentMethod, withWarranty, setWithWarranty,
    applyUpdate, subtotal, depositPaid, finalBalance,
  };
}
