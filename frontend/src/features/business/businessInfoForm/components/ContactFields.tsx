import { Mail, Globe } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface ContactFieldsProps {
  email: string;
  telefono: string;
  sitio_web: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactFields({ email, telefono, sitio_web, errors, onChange }: ContactFieldsProps) {
  const fieldClass = (field: string) => errors[field] ? 'border-red-500' : '';

  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Mail className="w-4 h-4" /> Información de Contacto
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
          <Input id="contact-email" type="email" name="email" value={email} onChange={onChange} className={fieldClass('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-telefono" className="text-sm font-medium">Teléfono <span className="text-destructive">*</span></label>
          <Input id="contact-telefono" type="tel" name="telefono" value={telefono} onChange={onChange} placeholder="+54 11 1234 5678" className={fieldClass('telefono')} />
          {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="contact-web" className="text-sm font-medium flex items-center gap-2"><Globe className="w-4 h-4" /> Sitio Web</label>
          <Input id="contact-web" type="url" name="sitio_web" value={sitio_web} onChange={onChange} placeholder="https://..." />
        </div>
      </div>
    </div>
  );
}
