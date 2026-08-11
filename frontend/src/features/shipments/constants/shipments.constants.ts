import type { RemiseStatus, StatusBadge } from '../types/shipments.types'

export const ITEMS_PER_PAGE = 10

export const STATUS_FILTERS = ['all', 'disponible', 'en_ruta', 'mantenimiento', 'inactivo'] as const

export const STATUS_LABELS: Record<string, string> = {
  all: 'Todos',
  disponible: 'Disponibles',
  en_ruta: 'En Ruta',
  mantenimiento: 'Mantenimiento',
  inactivo: 'Inactivos',
}

export const STATUS_BADGES: Record<RemiseStatus, StatusBadge> = {
  disponible: { variant: 'success', label: 'Disponible' },
  en_ruta: { variant: 'default', label: 'En Ruta' },
  mantenimiento: { variant: 'warning', label: 'Mantenimiento' },
  inactivo: { variant: 'destructive', label: 'Inactivo' },
}
