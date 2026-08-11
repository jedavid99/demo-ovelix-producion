import axios from 'axios';

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')
).replace(/\/$/, '');

const API_URL = API_BASE;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: agrega token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para limpiar el token de localStorage y headers de Axios
export const clearAuthToken = () => {
  localStorage.removeItem('access_token');
  delete api.defaults.headers.common['Authorization'];
};

// Rutas públicas que no deben redirigir en caso de 401
const publicRoutes = ['/auth/login', '/auth/register'];

// Interceptor response: maneja 401 solo en rutas protegidas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Verificar si es 401 y NO es una ruta pública
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some(route => 
        originalRequest.url?.includes(route)
      );
      
      if (!isPublicRoute) {
        // Eliminar token y redirigir solo en rutas protegidas
        clearAuthToken();
        // Disparar evento para notificar al AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(error);
  }
);

// WhatsApp API functions
export const whatsappApi = {
  getStatus: () => api.get('/whatsapp/status'),
  getQRImage: () => api.get('/whatsapp/qr.png', { responseType: 'blob' }),
  generateQR: () => api.post('/whatsapp/generate-qr'),
  regenerateQR: () => api.post('/whatsapp/regenerate-qr'),
  disconnect: () => api.post('/whatsapp/disconnect'),
  send: (to: string, message: string) => api.post('/whatsapp/send', { to, message }),
  sendImage: (to: string, imageUrl: string, caption?: string) =>
    api.post('/whatsapp/send-image', { to, imageUrl, caption }),
  sendDocument: (to: string, pdfUrl: string, filename: string, caption?: string) =>
    api.post('/whatsapp/send-document', { to, pdfUrl, filename, caption }),
  getChats: () => api.get('/whatsapp/chats'),
  getMessages: (jid: string, limit?: number) =>
    api.get('/whatsapp/messages', { params: { jid, limit } }),
  sendToClient: (clienteId: string, message: string) =>
    api.post('/whatsapp/send-to-client', { clienteId, message }),
  getClientMessages: (clienteId: string, page?: number, limit?: number) =>
    api.get(`/whatsapp/messages/client/${clienteId}`, { params: { page, limit } }),
  getClients: () => api.get('/whatsapp/clients'),
  sendOrderPdf: (clienteId: string, repairId: string, caption?: string) =>
    api.post('/whatsapp/send-order-pdf', { clienteId, repairId, caption }),
  requestPairingCode: (phoneNumber: string) =>
    api.post('/whatsapp/request-pairing-code', { phoneNumber }),
};

// Clients API functions
export const clientsApi = {
  getAll: (page?: number, limit?: number, search?: string) => 
    api.get('/clients', { params: { page, limit, search } }),
  getById: (id: string) => api.get(`/clients/${id}`),
};

// Repairs API functions
export const repairsApi = {
  getByClient: (clienteId: string) =>
    api.get(`/repairs/client/${clienteId}`),
  getPdf: (id: string) =>
    api.get(`/repairs/${id}/pdf`, { responseType: 'blob' }),
};

export default api;
