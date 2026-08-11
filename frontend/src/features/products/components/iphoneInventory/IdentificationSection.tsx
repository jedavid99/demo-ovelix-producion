import { Fingerprint, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

interface IdentificationSectionProps {
  formData: IPhoneFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof IPhoneFormData, value: string) => void;
}

export const IdentificationSection = ({ formData, errors, onFieldChange }: IdentificationSectionProps) => (
  <Card>
    <CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Fingerprint size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">2. Identificación única</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="imei1" className="text-xs font-semibold">IMEI 1</Label>
          <Input id="imei1" value={formData.imei1} onChange={(e) => onFieldChange('imei1', e.target.value)} placeholder="15 dígitos" className="h-9 text-sm" />
          {errors.imei1 && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.imei1}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imei2" className="text-xs font-semibold">IMEI 2 (eSIM)</Label>
          <Input id="imei2" value={formData.imei2} onChange={(e) => onFieldChange('imei2', e.target.value)} placeholder="Opcional" className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="serialNumber" className="text-xs font-semibold">Número de serie</Label>
          <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => onFieldChange('serialNumber', e.target.value)} placeholder="Ej. G6TXXXXXXX" className="h-9 text-sm" />
          {errors.serialNumber && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.serialNumber}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="partNumber" className="text-xs font-semibold">Número de pieza (MPN)</Label>
          <Input id="partNumber" value={formData.partNumber} onChange={(e) => onFieldChange('partNumber', e.target.value)} placeholder="Ej. MU7A3LL/A" className="h-9 text-sm" />
        </div>
      </div>
    </CardContent>
  </Card>
);
