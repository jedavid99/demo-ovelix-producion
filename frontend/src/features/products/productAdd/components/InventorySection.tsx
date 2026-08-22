import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import type { ProductFormData } from '../types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function InventorySection({ form, onChange }: Props) {
  return (
    <FormSection title="Inventario" index={1}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="stock_actual" className="text-xs font-semibold">Cantidad inicial</Label>
          <Input
            id="stock_actual"
            type="number"
            min={0}
            value={form.stock_actual}
            onChange={e => onChange('stock_actual', e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock_minimo" className="text-xs font-semibold">Stock mínimo</Label>
          <Input
            id="stock_minimo"
            type="number"
            min={0}
            value={form.stock_minimo}
            onChange={e => onChange('stock_minimo', e.target.value)}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock_maximo" className="text-xs font-semibold">Stock máximo</Label>
          <Input
            id="stock_maximo"
            type="number"
            min={0}
            value={form.stock_maximo}
            onChange={e => onChange('stock_maximo', e.target.value)}
            placeholder="Opcional"
            className="h-9 text-sm"
          />
        </div>
      </div>
    </FormSection>
  );
}
