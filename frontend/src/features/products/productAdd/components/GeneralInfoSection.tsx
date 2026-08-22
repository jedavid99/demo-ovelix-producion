import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { CATEGORIES } from '../constants';
import type { ProductFormData } from '../types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: any) => void;
}

export function GeneralInfoSection({ form, onChange }: Props) {
  return (
    <FormSection title="Información general" index={0}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="codigo" className="text-xs font-semibold">Código *</Label>
          <Input
            id="codigo"
            value={form.codigo}
            onChange={e => onChange('codigo', e.target.value)}
            placeholder="Ej. SCRN-IP13-001"
            className="h-9 text-sm font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nombre" className="text-xs font-semibold">Nombre del producto *</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={e => onChange('nombre', e.target.value)}
            placeholder="Ej. Pantalla OLED iPhone 13"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoria" className="text-xs font-semibold">Categoría</Label>
          <select
            id="categoria"
            value={form.categoria}
            onChange={e => onChange('categoria', e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="marca" className="text-xs font-semibold">Marca</Label>
          <Input
            id="marca"
            value={form.marca}
            onChange={e => onChange('marca', e.target.value)}
            placeholder="Ej. Apple OEM"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="modelo" className="text-xs font-semibold">Modelo</Label>
          <Input
            id="modelo"
            value={form.modelo}
            onChange={e => onChange('modelo', e.target.value)}
            placeholder="Ej. iPhone 13 Pro"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="proveedor_nombre" className="text-xs font-semibold">Proveedor</Label>
          <Input
            id="proveedor_nombre"
            value={form.proveedor_nombre}
            onChange={e => onChange('proveedor_nombre', e.target.value)}
            placeholder="Ej. TechParts SRL"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ubicacion" className="text-xs font-semibold">Ubicación en almacén</Label>
          <Input
            id="ubicacion"
            value={form.ubicacion_almacen}
            onChange={e => onChange('ubicacion_almacen', e.target.value)}
            placeholder="Ej. Estante A-12"
            className="h-9 text-sm"
          />
        </div>
      </div>
      <div className="space-y-1.5 mt-4">
        <Label htmlFor="descripcion" className="text-xs font-semibold">Descripción</Label>
        <textarea
          id="descripcion"
          value={form.descripcion}
          onChange={e => onChange('descripcion', e.target.value)}
          placeholder="Detalles técnicos, compatibilidad, etc."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>
    </FormSection>
  );
}
