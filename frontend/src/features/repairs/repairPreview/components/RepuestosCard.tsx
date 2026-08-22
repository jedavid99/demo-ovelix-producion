import { Package } from 'lucide-react';

interface Repuesto {
  nombre: string;
  cantidad: number;
  costo_unitario: number | string;
}

interface RepuestosCardProps {
  repuestos: Repuesto[];
  formatCurrency: (v: number | string) => string;
  calculateTotal: () => number;
}

export function RepuestosCard({ repuestos, formatCurrency, calculateTotal }: RepuestosCardProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Repuestos ({repuestos.length})
        </span>
      </div>
      <div className="space-y-1.5">
        {repuestos.map((repuesto, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-foreground truncate mr-3">{repuesto.nombre}</span>
            <span className="text-muted-foreground shrink-0 tabular-nums">
              {repuesto.cantidad} x {formatCurrency(repuesto.costo_unitario)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm font-semibold pt-2 mt-2 border-t border-border/60">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">{formatCurrency(calculateTotal())}</span>
        </div>
      </div>
    </div>
  );
}
