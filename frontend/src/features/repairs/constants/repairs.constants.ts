import { ESTADOS_CONFIG } from '@/config/estadosReparacion.config';
import type { StatusStyle, PriorityStyle } from '../types/repairs.types';

export const PAGE_SIZE = 10;

export const STATUS_FILTERS = [
  'all',
  'CANCELADO_POR_CLIENTE',
  'ABANDONADO_POR_CLIENTE',
  'GARANTIA_ENTREGADO',
  'INGRESADO',
  'EN_COLA_DIAGNOSTICO',
  'EN_DIAGNOSTICO',
  'PRESUPUESTADO_ESPERANDO_OK',
  'PRESUPUESTO_RECHAZADO',
  'RESPALDO_DE_DATOS',
  'EN_REPARACION',
  'ESPERANDO_REPUESTO_LOCAL',
  'ESPERANDO_REPUESTO_IMPORTACION',
  'EN_PRUEBAS_CONTROL_CALIDAD',
  'REPARADO_PENDIENTE_PAGO',
  'LISTO_PARA_RETIRAR',
  'ENTREGADO_AL_CLIENTE',
  'CERRADO_FACTURADO',
  'IRREPARABLE_PARA_RETIRAR',
  'IRREPARABLE_ENTREGADO',
  'EN_GARANTIA_REINGRESO',
] as const;

export const getStatusBadge = (status: string): StatusStyle => {
  const config = ESTADOS_CONFIG[status];

  if (config) {
    return {
      bg: '',
      text: '',
      border: '',
      label: config.label,
    };
  }

  return {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: status || 'Desconocido',
  };
};

export const getPriorityBadge = (priority: string): PriorityStyle => {
  const priorityMap: Record<string, PriorityStyle> = {
    baja: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-600',
      label: 'Baja',
    },
    low: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-600',
      label: 'Baja',
    },
    media: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Media',
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Media',
    },
    alta: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Alta',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Alta',
    },
    urgente: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Urgente',
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Crítica',
    },
  };

  return priorityMap[priority] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: priority || '—',
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};
