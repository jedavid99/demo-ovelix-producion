import type { StockItem } from '../../types/stock/stock.types';

export const stockItems: StockItem[] = [];

export const categories = ['all', 'phone', 'pc', 'console'];

export const statusOptions = ['all', 'good', 'low', 'out'];

export const categoryColorMap: Record<string, string> = {
  Phone: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  PC: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  Console: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
};

export const getStatusBadge = (status: string, quantity: number) => {
  if (quantity === 0) return { variant: 'destructive' as const, label: 'Agotado' };
  if (quantity < 5) return { variant: 'warning' as const, label: 'Bajo stock' };
  return { variant: 'success' as const, label: 'En stock' };
};
