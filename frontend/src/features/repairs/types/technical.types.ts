import type { RepairData } from '../RepairFlow'

export interface RepairTechnicalProps {
  data?: RepairData
  updateData?: (updates: Partial<RepairData>) => void
  onNext?: () => void
  onBack?: () => void
  currentStep?: number
}

export interface HardwareItem {
  key: string
  label: string
  icon: React.ElementType
}
