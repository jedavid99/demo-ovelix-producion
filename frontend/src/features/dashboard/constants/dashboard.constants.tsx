import React from 'react';
import {
  MdSearch,
  MdBuild,
  MdHourglassEmpty,
} from 'react-icons/md';
import { getEstadoConfig } from '@/config/estadosReparacion.config';

export const getStatusBadge = (status: string) => {
  const config = getEstadoConfig(status);
  return {
    color: config.color,
    label: config.label,
  };
};

export const getStatusIcon = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s.includes('diagnostico') || s === 'diagnostic') return <MdSearch size={14} />;
  if (s.includes('reparacion') || s === 'in_progress') return <MdBuild size={14} />;
  if (s.includes('repuesto') || s === 'waiting_parts') return <MdHourglassEmpty size={14} />;
  return null;
};

export const getDeliveryBadge = (status: string) => {
  switch (status) {
    case 'Hoy':
      return { variant: 'success' as const, label: 'Hoy' };
    case 'Mañana':
      return { variant: 'default' as const, label: 'Mañana' };
    case 'Atrasado':
      return { variant: 'destructive' as const, label: 'Atrasado' };
    default:
      return { variant: 'secondary' as const, label: status };
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};