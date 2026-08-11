import api from '@/services/api';

const unwrap = (res: any) => res.data.data;

export const settingsApi = {
  updateGeneral: async (data: { nombre_negocio: string; direccion: string }) => {
    const response = await api.put('/empresa', data);
    return unwrap(response);
  },

  // Estados de reparación
  getRepairStates: async () => {
    const response = await api.get('/settings/repair-states');
    return unwrap(response);
  },
  getRepairStateRequests: async () => {
    const response = await api.get('/settings/repair-state-requests');
    return unwrap(response);
  },
  createRepairStateRequest: async (data: { estado_nombre: string; mensaje?: string }) => {
    const response = await api.post('/settings/repair-state-requests', data);
    return unwrap(response);
  },
  updateRepairStateRequest: async (id: string, estado: string) => {
    const response = await api.patch(`/settings/repair-state-requests/${id}`, { estado });
    return unwrap(response);
  },

  // Métodos de pago
  getPaymentMethods: async () => {
    const response = await api.get('/settings/payment-methods');
    return unwrap(response);
  },
  createPaymentMethod: async (data: { nombre: string; descripcion?: string }) => {
    const response = await api.post('/settings/payment-methods', data);
    return unwrap(response);
  },
  updatePaymentMethod: async (id: string, data: { nombre?: string; descripcion?: string; activo?: boolean }) => {
    const response = await api.put(`/settings/payment-methods/${id}`, data);
    return unwrap(response);
  },
  deletePaymentMethod: async (id: string) => {
    const response = await api.delete(`/settings/payment-methods/${id}`);
    return unwrap(response);
  },

  // Porcentajes / impuestos
  getTaxRates: async () => {
    const response = await api.get('/settings/tax-rates');
    return unwrap(response);
  },
  createTaxRate: async (data: { nombre: string; porcentaje: number; seccion?: string; descripcion?: string }) => {
    const response = await api.post('/settings/tax-rates', data);
    return unwrap(response);
  },
  updateTaxRate: async (id: string, data: { nombre?: string; porcentaje?: number; seccion?: string; descripcion?: string; activo?: boolean }) => {
    const response = await api.put(`/settings/tax-rates/${id}`, data);
    return unwrap(response);
  },
  deleteTaxRate: async (id: string) => {
    const response = await api.delete(`/settings/tax-rates/${id}`);
    return unwrap(response);
  },

  // Cuentas bancarias
  getBankAccounts: async () => {
    const response = await api.get('/settings/bank-accounts');
    return unwrap(response);
  },
  createBankAccount: async (data: { alias?: string; cbu?: string; numero_cuenta?: string; banco?: string; titular?: string }) => {
    const response = await api.post('/settings/bank-accounts', data);
    return unwrap(response);
  },
  updateBankAccount: async (id: string, data: any) => {
    const response = await api.put(`/settings/bank-accounts/${id}`, data);
    return unwrap(response);
  },
  deleteBankAccount: async (id: string) => {
    const response = await api.delete(`/settings/bank-accounts/${id}`);
    return unwrap(response);
  },

  // Preferencias de notificación
  getNotificationPreferences: async () => {
    const response = await api.get('/settings/notification-preferences');
    return unwrap(response);
  },
  updateNotificationPreference: async (id: string, activo: boolean) => {
    const response = await api.patch(`/settings/notification-preferences/${id}`, { activo });
    return unwrap(response);
  },

  // Integraciones
  getIntegrations: async () => {
    const response = await api.get('/settings/integrations');
    return unwrap(response);
  },
  updateIntegration: async (id: string, conectado: boolean) => {
    const response = await api.patch(`/settings/integrations/${id}`, { conectado });
    return unwrap(response);
  },

  // Plan
  getPlan: async () => {
    const response = await api.get('/settings/plan');
    return unwrap(response);
  },
  updatePlan: async (data: { plan?: string; meses?: number; activo?: boolean }) => {
    const response = await api.put('/settings/plan', data);
    return unwrap(response);
  },

  // Categorías de stock
  getCategories: async () => {
    const response = await api.get('/settings/categories');
    return unwrap(response);
  },
  createCategory: async (data: { nombre: string; descripcion?: string }) => {
    const response = await api.post('/settings/categories', data);
    return unwrap(response);
  },
  updateCategory: async (id: string, data: { nombre?: string; descripcion?: string }) => {
    const response = await api.put(`/settings/categories/${id}`, data);
    return unwrap(response);
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/settings/categories/${id}`);
    return unwrap(response);
  },
};
export default settingsApi;
