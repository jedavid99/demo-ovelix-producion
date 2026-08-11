import { Phone } from 'lucide-react';
import { FormSection } from './FormSection';
import { FormInputField } from './FormInputField';
import type { ProviderFormData } from '../types';

interface ContactSectionProps {
  form: ProviderFormData;
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
}

export function ContactSection({ form, errors, onChange }: ContactSectionProps) {
  return (
    <FormSection icon={<Phone size={18} className="text-primary" />} title="Contacto principal" index={1}>
      <FormInputField
        id="contactName" label="Nombre del contacto" required
        value={form.contactName}
        onChange={v => onChange('contactName', v)}
        placeholder="Juan Pérez"
        error={errors.contactName}
      />
      <FormInputField
        id="role" label="Cargo / Puesto"
        value={form.role}
        onChange={v => onChange('role', v)}
        placeholder="Gerente de Cuentas"
      />
      <FormInputField
        id="phone" label="Teléfono directo" required
        value={form.phone}
        onChange={v => onChange('phone', v)}
        placeholder="+34 600 000 000"
        error={errors.phone}
      />
      <FormInputField
        id="email" label="Correo electrónico" required spanFull
        value={form.email}
        onChange={v => onChange('email', v)}
        placeholder="juan@proveedor.com"
        type="email"
        error={errors.email}
      />
    </FormSection>
  );
}
