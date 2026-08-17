import { useMemo } from 'react';
import { Calculator } from 'lucide-react';
import type { RepairCostPricing, TaxRate } from '../../types/repairCosts.types';

interface PricePreviewProps {
  base: number;
  rates: TaxRate[];
}

const formatARS = (n: number) => '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Muestra en vivo cuánto pagará el cliente según cada porcentaje activo. */
export function PricePreview({ base, rates }: PricePreviewProps) {
  const pricing = useMemo<RepairCostPricing[]>(
    () =>
      rates
        .filter((r) => r.activo && Number(r.porcentaje) > 0)
        .map((r) => ({
          id: r.id,
          nombre: r.nombre,
          porcentaje: Number(r.porcentaje),
          finalPrice: Math.round(base * (1 + Number(r.porcentaje) / 100) * 100) / 100,
        })),
    [base, rates],
  );

  const valid = !Number.isNaN(base) && base >= 0;

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2">
      {pricing.length === 0 ? (
        <div className="flex items-start gap-2">
          <Calculator size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            El cliente pagará, por ahora, el precio base. Agregá porcentajes en{' '}
            <span className="font-semibold text-foreground">Configuración → Porcentajes</span> y el final se calculará
            acá.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Calculator size={14} className="shrink-0 text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Lo que pagará el cliente
            </span>
          </div>
          <ul className="space-y-1.5">
            {pricing.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-xs text-muted-foreground">
                  {p.nombre} <span className="text-muted-foreground/70">(+{p.porcentaje}%)</span>
                </span>
                <span className="font-bold text-secondary tabular-nums">{valid ? formatARS(p.finalPrice) : '—'}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}