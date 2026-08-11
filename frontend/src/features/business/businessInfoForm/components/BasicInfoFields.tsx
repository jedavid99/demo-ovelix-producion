import { Building2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface BasicInfoFieldsProps {
  nombre_negocio: string;
  propietario_nombre: string;
  descripcion: string;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInfoFields({ nombre_negocio, propietario_nombre, descripcion, errors, onChange }: BasicInfoFieldsProps) {
  const fieldClass = (field: string) => errors[field] ? 'border-red-500' : '';

  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Building2 className="w-4 h-4" /> Información Básica
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="basic-nombre" className="text-sm font-medium">Nombre del Negocio <span className="text-destructive">*</span></label>
          <Input id="basic-nombre" type="text" name="nombre_negocio" value={nombre_negocio} onChange={onChange} className={fieldClass('nombre_negocio')} />
          {errors.nombre_negocio && <p className="text-xs text-destructive">{errors.nombre_negocio}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="basic-propietario" className="text-sm font-medium">Nombre del Propietario <span className="text-destructive">*</span></label>
          <Input id="basic-propietario" type="text" name="propietario_nombre" value={propietario_nombre} onChange={onChange} className={fieldClass('propietario_nombre')} />
          {errors.propietario_nombre && <p className="text-xs text-destructive">{errors.propietario_nombre}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="basic-descripcion" className="text-sm font-medium">Descripción</label>
        <Textarea id="basic-descripcion" name="descripcion" value={descripcion} onChange={onChange} rows={3} placeholder="Describe tu negocio..." />
      </div>
    </div>
  );
}
