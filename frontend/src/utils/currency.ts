/**
 * Formatea un valor numérico como moneda en Pesos Argentinos (ARS)
 * @param amount - El valor a formatear (número o string)
 * @returns El valor formateado como moneda ARS (ej: "$1.234,56")
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount as string) || 0;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};
