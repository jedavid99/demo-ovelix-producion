import type { PeriodOption } from '../types/financial.types';

export const PERIOD_OPTIONS: PeriodOption[] = ['Hoy', '7 días', '30 días', 'Este año', 'Personalizado'];

export const EXPENSE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6',
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};
