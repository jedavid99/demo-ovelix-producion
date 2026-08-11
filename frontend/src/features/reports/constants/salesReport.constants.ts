import type { PeriodType } from '../types/salesReport.types'

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export const PERIODS: PeriodType[] = ['Hoy', '7 días', '30 días', 'Este año', 'Personalizado']

export const ITEMS_PER_PAGE = 10

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
