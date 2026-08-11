export type AdjustmentType = 'entry' | 'exit' | 'correction' | 'physical' | 'return'
export type AdjustmentStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface AdjustmentItem {
  id: number
  productName: string
  productSku: string
  type: AdjustmentType
  quantity: number
  reason: string
  notes?: string
  date: string
  user: string
  status: AdjustmentStatus
}

export interface NewAdjustmentForm {
  productName: string
  productSku: string
  type: AdjustmentType
  quantity: number
  reason: string
  notes: string
  date: string
  user: string
}

export interface KpiItem {
  label: string
  value: number | string
  icon: React.ElementType
  trend: string
  trendUp: boolean
  color: string
}
