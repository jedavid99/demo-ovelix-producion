import { DollarSign, Percent } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import type { ProductFormData } from '../types';

interface PricingSectionProps {
  form: ProductFormData;
  onChange: (field: string, value: string) => void;
}

export function PricingSection({ form, onChange }: PricingSectionProps) {
  return (
    <FormSection icon={<DollarSign size={18} className="text-primary" />} title="Precios" index={2}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="purchaseCost" className="text-xs font-semibold">Costo de compra ($)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="purchaseCost" value={form.purchaseCost} onChange={e => onChange('purchaseCost', e.target.value)} placeholder="0.00" className="h-9 pl-7 text-sm" />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="sellingPrice" className="text-xs font-semibold">Precio de venta ($)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="sellingPrice" value={form.sellingPrice} onChange={e => onChange('sellingPrice', e.target.value)} placeholder="0.00" className="h-9 pl-7 text-sm" />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="tax" className="text-xs font-semibold flex items-center gap-1"><Percent size={14} className="text-muted-foreground" /> Impuesto (%)</Label>
          <div className="relative">
            <Input id="tax" value={form.tax} onChange={e => onChange('tax', e.target.value)} placeholder="0" className="h-9 pr-7 text-sm" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
