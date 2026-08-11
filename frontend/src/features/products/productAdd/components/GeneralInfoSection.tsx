import { Info, Layers, Tag } from 'lucide-react';
import { MdBarcodeReader } from 'react-icons/md';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { CATEGORIES } from '../constants';
import type { ProductFormData } from '../types';

interface GeneralInfoSectionProps {
  form: ProductFormData;
  onChange: (field: string, value: string) => void;
}

export function GeneralInfoSection({ form, onChange }: GeneralInfoSectionProps) {
  return (
    <FormSection icon={<Info size={18} className="text-primary" />} title="Información general" index={0}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label htmlFor="itemName" className="text-xs font-semibold">Nombre del producto</Label>
          <Input id="itemName" value={form.itemName} onChange={e => onChange('itemName', e.target.value)} placeholder="Ej. Pantalla OLED iPhone 13" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="sku" className="text-xs font-semibold flex items-center gap-1"><MdBarcodeReader size={14} className="text-muted-foreground" /> SKU</Label>
          <Input id="sku" value={form.sku} onChange={e => onChange('sku', e.target.value)} placeholder="Ej. SCRN-IP13-001" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="category" className="text-xs font-semibold flex items-center gap-1"><Layers size={14} className="text-muted-foreground" /> Categoría</Label>
          <select id="category" value={form.category} onChange={e => onChange('category', e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
            {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="brand" className="text-xs font-semibold flex items-center gap-1"><Tag size={14} className="text-muted-foreground" /> Marca</Label>
          <Input id="brand" value={form.brand} onChange={e => onChange('brand', e.target.value)} placeholder="Ej. Apple OEM" className="h-9 text-sm" />
        </div>
      </div>
    </FormSection>
  );
}
