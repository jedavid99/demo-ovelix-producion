import { Send, FileText, Bell, Clock } from 'lucide-react';
import type { Contact, MessagesState } from '../../whatsapp.types';

export const mockContacts: Contact[] = [
  { id: '1', name: 'Juan Pérez', phone: '+5491112345678', type: 'client', lastInteraction: new Date(Date.now() - 3600000) },
  { id: '2', name: 'María García', phone: '+5491198765432', type: 'client', lastInteraction: new Date(Date.now() - 86400000) },
  { id: '3', name: 'TechParts SA', phone: '+5491155555555', type: 'provider', lastInteraction: new Date(Date.now() - 172800000) },
  { id: '4', name: 'ElectroSupply', phone: '+5491166666666', type: 'provider', lastInteraction: new Date(Date.now() - 259200000) },
];

export const mockMessages: MessagesState = {
  '1': [
    { id: '1', from: 'contact', text: 'Hola, ¿cómo está mi reparación?', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', from: 'me', text: 'Hola Juan, tu reparación está en progreso. Te avisaremos cuando esté lista.', timestamp: new Date(Date.now() - 3500000) },
  ],
  '2': [
    { id: '3', from: 'contact', text: '¿Cuánto costaría cambiar la pantalla?', timestamp: new Date(Date.now() - 86400000) },
  ],
};

export const mockProducts = [
  { id: '1', name: 'Pantalla iPhone 13', price: 150000, stock: 5, category: 'Pantallas' },
  { id: '2', name: 'Batería Samsung S21', price: 45000, stock: 10, category: 'Baterías' },
  { id: '3', name: 'Cargador USB-C', price: 15000, stock: 20, category: 'Accesorios' },
];

export const mockOrders = [
  { id: '1', orderNumber: 'REP-20260712-0001', clientName: 'Juan Pérez', device: 'iPhone 13', status: 'in_progress', total: 150000 },
  { id: '2', orderNumber: 'REP-20260711-0002', clientName: 'María García', device: 'Samsung S21', status: 'completed', total: 45000 },
];

export const CACHE_DURATION = 5 * 60 * 1000;

export const CONNECTION_BENEFITS = [
  { icon: Send, title: 'Envío rápido de mensajes', description: 'Comunicación masiva o individual instantánea.' },
  { icon: FileText, title: 'Compartir catálogos y presupuestos', description: 'Sincroniza productos y envía cotizaciones en segundos.' },
  { icon: Bell, title: 'Notificaciones automáticas', description: 'Alertas de reparación, envíos y pagos.' },
  { icon: Clock, title: 'Mejor comunicación y seguimiento', description: 'Historial centralizado de interacciones.' },
];
