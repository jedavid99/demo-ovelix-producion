export interface Repair {
  id: string
  ticketId: string
  client: string
  device: string
  deviceType: string
  issue: string
  status: 'Pendiente' | 'En Progreso' | 'Completado' | 'Cancelado'
  date: Date
  completedDate?: Date
  cost: number
  technician: string
}

export interface RepairByStatus {
  name: string
  value: number
  color: string
}

export interface RepairByDevice {
  name: string
  value: number
}

export interface RepairTimeline {
  date: string
  repairs: number
  revenue: number
}

export type PeriodType = 'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado'

export interface KpiItem {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  badge?: { text: string; variant: string }
}
