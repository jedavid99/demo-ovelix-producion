import { Badge } from '@/shared/components/ui/badge';
import { Calendar, Flag } from 'lucide-react';

interface StatusDatesCardsProps {
  estado: string;
  prioridad: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  getStatusBadge: (s: string) => { variant: 'warning' | 'default' | 'success' | 'destructive'; label: string };
  getPriorityBadge: (p: string) => { variant: 'default' | 'warning' | 'destructive'; label: string };
  formatDate: (d: string) => string;
}

export function StatusDatesCards({
  estado, prioridad, fecha_ingreso, fecha_estimada_entrega,
  getStatusBadge, getPriorityBadge, formatDate,
}: StatusDatesCardsProps) {
  const status = getStatusBadge(estado);
  const priority = getPriorityBadge(prioridad);

  return (
    <div className="px-6 py-4">
      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Estado</span>
          <Badge variant={status.variant} size="sm">{status.label}</Badge>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <Flag className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Prioridad</span>
          <Badge variant={priority.variant} size="sm">{priority.label}</Badge>
        </div>
      </div>

      {/* Dates row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>Ingreso: <span className="font-medium text-foreground">{formatDate(fecha_ingreso)}</span></span>
        </div>
        {fecha_estimada_entrega && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>Entrega estimada: <span className="font-medium text-foreground">{formatDate(fecha_estimada_entrega)}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
