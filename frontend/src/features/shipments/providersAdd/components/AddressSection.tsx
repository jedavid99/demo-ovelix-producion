import { MapPin } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { FormInputField } from './FormInputField';
import { INCOTERMS_OPTIONS, LEAD_TIME_OPTIONS } from '../constants';
import type { ProviderFormData } from '../types';

interface AddressSectionProps {
  form: ProviderFormData;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export function AddressSection({ form, errors, onChange }: AddressSectionProps) {
  return (
    <FormSection icon={<MapPin size={18} className="text-primary" />} title="Dirección y envío" index={3}>
      <FormInputField
        id="address" label="Dirección" required spanFull
        value={form.address}
        onChange={v => onChange('address', v)}
        placeholder="Calle, número, parque industrial"
        error={errors.address}
      />
      <FormInputField
        id="city" label="Ciudad" required
        value={form.city}
        onChange={v => onChange('city', v)}
        placeholder="Madrid"
        error={errors.city}
      />
      <FormInputField
        id="postal" label="Código postal"
        value={form.postal}
        onChange={v => onChange('postal', v)}
        placeholder="28001"
      />
      <div className="space-y-1">
        <Label htmlFor="incoterms" className="text-xs font-semibold">Términos de envío</Label>
        <select
          id="incoterms"
          value={form.incoterms}
          onChange={e => onChange('incoterms', e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        >
          {INCOTERMS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="leadTime" className="text-xs font-semibold">Tiempo de entrega</Label>
        <select
          id="leadTime"
          value={form.leadTime}
          onChange={e => onChange('leadTime', e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        >
          {LEAD_TIME_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </FormSection>
  );
}
