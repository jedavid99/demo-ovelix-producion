import type { Variants } from 'framer-motion'
import type { AdjustmentType, AdjustmentStatus } from '../types/adjustments.types'

export const adjustmentTypes = ['all', 'entry', 'exit', 'correction', 'physical', 'return'] as const

export const statusOptions = ['all', 'pending', 'approved', 'rejected', 'completed'] as const

export const typeLabels: Record<string, string> = {
  entry: 'Entrada',
  exit: 'Salida',
  correction: 'Corrección',
  physical: 'Inventario Físico',
  return: 'Devolución',
}

export const typeColors: Record<string, string> = {
  entry: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  exit: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  correction: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  physical: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  return: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
}

export const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}

export const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  completed: 'Completado',
}

export const filterStatusLabels: Record<string, string> = {
  all: 'Todos',
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  completed: 'Completado',
}

export const kpiContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const kpiCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  hover: {
    y: -4, scale: 1.02,
    boxShadow: '0 12px 30px -8px rgba(0,0,0,0.15)',
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
}

export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}
