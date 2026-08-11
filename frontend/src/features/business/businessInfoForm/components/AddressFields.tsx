import { MapPin } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface AddressFieldsProps {
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AddressFields({ direccion, ciudad, provincia, codigo_postal, errors, onChange }: AddressFieldsProps) {
  const fieldClass = (field: string) => errors[field] ? 'border-red-500' : '';

  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Dirección
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address-direccion" className="text-sm font-medium">Dirección <span className="text-destructive">*</span></label>
          <Input id="address-direccion" type="text" name="direccion" value={direccion} onChange={onChange} className={fieldClass('direccion')} />
          {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="address-ciudad" className="text-sm font-medium">Ciudad <span className="text-destructive">*</span></label>
          <Input id="address-ciudad" type="text" name="ciudad" value={ciudad} onChange={onChange} className={fieldClass('ciudad')} />
          {errors.ciudad && <p className="text-xs text-destructive">{errors.ciudad}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="address-provincia" className="text-sm font-medium">Provincia <span className="text-destructive">*</span></label>
          <Input id="address-provincia" type="text" name="provincia" value={provincia} onChange={onChange} className={fieldClass('provincia')} />
          {errors.provincia && <p className="text-xs text-destructive">{errors.provincia}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="address-codigo-postal" className="text-sm font-medium">Código Postal <span className="text-destructive">*</span></label>
          <Input id="address-codigo-postal" type="text" name="codigo_postal" value={codigo_postal} onChange={onChange} className={fieldClass('codigo_postal')} />
          {errors.codigo_postal && <p className="text-xs text-destructive">{errors.codigo_postal}</p>}
        </div>
      </div>
    </div>
  );
}
