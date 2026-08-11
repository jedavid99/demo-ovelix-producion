import { Smartphone, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { MODELS } from '../../constants/iphoneInsurance/insurance.constants';
import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

interface DeviceInfoSectionProps {
  formData: InsuranceFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof InsuranceFormData, value: string) => void;
}

export const DeviceInfoSection = ({ formData, errors, onFieldChange }: DeviceInfoSectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Smartphone size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">Información del Dispositivo</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="imei" className="text-xs font-semibold">IMEI *</Label>
          <Input id="imei" value={formData.imei} onChange={(e) => onFieldChange('imei', e.target.value)} placeholder="15 dígitos" className="h-8 text-sm" />
          {errors.imei && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.imei}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="serialNumber" className="text-xs font-semibold">Número de Serie *</Label>
          <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => onFieldChange('serialNumber', e.target.value)} placeholder="Ej. G6TXXXXXXX" className="h-8 text-sm" />
          {errors.serialNumber && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.serialNumber}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="model" className="text-xs font-semibold">Modelo *</Label>
          <select id="model" value={formData.model} onChange={(e) => onFieldChange('model', e.target.value)}
            className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">Seleccionar</option>
            {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.model && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.model}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
