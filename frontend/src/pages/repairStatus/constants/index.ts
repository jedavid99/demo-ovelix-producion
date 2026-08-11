import { Search, Clock, CheckCircle, AlertCircle, Wrench, Package, Truck, XCircle } from 'lucide-react';
import { API_BASE } from '@/services/api';
import type { StatusConfig } from '../types';

export const API_URL = API_BASE;

export const statusConfig: Record<string, StatusConfig> = {
  PENDING: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    label: 'Pendiente',
    description: 'Su reparaci\u00F3n est\u00E1 pendiente de ser procesada',
  },
  DIAGNOSTIC: {
    icon: Search,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'En Diagn\u00F3stico',
    description: 'Estamos evaluando su dispositivo',
  },
  IN_PROGRESS: {
    icon: Wrench,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    label: 'En Progreso',
    description: 'Su reparaci\u00F3n est\u00E1 siendo realizada',
  },
  WAITING_PARTS: {
    icon: Package,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    label: 'Esperando Repuestos',
    description: 'Estamos esperando los repuestos necesarios',
  },
  READY: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-200',
    label: 'Lista para Entrega',
    description: 'Su reparaci\u00F3n est\u00E1 lista para ser retirada',
  },
  DELIVERED: {
    icon: Truck,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    label: 'Entregada',
    description: 'Su reparaci\u00F3n ha sido entregada',
  },
  CANCELLED: {
    icon: XCircle,
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Cancelada',
    description: 'La reparaci\u00F3n ha sido cancelada',
  },
  BUDGET_REJECTED: {
    icon: AlertCircle,
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Presupuesto Rechazado',
    description: 'El presupuesto fue rechazado por el cliente',
  },
  IRREPARABLE: {
    icon: XCircle,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    label: 'Irreparable',
    description: 'El dispositivo no puede ser reparado',
  },
  ENTREGADO: {
    icon: CheckCircle,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    label: 'Entregado',
    description: 'Su reparaci\u00F3n ha sido entregada',
  },
};

export const formatDate = (dateString: string) => {
  if (!dateString) return 'No especificada';
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatCurrency = (amount?: number) => {
  if (!amount) return 'No especificado';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};
