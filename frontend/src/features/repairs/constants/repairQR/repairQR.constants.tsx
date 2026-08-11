import React from 'react';
import { Clock, Wrench, CheckCircle, AlertCircle } from 'lucide-react';

export const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  diagnostic: { label: 'Diagnóstico', color: '#3B82F6', icon: <Clock className="w-4 h-4" /> },
  in_progress: { label: 'En Progreso', color: '#F59E0B', icon: <Wrench className="w-4 h-4" /> },
  waiting_parts: { label: 'Espera Repuesto', color: '#8B5CF6', icon: <Clock className="w-4 h-4" /> },
  ready: { label: 'Listo', color: '#10B981', icon: <CheckCircle className="w-4 h-4" /> },
  delivered: { label: 'Entregado', color: '#6B7280', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'Cancelado', color: '#EF4444', icon: <AlertCircle className="w-4 h-4" /> },
};

export const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  alta: { label: 'Alta', color: '#EF4444' },
  media: { label: 'Media', color: '#F59E0B' },
  baja: { label: 'Baja', color: '#10B981' },
};
