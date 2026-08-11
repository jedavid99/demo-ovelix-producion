export interface Shipment {
  id: string
  customer: string
  type: 'Repair' | 'Sale'
  provider: string
  location: string
  progress: number
  status: 'preparation' | 'transit' | 'delivery' | 'delivered'
  estimatedDelivery: string
  origin: string
  destination: string
  weight: string
  items: number
  lat?: number
  lng?: number
  lastUpdate: string
  driver?: string
  vehicle?: string
  signature?: boolean
  description?: string
  value?: string
}

export interface LogEvent {
  title: string
  detail: string
  completed: boolean
  time: string
  icon?: React.ReactNode
}

export interface KpiCardData {
  title: string
  value: number
  change: number
  icon: React.ReactNode
  color: string
  bgColor: string
}
