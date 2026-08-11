import { Package, MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import type { ProductFormData } from '../types';

interface InventorySectionProps {
  form: ProductFormData;
  onChange: (field: string, value: string) => void;
}

export function InventorySection({ form, onChange }: InventorySectionProps) {
  return (
    <FormSection icon={<Package size={18} className="text-primary" />} title="Detalles de inventario" index={1}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="initialQuantity" className="text-xs font-semibold">Cantidad inicial</Label>
          <Input id="initialQuantity" type="number" value={form.initialQuantity} onChange={e => onChange('initialQuantity', e.target.value)} placeholder="0" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="minStockLevel" className="text-xs font-semibold">Stock mínimo</Label>
          <Input id="minStockLevel" type="number" value={form.minStockLevel} onChange={e => onChange('minStockLevel', e.target.value)} placeholder="5" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="storageLocation" className="text-xs font-semibold flex items-center gap-1"><MapPin size={14} className="text-muted-foreground" /> Ubicación</Label>
          <Input id="storageLocation" value={form.storageLocation} onChange={e => onChange('storageLocation', e.target.value)} placeholder="Ej. Estante A-12" className="h-9 text-sm" />
        </div>
      </div>
    </FormSection>
  );
}
