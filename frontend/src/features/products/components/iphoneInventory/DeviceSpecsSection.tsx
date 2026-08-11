import { Smartphone, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { COLORS, MODELS, STORAGE_OPTIONS } from '../../constants/iphoneInventory/inventory.constants';
import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

interface DeviceSpecsSectionProps {
  formData: IPhoneFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof IPhoneFormData, value: string) => void;
}

export const DeviceSpecsSection = ({ formData, errors, onFieldChange }: DeviceSpecsSectionProps) => (
  <Card>
    <CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Smartphone size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">1. Modelo y especificaciones</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="model" className="text-xs font-semibold">Modelo</Label>
          <select id="model" value={formData.model} onChange={(e) => onFieldChange('model', e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.model && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.model}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="storage" className="text-xs font-semibold">Capacidad</Label>
          <select id="storage" value={formData.storage} onChange={(e) => onFieldChange('storage', e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            {STORAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.storage && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.storage}</p>}
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Color</Label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button key={c.value} onClick={() => onFieldChange('color', c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c.value ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                style={{ backgroundColor: c.value.includes('White') ? '#f5f5f5' : undefined }} title={c.name} />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Condición</Label>
          <div className="flex gap-2">
            {(['New', 'Refurbished'] as const).map((cond) => (
              <button key={cond} onClick={() => onFieldChange('condition', cond)}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-all ${formData.condition === cond ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                {cond === 'New' ? 'Nuevo' : 'Reacondicionado'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
