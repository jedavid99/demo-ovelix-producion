import { Card, CardContent } from '@/shared/components/ui/card';
import type { IPhoneRecordForm } from '../types';

interface ProductSelectionProps {
  formData: IPhoneRecordForm;
  onInputChange: (field: string, value: string | number) => void;
}

export function ProductSelection({ formData, onInputChange }: ProductSelectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">1</div>
          <h2 className="text-foreground text-xl font-bold">Selección de Producto</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Modelo iPhone</span>
            <select
              value={formData.model}
              onChange={(e) => onInputChange('model', e.target.value)}
              className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
            >
              <option>iPhone 15 Pro Max</option>
              <option>iPhone 15 Pro</option>
              <option>iPhone 15 Plus</option>
              <option>iPhone 15</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Variante de Color</span>
            <select
              value={formData.color}
              onChange={(e) => onInputChange('color', e.target.value)}
              className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
            >
              <option>Titanio Negro</option>
              <option>Titanio Natural</option>
              <option>Titanio Azul</option>
              <option>Titanio Blanco</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Número IMEI</span>
            <input
              type="text"
              value={formData.imei}
              onChange={(e) => onInputChange('imei', e.target.value)}
              placeholder="IMEI de 15 dígitos"
              className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
