export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export const IVA_RATE = 0.21;

export const ORDER_STATUSES = ['Pendiente', 'Enviada', 'Recibida', 'Cancelada'] as const;

export const generateOrderNumber = () =>
  `#OC-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
