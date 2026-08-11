export const STATUS_COLORS: Record<string, string> = {
  Pendiente: '#f59e0b',
  'En Progreso': '#3b82f6',
  Completado: '#10b981',
  Cancelado: '#ef4444',
}

export const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export const PERIOD_OPTIONS = ['Hoy', '7 días', '30 días', 'Este año', 'Personalizado'] as const

export const ITEMS_PER_PAGE = 10

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
