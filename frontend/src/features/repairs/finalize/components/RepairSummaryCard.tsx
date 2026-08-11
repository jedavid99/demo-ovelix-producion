import { Smartphone, Check } from 'lucide-react';
import type { RepairData } from '../../RepairFlow';

interface RepairSummaryCardProps {
  state: RepairData;
}

export function RepairSummaryCard({ state }: RepairSummaryCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Smartphone size={20} className="text-primary" />
          Resumen de Reparación
        </h2>
        <span className="text-muted-foreground font-mono bg-muted px-3 py-1 rounded border border-border text-sm">#REP-001</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex gap-4">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
            <Smartphone size={28} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Detalles del Dispositivo</p>
            <p className="text-base font-bold text-foreground">{state.brand} {state.model || 'Device'}</p>
            <p className="text-xs text-muted-foreground">SN: {state.serial || 'N/A'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="size-14 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
            <span className="text-lg font-bold">{state.selectedClient?.name.charAt(0) || 'C'}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Cliente</p>
            <p className="text-base font-bold text-foreground">{state.selectedClient?.name || 'Cliente'}</p>
            <p className="text-xs text-muted-foreground">{state.selectedClient?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Servicios Realizados</h4>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border text-sm text-foreground">
              <Check size={16} className="text-success" />
              {state.issueDescription || 'Reparación General'}
            </span>
          </div>
        </div>
        {state.technicianNotes && (
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Notas del Técnico</h4>
            <div className="bg-primary/5/50 p-4 rounded-lg border border-blue-100 text-sm text-foreground italic">
              {state.technicianNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
