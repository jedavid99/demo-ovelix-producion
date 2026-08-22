import { Label } from '@/shared/components/ui/label';
import { FormSection } from './FormSection';
import { CANALES_VENTA_LABELS, CANALES_VENTA_COLORS } from '@/types/stock.types';
import type { ProductFormData } from '../types';
import type { CanalVenta } from '@/types/stock.types';

interface Props {
  form: ProductFormData;
  onChange: (field: keyof ProductFormData, value: any) => void;
}

const TIPO_PRODUCTO_OPTIONS = [
  { value: 'repuesto', label: 'Repuesto' },
  { value: 'venta', label: 'Venta' },
  { value: 'ambos', label: 'Repuesto y Venta' },
];

const TIPO_PRECIO_OPTIONS = [
  { value: 'minorista', label: 'Minorista' },
  { value: 'mayorista', label: 'Mayorista' },
];

export function ProductTypeSection({ form, onChange }: Props) {
  const toggleCanal = (canal: CanalVenta) => {
    const current = Array.isArray(form.canales_venta) ? form.canales_venta : [];
    const next = current.includes(canal)
      ? current.filter(c => c !== canal)
      : [...current, canal];
    onChange('canales_venta', next);
  };

  return (
    <FormSection title="Tipo de producto y canales de venta" index={3}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Tipo de producto</Label>
          <div className="flex gap-1.5">
            {TIPO_PRODUCTO_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('tipo_producto', opt.value)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  form.tipo_producto === opt.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-foreground hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Tipo de precio</Label>
          <div className="flex gap-1.5">
            {TIPO_PRECIO_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange('tipo_precio', opt.value)}
                className={`flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  form.tipo_precio === opt.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-muted/50 text-foreground hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1.5 mt-4">
        <Label className="text-xs font-semibold">Canales de venta</Label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(CANALES_VENTA_LABELS) as [CanalVenta, string][]).map(([key, label]) => {
            const active = Array.isArray(form.canales_venta) && form.canales_venta.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleCanal(key)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  active
                    ? `${CANALES_VENTA_COLORS[key]} border-current`
                    : 'border-border bg-muted/50 text-foreground hover:border-primary/50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.es_por_encargo}
            onChange={e => onChange('es_por_encargo', e.target.checked)}
            className="rounded border-input"
          />
          <span className="text-xs font-medium text-foreground">Producto por encargo</span>
        </label>
        {form.es_por_encargo && (
          <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
            Stock fijo en 1, se muestra como "Por encargo"
          </span>
        )}
      </div>
    </FormSection>
  );
}
