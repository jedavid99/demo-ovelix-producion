import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { SUPPLIERS } from '../../constants/iphoneInventory/inventory.constants';
import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

interface SupplySectionProps {
  formData: IPhoneFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof IPhoneFormData, value: string) => void;
}

export const SupplySection = ({ formData, errors, onFieldChange }: SupplySectionProps) => (
  <Card>
    <CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <ShoppingCart size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">3. Abastecimiento</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="supplier" className="text-xs font-semibold">Proveedor</Label>
          <select id="supplier" value={formData.supplier} onChange={(e) => onFieldChange('supplier', e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {SUPPLIERS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="purchaseDate" className="text-xs font-semibold">Fecha de compra</Label>
          <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={(e) => onFieldChange('purchaseDate', e.target.value)} className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="purchaseCost" className="text-xs font-semibold">Costo de compra (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input id="purchaseCost" type="number" step="0.01" value={formData.purchaseCost} onChange={(e) => onFieldChange('purchaseCost', e.target.value)} placeholder="0.00" className="h-9 pl-7 text-sm" />
          </div>
          {errors.purchaseCost && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.purchaseCost}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
