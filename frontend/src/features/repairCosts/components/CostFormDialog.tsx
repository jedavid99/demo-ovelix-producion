import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import type { RepairCost, RepairCostForm } from '../types/repairCosts.types';
import { EQUIPMENT_TYPES } from '@/shared/lib/equipmentTypes';

interface CostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: RepairCost | null;
  categories: string[];
  submitting: boolean;
  onSubmit: (values: RepairCostForm) => Promise<void>;
}

const EMPTY: RepairCostForm = {
  nombre: '',
  categoria: '',
  tipo_equipo: '',
  precio: 0,
  tiempo_estimado: '',
  descripcion: '',
  notas: '',
  modelo: '',
  activo: true,
};

function buildForm(initial: RepairCost | null): RepairCostForm {
  if (!initial) return EMPTY;
  return {
    nombre: initial.nombre,
    categoria: initial.categoria,
    tipo_equipo: initial.tipo_equipo ?? '',
    precio: Number(initial.precio) || 0,
    tiempo_estimado: initial.tiempo_estimado ?? '',
    descripcion: initial.descripcion ?? '',
    notas: initial.notas ?? '',
    modelo: initial.modelo ?? '',
    activo: initial.activo,
  };
}

export function CostFormDialog({ open, onOpenChange, initial, categories, submitting, onSubmit }: CostFormDialogProps) {
  const [form, setForm] = useState<RepairCostForm>(() => buildForm(initial));
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof RepairCostForm>(key: K, value: RepairCostForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
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
    await onSubmit({
      ...form,
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      tipo_equipo: (form.tipo_equipo ?? '').trim() || null,
      tiempo_estimado: (form.tiempo_estimado ?? '').trim() || null,
      descripcion: (form.descripcion ?? '').trim() || null,
      notas: (form.notas ?? '').trim() || null,
      modelo: (form.modelo ?? '').trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={open ? (initial?.id ?? 'create') : 'closed'} size="lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar costo de reparación' : 'Nuevo costo de reparación'}</DialogTitle>
          <DialogDescription>
            Cargá el costo base que pagás por la solución. El precio final al cliente se calcula automáticamente según
            cada porcentaje configurado en Porcentajes/Impuestos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label htmlFor="rc-categoria">Categoría</Label>
              <Input
                id="rc-categoria"
                value={form.categoria}
                onChange={(e) => set('categoria', e.target.value)}
                placeholder="ej: Pantallas, Baterías, Software…"
                list="repair-cost-categories"
              />
              <datalist id="repair-cost-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rc-tipo-equipo">Tipo de equipo</Label>
            <select
              id="rc-tipo-equipo"
              value={form.tipo_equipo ?? ''}
              onChange={(e) => set('tipo_equipo', e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Sin tipo (aplica a todos los equipos)</option>
              {EQUIPMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Clasifica el equipo al que aplica esta solución. El cliente puede filtrar el catálogo por este tipo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rc-precio">Precio base (lo que pagás)</Label>
              <Input
                id="rc-precio"
                type="number"
                min={0}
                step="0.01"
                value={Number.isNaN(form.precio) ? '' : form.precio}
                onChange={(e) => set('precio', e.target.value === '' ? Number.NaN : Number(e.target.value))}
                placeholder="10000"
              />
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

          <div className="space-y-2">
            <Label htmlFor="rc-desc">Descripción</Label>
            <Textarea
              id="rc-desc"
              value={form.descripcion ?? ''}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Detalle de la solución, lo que incluye, repuestos usados, etc."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rc-modelo">Modelos compatibles</Label>
            <Input
              id="rc-modelo"
              value={form.modelo ?? ''}
              onChange={(e) => set('modelo', e.target.value)}
              placeholder="ej: iPhone 10, iPhone 11, Samsung A54 (separados por coma)"
            />
            <p className="text-xs text-muted-foreground">
              Si lo dejás vacío, la reparación aparece para cualquier equipo. Si cargás modelos, solo aparece cuando el
              cliente los escribe en la página de valuación.
            </p>
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

          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
            <Checkbox checked={form.activo} onCheckedChange={(v) => set('activo', v === true)} />
            Activo (visible en la lista)
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} type="button">
            {submitting && <Loader2 size={16} className="mr-2 animate-spin" />}
            {initial ? 'Guardar cambios' : 'Crear costo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}