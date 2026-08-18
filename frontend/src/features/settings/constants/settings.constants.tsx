import React from 'react';
import { Building2, Globe, FileText, Tags, Percent, Bell, Cloud, Crown } from 'lucide-react';
import type { Section, SectionGroup } from '../types/settings.types';

export const SECTION_GROUPS: { id: SectionGroup; label: string }[] = [
  { id: 'negocio', label: 'Negocio' },
  { id: 'operacion', label: 'Operación' },
  { id: 'sistema', label: 'Sistema' },
];

export function getSectionMeta(id: string): { icon: React.ReactNode; eyebrow: string; label: string; description: string } {
  const section = SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
  const group = SECTION_GROUPS.find((g) => g.id === section.group);
  return {
    icon: section.icon,
    eyebrow: group?.label ?? '',
    label: section.label,
    description: section.description,
  };
}

export const SECTIONS: Section[] = [
  {
    id: 'business',
    label: 'Perfil del negocio',
    icon: <Building2 size={16} />,
    group: 'negocio',
    description: 'Datos de tu negocio, estados de reparación y métodos de pago aceptados.',
  },
  {
    id: 'tenantPage',
    label: 'Página de presupuesto',
    icon: <Globe size={16} />,
    group: 'negocio',
    description: 'La página pública que tus clientes usan para valuar, consultar y reservar.',
  },
  {
    id: 'pdf',
    label: 'Configuración PDF',
    icon: <FileText size={16} />,
    group: 'negocio',
    description: 'Personalizá la orden de servicio que se genera para cada reparación.',
  },
  {
    id: 'Categoria',
    label: 'Categorías de stock',
    icon: <Tags size={16} />,
    group: 'operacion',
    description: 'Organizá el inventario por categorías para encontrarlo más rápido.',
  },
  {
    id: 'taxes',
    label: 'Impuestos y pagos',
    icon: <Percent size={16} />,
    group: 'operacion',
    description: 'Porcentajes de impuestos y cuentas bancarias para cobros y facturas.',
  },
  {
    id: 'notificationes',
    label: 'Notificaciones',
    icon: <Bell size={16} />,
    group: 'operacion',
    description: 'Elegí qué eventos generan alertas dentro del sistema.',
  },
  {
    id: 'api',
    label: 'API e integraciones',
    icon: <Cloud size={16} />,
    group: 'sistema',
    description: 'Servicios de terceros conectados a tu cuenta.',
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: <Crown size={16} />,
    group: 'sistema',
    description: 'Plan contratado, vencimiento y renovación de tu cuenta.',
  },
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