import React from 'react';
import { ArrowLeft, User, Smartphone, Hash } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getEstadoConfig } from '@/config/estadosReparacion.config';
import type { RepairData, FormData } from './RepairEdit.types';

interface EditHeaderProps {
  repairData: RepairData | null;
  formData: FormData;
}

export const EditHeader: React.FC<EditHeaderProps> = ({ repairData, formData }) => {
  const navigate = useNavigate();
  const estadoConfig = getEstadoConfig(formData.estado);

  return (
    <div className="rounded-xl border bg-card shadow-sm mb-6 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/reparaciones/list')} aria-label="Volver" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">Editar Reparación</h1>
              <p className="text-sm text-muted-foreground">
                {repairData?.numero_reparacion || `#${repairData?.id?.slice(0, 8)}`}
              </p>
            </div>
          </div>
          <Badge
            className="text-sm px-3 py-1.5"
            style={{
              backgroundColor: estadoConfig.color + '20',
              color: estadoConfig.color,
              borderColor: estadoConfig.color + '40',
            }}
          >
            {estadoConfig.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="text-sm font-medium truncate">{repairData?.cliente_nombre || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
              <Smartphone className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Dispositivo</p>
              <p className="text-sm font-medium truncate">
                {[repairData?.marca, repairData?.modelo].filter(Boolean).join(' ') || repairData?.dispositivo || '—'}
              </p>
            </div>
          </div>
          {repairData?.cliente_telefono && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium">{repairData.cliente_telefono}</p>
              </div>
            </div>
          )}
          {repairData?.cliente_dni && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                <Hash className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">DNI</p>
                <p className="text-sm font-medium">{repairData.cliente_dni}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
