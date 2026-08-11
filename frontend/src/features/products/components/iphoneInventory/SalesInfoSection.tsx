import { Tag } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { calcMargin, calcProfit } from '../../constants/iphoneInventory/inventory.constants';
import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

interface SalesInfoSectionProps {
  formData: IPhoneFormData;
  onFieldChange: (field: keyof IPhoneFormData, value: string) => void;
}

export const SalesInfoSection = ({ formData, onFieldChange }: SalesInfoSectionProps) => {
  const margin = calcMargin(formData.retailPrice, formData.purchaseCost);
  const profit = calcProfit(formData.retailPrice, formData.purchaseCost);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Tag size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground">4. Información de venta</h2>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="retailPrice" className="text-xs font-semibold">Precio de venta (SRP)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="retailPrice" type="number" step="0.01" value={formData.retailPrice} onChange={(e) => onFieldChange('retailPrice', e.target.value)} placeholder="0.00" className="h-9 pl-7 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="taxRate" className="text-xs font-semibold">Impuesto (%)</Label>
            <Input id="taxRate" type="number" step="0.1" value={formData.taxRate} onChange={(e) => onFieldChange('taxRate', e.target.value)} placeholder="0" className="h-9 text-sm" />
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Margen proyectado</span>
              <span className="text-xs font-bold text-success">+{margin}%</span>
            </div>
            <div className="text-xl font-bold text-foreground">${profit}</div>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(Math.max(parseFloat(margin) / 50 * 100, 0), 100)}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
