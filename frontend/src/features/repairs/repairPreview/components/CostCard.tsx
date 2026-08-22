import { DollarSign } from 'lucide-react';

interface CostCardProps {
  total_reparacion: number | string;
  repuestosTotal: number;
  hasRepuestos: boolean;
  formatCurrency: (v: number | string) => string;
}

export function CostCard({ total_reparacion, repuestosTotal, hasRepuestos, formatCurrency }: CostCardProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Costo</span>
      </div>
      {hasRepuestos && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Repuestos</span>
          <span className="tabular-nums">{formatCurrency(repuestosTotal)}</span>
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <span className="text-sm font-semibold">Total</span>
        <span className="text-lg font-bold tabular-nums text-primary">{formatCurrency(total_reparacion)}</span>
      </div>
    </div>
  );
}
