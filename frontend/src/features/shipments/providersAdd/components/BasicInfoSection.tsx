import { Info } from 'lucide-react';
import { FormSection } from './FormSection';
import { FormInputField } from './FormInputField';
import type { ProviderFormData } from '../types';

interface BasicInfoSectionProps {
  form: ProviderFormData;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export function BasicInfoSection({ form, errors, onChange }: BasicInfoSectionProps) {
  return (
    <FormSection icon={<Info size={18} className="text-primary" />} title="Información básica" index={0}>
      <FormInputField
        id="businessName" label="Nombre del negocio" required spanFull
        value={form.businessName}
        onChange={v => onChange('businessName', v)}
        placeholder="Ej. Soluciones Tecnológicas Globales"
        error={errors.businessName}
      />
      <FormInputField
        id="taxId" label="NIF / CIF"
        value={form.taxId}
        onChange={v => onChange('taxId', v)}
        placeholder="XX-123456789"
      />
      <FormInputField
        id="website" label="Sitio web"
        value={form.website}
        onChange={v => onChange('website', v)}
        placeholder="https://www.proveedor.com"
        type="url"
      />
    </FormSection>
  );
}
