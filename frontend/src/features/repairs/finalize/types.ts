import type { RepairData } from '../RepairFlow';

export interface RepairFinalizeProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onBack?: () => void;
  onComplete?: () => void;
  currentStep?: number;
}
