import type { iPhone } from '../types';

export function getStatusColor(status: string) {
  switch (status) {
    case 'Available':
      return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' };
    case 'Reserved':
      return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' };
    case 'Sold':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
    case 'Out of Stock':
      return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
    default:
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
  }
}

export function getBatteryColor(battery: number) {
  if (battery >= 80) return 'bg-emerald-500';
  if (battery >= 50) return 'bg-amber-500';
  if (battery >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}

export const statusLabels: Record<string, string> = {
  Available: 'Disponible',
  Reserved: 'Reservado',
  Sold: 'Vendido',
  'Out of Stock': 'Sin stock',
};

export const STATUS_OPTIONS = ['Todas', 'Disponible', 'Reservado', 'Vendido', 'Sin stock'] as const;
