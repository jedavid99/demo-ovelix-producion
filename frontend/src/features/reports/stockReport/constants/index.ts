export const CATEGORIES = ['Todos', 'Celulares', 'Baterías', 'Pantallas', 'Flex', 'Carcasas', 'Insumos'];

export const ITEMS_PER_PAGE = 10;

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
