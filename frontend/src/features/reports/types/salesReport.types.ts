export type PeriodType = 'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado'

export type SaleStatus = 'Completada' | 'Pendiente' | 'Cancelada'

export interface Sale {
  id: string
  date: Date
  client: string
  product: string
  quantity: number
  total: number
  status: SaleStatus
  category: string
}

export interface EvolutionData {
  date: string
  amount: number
}

export interface CategoryData {
  name: string
  value: number
  count: number
}

export interface TopProduct {
  name: string
  quantity: number
  position: number
}
