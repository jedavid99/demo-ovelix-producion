import { TrendingUp, Percent } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { formatCurrency } from '@/utils/currency';
import type { ProductFormData } from '../types';
import type { TaxRate } from '@/features/settings/types/settings.types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
  taxRates: TaxRate[];
}

export function PricingSection({ form, onChange, taxRates }: Props) {
  const cost = parseFloat(form.costo_unitario) || 0;
  const price = parseFloat(form.precio_venta) || 0;
  const profit = price - cost;
  const selectedRate = taxRates.find(r => {
    if (cost <= 0) return false;
    const precioCalc = cost * (1 + Number(r.porcentaje) / 100);
    return Math.abs(precioCalc - price) < 0.01;
  });

  return (
    <FormSection title="Precios" index={2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="costo_unitario" className="text-xs font-semibold">Costo de compra *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              id="costo_unitario"
              type="number"
              min={0}
              step="0.01"
              value={form.costo_unitario}
              onChange={e => onChange('costo_unitario', e.target.value)}
              placeholder="0.00"
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="precio_venta" className="text-xs font-semibold">Precio de venta *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <input
              id="precio_venta"
              type="number"
              min={0}
              step="0.01"
              value={form.precio_venta}
              onChange={e => onChange('precio_venta', e.target.value)}
              placeholder="0.00"
              className="w-full h-9 pl-7 pr-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>
      {taxRates.length > 0 && (
        <div className="mt-3 space-y-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <Percent size={12} className="text-muted-foreground" /> Seleccionar margen
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {taxRates.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  if (cost > 0) {
                    onChange('precio_venta', (cost * (1 + Number(r.porcentaje) / 100)).toFixed(2));
                  }
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  selectedRate?.id === r.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-foreground hover:border-primary/50 hover:bg-muted'
                }`}
              >
                {r.nombre} ({Number(r.porcentaje)}%)
              </button>
            ))}
          </div>
        </div>
      )}
      {cost > 0 && price > 0 && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <TrendingUp size={14} className={profit >= 0 ? 'text-emerald-600' : 'text-destructive'} />
          <span className="text-xs text-muted-foreground">Ganancia:</span>
          <span className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
            {formatCurrency(profit)}
          </span>
          {selectedRate && (
            <span className="text-xs text-muted-foreground ml-1">({selectedRate.nombre} {Number(selectedRate.porcentaje)}%)</span>
          )}
        </div>
      )}
    </FormSection>
  );
}
