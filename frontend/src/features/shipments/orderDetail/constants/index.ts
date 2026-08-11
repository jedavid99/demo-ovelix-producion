import type { OrderStatus } from '../types';

export const statusColors: Record<OrderStatus, string> = {
  'Pendiente': 'bg-warning/10 text-warning border-warning/20',
  'Enviada': 'bg-primary/10 text-primary border-primary/20',
  'Recibida': 'bg-success/10 text-success border-success/20',
  'Cancelada': 'bg-destructive/10 text-destructive border-destructive/20',
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};
