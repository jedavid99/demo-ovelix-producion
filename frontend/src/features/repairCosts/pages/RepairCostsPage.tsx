import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  Calculator,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  Loader2,
  Clock,
  Tag,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { useListCache } from '@/shared/hooks/useListCache';
import { repairCostsCacheKey, repairCostsData } from '@/shared/lib/dataCaches';
import { repairCostsApi } from '../services/repairCostsApi';
import { CostFormDialog } from '../components/CostFormDialog';
import type { RepairCost, RepairCostForm, TaxRate } from '../types/repairCosts.types';

function formatARS(n: number): string {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const finalPrice = (base: number, pct: number) => Math.round(base * (1 + pct / 100) * 100) / 100;

const errMsg = (err: unknown): string => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message || e?.message || 'Ocurrió un error inesperado';
};

function StatementRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 text-primary p-2.5">{icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-xl font-bold text-foreground truncate">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RepairCostsPage() {
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [onlyActive, setOnlyActive] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RepairCost | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: cached, loading, error, refresh } = useListCache<{ costs: RepairCost[]; taxRates: TaxRate[] }>(
    repairCostsCacheKey(),
    () => repairCostsData(),
  );

  const costs = useMemo(() => cached?.costs ?? [], [cached]);
  const taxRates = useMemo(() => cached?.taxRates ?? [], [cached]);
  const reload = () => { void refresh(); };

  const categories = useMemo(() => Array.from(new Set(costs.map((c) => c.categoria))).sort(), [costs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return costs.filter((c) => {
      if (onlyActive && !c.activo) return false;
      if (categoryFilter !== 'all' && c.categoria !== categoryFilter) return false;
      if (q) {
        const haystack = [
          c.nombre,
          c.categoria,
          c.modelo ?? '',
          c.descripcion ?? '',
          c.notas ?? '',
          (c.marcas ?? []).map((m) => m.nombre).join(' '),
          (c.modelos ?? []).map((m) => m.nombre).join(' '),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [costs, search, categoryFilter, onlyActive]);

  const activeRates = useMemo(() => taxRates.filter((r) => r.activo && (r.porcentaje ?? 0) > 0), [taxRates]);

  const activeCount = costs.filter((c) => c.activo).length;
  const avgPrice =
    costs.length > 0 ? Math.round((costs.reduce((a, c) => a + (Number(c.precio) || 0), 0) / costs.length) * 100) / 100 : 0;

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (cost: RepairCost) => {
    setEditing(cost);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: RepairCostForm) => {
    setSubmitting(true);
    try {
      if (editing) {
        await repairCostsApi.updateRepairCost(editing.id, values);
        toast({ title: 'Costo actualizado', description: 'Los cambios se guardaron correctamente' });
      } else {
        await repairCostsApi.createRepairCost(values);
        toast({ title: 'Costo creado', description: 'El costo de reparación se agregó correctamente' });
      }
      setDialogOpen(false);
      reload();
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (cost: RepairCost) => {
    setTogglingId(cost.id);
    try {
      await repairCostsApi.updateRepairCost(cost.id, { activo: !cost.activo });
      reload();
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (cost: RepairCost) => {
    if (!window.confirm(`¿Eliminar "${cost.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(cost.id);
    try {
      await repairCostsApi.deleteRepairCost(cost.id);
      reload();
      toast({ title: 'Costo eliminado' });
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Costos de Reparaciones</h1>
          <p className="text-muted-foreground">
            Tarifario de soluciones: precio base, tiempo estimado y precio final por porcentaje aplicado.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Nuevo costo
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatementRow label="Soluciones" value={String(costs.length)} icon={<Calculator size={18} />} />
        <StatementRow label="Activas" value={String(activeCount)} icon={<Power size={18} />} />
        <StatementRow label="Categorías" value={String(categories.length)} icon={<Tag size={18} />} />
        <StatementRow label="Precio promedio" value={formatARS(avgPrice)} icon={<DollarSign size={18} />} />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, categoría o descripción…"
              className="pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            Solo activas
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading && costs.length === 0 ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <AlertCircle size={48} className="text-destructive mb-4" />
              <p className="text-lg font-semibold text-foreground mb-1">Error al cargar los costos</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">{error}</p>
              <Button variant="outline" onClick={reload}>
                Reintentar
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calculator size={48} className="text-muted-foreground/40 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-1">No hay costos de reparación</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                Cargá tus soluciones (ej: PIN de carga $10.000) con el botón "Nuevo costo" y se calculará el precio
                final según los porcentajes que tengas configurados.
              </p>
              <Button onClick={openCreate}>
                <Plus size={16} className="mr-2" />
                Nuevo costo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Clock size={12} className="inline mr-1" />
                      Tiempo
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Precio base
                    </th>
                    {activeRates.map((r) => (
                      <th
                        key={r.id}
                        className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-secondary"
                        title={`Con ${r.porcentaje}%`}
                      >
                        {r.nombre} ({r.porcentaje}%)
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((cost) => (
                    <tr key={cost.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-foreground">{cost.nombre}</p>
                        {(cost.descripcion || cost.notas) && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                            {cost.descripcion || cost.notas}
                          </p>
                        )}
                        {(cost.marcas?.length > 0 || cost.modelos?.length > 0) && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(cost.marcas ?? []).map((b) => (
                              <span
                                key={b.id}
                                className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-semibold text-muted-foreground capitalize"
                              >
                                {b.nombre}
                              </span>
                            ))}
                            {(cost.modelos ?? []).map((m) => (
                              <span
                                key={m.id}
                                className="px-1.5 py-0.5 rounded bg-primary/10 text-[10px] font-semibold text-primary"
                              >
                                {m.nombre}
                              </span>
                            ))}
                          </div>
                        )}
                        {cost.modelo && (
                          <p className="text-[11px] font-medium text-primary mt-0.5">Modelos: {cost.modelo}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge variant="outline">{cost.categoria}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{cost.tiempo_estimado || '—'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">
                        {formatARS(Number(cost.precio) || 0)}
                      </td>
                      {activeRates.map((r) => (
                        <td key={r.id} className="px-6 py-4 text-sm font-bold text-secondary">
                          {formatARS(finalPrice(Number(cost.precio) || 0, r.porcentaje))}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center">
                        <Badge variant={cost.activo ? 'success' : 'secondary'}>
                          {cost.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleActive(cost)}
                            title={cost.activo ? 'Desactivar' : 'Activar'}
                            disabled={togglingId === cost.id}
                          >
                            {togglingId === cost.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Power size={15} className={cost.activo ? 'text-primary' : 'text-muted-foreground'} />
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(cost)} title="Editar">
                            <Pencil size={15} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(cost)}
                            disabled={deletingId === cost.id}
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="p-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground font-medium">
                Mostrando {filtered.length} de {costs.length} soluciones
              </p>
              {activeRates.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No hay porcentajes activos: configurá impuestos/recargos en{' '}
                  <span className="font-semibold text-foreground">Configuración → Porcentajes</span> para ver los
                  precios finales.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CostFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        categories={categories}
        taxRates={taxRates}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}