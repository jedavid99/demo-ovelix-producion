import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { DialogFooter } from '@/shared/components/ui/dialog';
import type { BrandOption, RepairCost, RepairCostForm, TaxRate } from '../../types/repairCosts.types';
import { loadBrandCatalog } from '../../services/repairCostsApi';
import { REPAIR_CATEGORIES } from '../../constants/repairCosts.constants';
import { BrandModelBuilder } from './BrandModelBuilder';
import { PricePreview } from './PricePreview';

interface CostFormFieldsProps {
  initial: RepairCost | null;
  categories: string[];
  taxRates: TaxRate[];
  submitting: boolean;
  onSubmit: (values: RepairCostForm) => Promise<void>;
  onCancel: () => void;
}

const EMPTY: RepairCostForm = {
  nombre: '',
  categoria: '',
  tipo_equipo: '',
  precio: 0,
  tiempo_estimado: '',
  descripcion: '',
  notas: '',
  modelo: null,
  marcas: [],
  modelos: [],
  activo: true,
};

function buildForm(initial: RepairCost | null): RepairCostForm {
  if (!initial) return { ...EMPTY };
  return {
    nombre: initial.nombre,
    categoria: initial.categoria,
    tipo_equipo: null,
    precio: Number(initial.precio) || 0,
    tiempo_estimado: initial.tiempo_estimado ?? '',
    descripcion: initial.descripcion ?? '',
    notas: initial.notas ?? '',
    modelo: null,
    marcas: (initial.marcas ?? []).map((m) => m.nombre),
    modelos: (initial.modelos ?? [])
      .filter((m) => m.marca?.nombre)
      .map((m) => ({ marca: m.marca.nombre, nombre: m.nombre })),
    activo: initial.activo,
  };
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-1.5 mb-3">
      {children}
    </p>
  );
}

export function CostFormFields({ initial, categories, taxRates, submitting, onSubmit, onCancel }: CostFormFieldsProps) {
  const [form, setForm] = useState<RepairCostForm>(() => buildForm(initial));
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandOption[]>([]);

  useEffect(() => {
    loadBrandCatalog()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, []);

  const set = <K extends keyof RepairCostForm>(key: K, value: RepairCostForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setMarcasModelos = (marcas: string[], modelos: { marca: string; nombre: string }[]) => {
    setForm((prev) => ({ ...prev, marcas, modelos }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!form.categoria.trim()) {
      setError('La categoría es obligatoria');
      return;
    }
    if (Number.isNaN(form.precio) || form.precio < 0) {
      setError('Ingresá un precio válido (mayor o igual a 0)');
      return;
    }
    setError(null);
    void onSubmit({
      ...form,
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      tipo_equipo: null,
      tiempo_estimado: (form.tiempo_estimado ?? '').trim() || null,
      descripcion: (form.descripcion ?? '').trim() || null,
      notas: (form.notas ?? '').trim() || null,
      modelo: null,
      marcas: Array.from(new Set(form.marcas.map((m) => m.trim()).filter(Boolean))),
      modelos: form.modelos.filter((m) => m.marca.trim() && m.nombre.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-6">
            <div>
              <SectionTitle>La solución</SectionTitle>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rc-nombre">Nombre</Label>
                  <Input
                    id="rc-nombre"
                    value={form.nombre}
                    onChange={(e) => set('nombre', e.target.value)}
                    placeholder="ej: PIN de carga"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rc-categoria">Categoría de la reparación</Label>
                  <select
                    id="rc-categoria"
                    value={form.categoria}
                    onChange={(e) => set('categoria', e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="" disabled>
                      Elegí el equipo…
                    </option>
                    {[
                      ...REPAIR_CATEGORIES.map((c) => c.label),
                      ...categories.filter((c) => !REPAIR_CATEGORIES.some((r) => r.label === c)),
                    ].map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Precio y tiempo</SectionTitle>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rc-precio">Precio base (lo que pagás)</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="rc-precio"
                      type="number"
                      min={0}
                      step="0.01"
                      value={Number.isNaN(form.precio) ? '' : form.precio}
                      onChange={(e) => set('precio', e.target.value === '' ? Number.NaN : Number(e.target.value))}
                      placeholder="10000"
                      className="pl-7"
                    />
                  </div>
                  <PricePreview base={Number.isNaN(form.precio) ? 0 : form.precio} rates={taxRates} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rc-tiempo">Tiempo estimado de la solución</Label>
                  <Input
                    id="rc-tiempo"
                    value={form.tiempo_estimado ?? ''}
                    onChange={(e) => set('tiempo_estimado', e.target.value)}
                    placeholder="ej: 1-2 horas"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <SectionTitle>Equipos que aplican</SectionTitle>
              <BrandModelBuilder
                brands={brands}
                selectedMarcas={form.marcas}
                selectedModelos={form.modelos}
                onChange={setMarcasModelos}
              />
            </div>

            <div className="space-y-2">
              <Label>Detalle para el público</Label>
              <Textarea
                id="rc-desc"
                value={form.descripcion ?? ''}
                onChange={(e) => set('descripcion', e.target.value)}
                placeholder="Qué incluye la solución, repuestos usados, alcance…"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rc-notas">Notas internas (solo las ves vos)</Label>
          <Textarea
            id="rc-notas"
            value={form.notas ?? ''}
            onChange={(e) => set('notas', e.target.value)}
            placeholder="Observaciones para el servicio técnico…"
            rows={2}
          />
        </div>

        <label className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 cursor-pointer select-none">
          <div>
            <p className="text-sm font-semibold text-foreground">Solución activa</p>
            <p className="text-xs text-muted-foreground">Visible en el tarifario y para tus clientes</p>
          </div>
          <Checkbox checked={form.activo} onCheckedChange={(v) => set('activo', v === true)} />
        </label>

        {error && (
          <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
            {error}
          </p>
        )}
      </div>

      <DialogFooter className="border-t border-border pt-4 mt-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 size={16} className="mr-2 animate-spin" />}
          {initial ? 'Guardar cambios' : 'Crear costo'}
        </Button>
      </DialogFooter>
    </form>
  );
}