import React from 'react';
import { Cloud, Clock, Plus, Key, Bell, FileText, CreditCard, Globe } from 'lucide-react';
import type { Section } from '../types/settings.types';

export const SECTIONS: Section[] = [
  { id: 'business', label: 'Perfil del negocio', icon: <Clock size={16} /> },
  { id: 'tenantPage', label: 'Página de presupuesto', icon: <Globe size={16} /> },
  { id: 'Categoria', label: 'Categorías de stock', icon: <Plus size={16} /> },
  { id: 'taxes', label: 'Impuestos y pagos', icon: <Key size={16} /> },
  { id: 'notificationes', label: 'Notificaciones', icon: <Bell size={16} /> },
  { id: 'api', label: 'API e integraciones', icon: <Cloud size={16} /> },
  { id: 'plan', label: 'Plan', icon: <CreditCard size={16} /> },
  { id: 'pdf', label: 'Configuración PDF', icon: <FileText size={16} /> },
];

export const CURRENCY_OPTIONS = [
  { value: '', label: 'Seleccionar moneda' },
  { value: 'ARS', label: 'ARS ($) — Argentina' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
];

export const DATE_FORMAT_OPTIONS = [
  { value: '', label: 'Seleccionar formato' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

export const TIMEZONE_OPTIONS = [
  { value: '', label: 'Seleccionar zona' },
  { value: 'America/Argentina/Buenos_Aires', label: '(UTC-03:00) Buenos Aires' },
  { value: 'America/Argentina/Cordoba', label: '(UTC-03:00) Córdoba' },
  { value: 'America/Argentina/Mendoza', label: '(UTC-03:00) Mendoza' },
  { value: 'America/Argentina/Ushuaia', label: '(UTC-03:00) Ushuaia' },
  { value: 'UTC-05:00', label: '(UTC-05:00) Bogotá' },
  { value: 'UTC+00:00', label: '(UTC+00:00) London' },
];

export const NOTIFICATION_EVENTS = [
  { name: 'Nuevo ticket creado', description: 'Se envía cuando se abre una nueva orden de reparación', color: 'blue' },
  { name: 'Reparación finalizada', description: 'Se envía cuando el estado cambia a "Listo para recoger"', color: 'green' },
  { name: 'Pago vencido', description: 'Se envía cuando una factura permanece impagada después de la fecha de vencimiento', color: 'amber' },
];

export const EMPTY_BUSINESS_INFO = {
  id: '',
  empresa_id: '',
  nombre_negocio: '',
  propietario_nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  codigo_postal: '',
  sitio_web: '',
  descripcion: '',
  horarios: {
    lunes: '09:00-18:00',
    martes: '09:00-18:00',
    miercoles: '09:00-18:00',
    jueves: '09:00-18:00',
    viernes: '09:00-18:00',
    sabado: '09:00-13:00',
    domingo: 'Cerrado',
  },
  moneda: 'ARS',
  formato_fecha: 'DD/MM/YYYY',
  zona_horaria: 'America/Argentina/Buenos_Aires',
  fecha_creacion: new Date().toISOString(),
  fecha_actualizacion: new Date().toISOString(),
};
