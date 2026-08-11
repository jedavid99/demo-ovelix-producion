export interface Remise {
  id: string
  plate: string
  driver: string
  driverPhone: string
  vehicle: string
  brand: string
  model: string
  year: number
  status: 'disponible' | 'en_ruta' | 'mantenimiento' | 'inactivo'
  location: string
  lastUpdate: string
  fuelLevel: number
  mileage: number
  assignedTo?: string
  notes?: string
}

export type RemiseStatus = Remise['status']

export interface NewRemiseForm {
  plate: string
  driver: string
  driverPhone: string
  vehicle: string
  brand: string
  model: string
  year: number
  status: RemiseStatus
  location: string
  fuelLevel: number
  mileage: number
  assignedTo: string
  notes: string
}

export interface KpiItem {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
}

export interface StatusBadge {
  variant: 'success' | 'default' | 'warning' | 'destructive'
  label: string
}
