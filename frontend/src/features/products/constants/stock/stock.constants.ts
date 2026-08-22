// Legacy mock constants - kept for backward compatibility
export const stockItems: never[] = [];
export const categories = ['all', 'phone', 'pc', 'console'];
export const statusOptions = ['all', 'good', 'low', 'out'];
export const categoryColorMap: Record<string, string> = {};
export const getStatusBadge = (_status: string, _quantity: number) => ({ variant: 'default' as const, label: '' });
