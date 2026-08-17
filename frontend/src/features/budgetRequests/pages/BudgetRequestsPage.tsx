import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  MessageCircle,
  Pencil,
  Search,
  Trash2,
  Wrench,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useToast } from '@/shared/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { budgetRequestsApi } from '../services/budgetRequestsApi';
import type { BudgetRequest, BudgetRequestEstado } from '../types/budgetRequests.types';

function formatARS(n: number): string {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const toNumber = (v: string | number | null | undefined): number | null =>
  v === null || v === undefined || v === '' ? null : Number(v);

const errMsg = (err: unknown): string => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message || e?.message || 'Ocurrió un error inesperado';
};

const ESTADO_LABEL: Record<BudgetRequestEstado, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  CONVERTIDO: 'Convertido',
  RECHAZADO: 'Rechazado',
};

const ESTADO_VARIANT: Record<BudgetRequestEstado, 'warning' | 'default' | 'success' | 'secondary'> = {
  PENDIENTE: 'warning',
  CONFIRMADO: 'default',
  CONVERTIDO: 'success',
  RECHAZADO: 'secondary',
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  const text = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground break-words">{text}</p>
    </div>
  );
}

function DetailDialog({
  request,
  onClose,
  onSaved,
}: {
  request: BudgetRequest | null;
  onClose: () => void;
  onSaved: (updated: BudgetRequest) => void;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [precioAjustado, setPrecioAjustado] = useState(() =>
    request ? (toNumber(request.precio_ajustado)?.toString() ?? (toNumber(request.precio_ofertado)?.toString() ?? '')) : '',
  );
  const [notas, setNotas] = useState(() => request?.notas_admin ?? '');
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSave = async () => {
    if (!request) return;
    setSaving(true);
    try {
      const updated = await budgetRequestsApi.updateRequest(request.id, {
        precio_ajustado: toNumber(precioAjustado),
        notas_admin: notas.trim(),
      });
      toast({ title: 'Cambios guardados', description: 'El precio ajustado y las notas se actualizaron.' });
      onSaved(updated);
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!request) return;
    setConfirming(true);
    try {
      const updated = await budgetRequestsApi.updateRequest(request.id, {
        precio_ajustado: toNumber(precioAjustado),
        notas_admin: notas.trim(),
        estado: 'CONFIRMADO',
      });
      toast({ title: 'Solicitud confirmada', description: 'El admin recibió todos los datos de la reserva.' });
      onSaved(updated);
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setConfirming(false);
    }
  };

  const handleConvert = async () => {
    if (!request) return;
    if (!precioAjustado && toNumber(precioAjustado) === null) {
      toast({ title: 'Falta el precio', description: 'Ajustá el precio final antes de enviar a reparaciones.', variant: 'destructive' });
      return;
    }
    setConverting(true);
    try {
      await budgetRequestsApi.updateRequest(request.id, {
        precio_ajustado: toNumber(precioAjustado),
        notas_admin: notas.trim(),
      });
      const result = await budgetRequestsApi.convertToRepair(request.id);
      toast({ title: 'Enviada a reparaciones', description: 'La reserva se convirtió en una orden de reparación.' });
      const repair = result.repair as { id?: string } | undefined;
      onSaved(result.request);
      onClose();
      if (repair?.id) navigate(`/reparaciones/edit/${repair.id}`);
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setConverting(false);
    }
  };

  const handleDelete = async () => {
    if (!request) return;
    if (!window.confirm('¿Eliminar esta solicitud de presupuesto? Esta acción no se puede deshacer.')) return;
    try {
      await budgetRequestsApi.deleteRequest(request.id);
      toast({ title: 'Solicitud eliminada' });
      onClose();
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    }
  };

  const handleSendCost = async () => {
    if (!request) return;
    const precio = toNumber(precioAjustado) ?? toNumber(request.precio_ofertado);
    if (precio == null) {
      toast({ title: 'Falta el precio', description: 'Ingresá el precio final antes de confirmarlo y enviarlo.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const updated = await budgetRequestsApi.updateRequest(request.id, {
        precio_ajustado: toNumber(precioAjustado),
        notas_admin: notas.trim(),
      });
      const msg = [
        `Hola ${updated.nombre ?? ''}, te confirmamos el costo de tu reparación.`,
        ``,
        `• Orden: ${updated.numero}`,
        `• Equipo: ${[updated.categoria, updated.dispositivo, updated.modelo].filter(Boolean).join(' — ')}`,
        `• Costo de la reparación: ${formatARS(precio)}`,
        ``,
        `Confirmá desde el seguimiento con tu número de orden: ahí vas a ver el precio y podés elegir la forma de pago.`,
      ].join('\n');
      window.open(`https://wa.me/${request.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      onSaved(updated);
    } catch (err: unknown) {
      toast({ title: 'Error', description: errMsg(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const planLabel =
    request?.plan_pago === 'half' ? '50% + 50%' : request?.plan_pago === 'full' ? 'Pago completo' : null;
  const isConvertido = request?.estado === 'CONVERTIDO';

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {request && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList size={18} className="text-primary" />
                Solicitud {request.numero}
              </DialogTitle>
              <DialogDescription>
                Recibida el {formatDate(request.created_at)} ·<Badge variant={ESTADO_VARIANT[request.estado]} className="ml-2">{ESTADO_LABEL[request.estado]}</Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <DetailRow label="Cliente" value={request.nombre} />
              <DetailRow label="WhatsApp" value={request.whatsapp} />
              {request.dni && <DetailRow label="DNI / CUIL" value={request.dni} />}
              {request.email && <DetailRow label="Email" value={request.email} />}
              <DetailRow label="Dispositivo" value={`${request.categoria ? `${request.categoria} — ` : ''}${request.dispositivo}`} />
              {request.modelo && <DetailRow label="Modelo" value={request.modelo} />}
              {request.marca && <DetailRow label="Marca" value={request.marca} />}
              {request.tiempo_estimado && <DetailRow label="Tiempo estimado" value={request.tiempo_estimado} />}
              {request.problema && <DetailRow label="Problema reportado" value={request.problema} />}
              {request.descripcion && <DetailRow label="Descripción" value={request.descripcion} />}
              {planLabel && <DetailRow label="Plan de pago" value={planLabel} />}
              {request.sena_monto != null && (
                <DetailRow label="Seña" value={`${formatARS(toNumber(request.sena_monto) ?? 0)}${request.sena_metodo ? ` (${request.sena_metodo})` : ''}${request.comprobante ? ` — ${request.comprobante}` : ''}`} />
              )}
              {request.resto_metodo && <DetailRow label="Resto" value={request.resto_metodo} />}
              {request.delivery_metodo === 'llevar' && <DetailRow label="Entrega" value="Lo lleva al local" />}
              {request.delivery_metodo === 'retirar' && (
                <DetailRow label="Entrega" value={`Lo retiran${request.delivery_direccion ? ` — ${request.delivery_direccion}` : ''}${request.delivery_costo != null ? ` · costo ${formatARS(toNumber(request.delivery_costo) ?? 0)}` : ''}`} />
              )}
              {request.turno_fecha && (
                <DetailRow label="Turno" value={`${request.turno_fecha}${request.turno_horario ? ` · ${request.turno_horario}` : ''}`} />
              )}
              <DetailRow
                label="Precio ofertado"
                value={request.precio_ofertado != null ? formatARS(toNumber(request.precio_ofertado) ?? 0) : '—'}
              />
              {request.repair && (
                <DetailRow label="Orden de reparación" value={`${request.repair.numero_reparacion ?? request.repair.id} (${request.repair.estado ?? '—'})`} />
              )}
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio ajustado (final)</Label>
                  <Input
                    id="precio"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={precioAjustado}
                    onChange={(e) => setPrecioAjustado(e.target.value)}
                    placeholder="Ej: 450000"
                    disabled={isConvertido}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas del admin</Label>
                  <Textarea
                    id="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Observaciones internas…"
                    rows={2}
                    disabled={isConvertido}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendCost}
                disabled={saving}
              >
                {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <MessageCircle size={14} className="mr-2" />}
                Confirmar precio y enviar por WhatsApp
              </Button>
              {!isConvertido && (
                <>
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Pencil size={14} className="mr-2" />}
                    Guardar
                  </Button>
                  {request.estado !== 'CONFIRMADO' && (
                    <Button variant="secondary" size="sm" onClick={handleConfirm} disabled={confirming}>
                      {confirming ? <Loader2 size={14} className="mr-2 animate-spin" /> : <CheckCircle2 size={14} className="mr-2" />}
                      Confirmar recepción
                    </Button>
                  )}
                  <Button size="sm" onClick={handleConvert} disabled={converting}>
                    {converting ? <Loader2 size={14} className="mr-2 animate-spin" /> : <ArrowRight size={14} className="mr-2" />}
                    Enviar a reparaciones
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 size={14} className="mr-2" /> Eliminar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BudgetRequestsPage() {
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'all' | BudgetRequestEstado>('all');
  const [selected, setSelected] = useState<BudgetRequest | null>(null);

  const reload = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    budgetRequestsApi
      .getRequests({ page, limit, estado: estadoFilter === 'all' ? undefined : estadoFilter })
      .then((res) => {
        if (cancelled) return;
        setRequests(res.data);
        setTotal(res.meta.total);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(errMsg(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, limit, estadoFilter, refreshKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) =>
      [r.nombre, r.whatsapp, r.dni ?? '', r.numero, r.dispositivo, r.modelo ?? '', r.categoria ?? ''].join(' ').toLowerCase().includes(q),
    );
  }, [requests, search]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSaved = (updated: BudgetRequest) => {
    setSelected(updated);
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const counts = useMemo(() => {
    const pend = requests.filter((r) => r.estado === 'PENDIENTE').length;
    const conf = requests.filter((r) => r.estado === 'CONFIRMADO').length;
    const conv = requests.filter((r) => r.estado === 'CONVERTIDO').length;
    return { pend, conf, conv };
  }, [requests]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Solicitudes de Presupuesto</h1>
          <p className="text-muted-foreground">
            Reservas recibidas desde la página pública. Confirmá los datos, ajustá el precio y enviá la orden a reparaciones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 text-amber-600 p-2.5"><AlertCircle size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold text-foreground">{counts.pend}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 text-primary p-2.5"><CheckCircle2 size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmadas</p>
                <p className="text-xl font-bold text-foreground">{counts.conf}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 text-emerald-600 p-2.5"><Wrench size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">En reparaciones</p>
                <p className="text-xl font-bold text-foreground">{counts.conv}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted text-muted-foreground p-2.5"><ClipboardList size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cliente, WhatsApp, número u orden…"
              className="pl-9"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => {
              setEstadoFilter(e.target.value as 'all' | BudgetRequestEstado);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADO">Confirmadas</option>
            <option value="CONVERTIDO">Convertidas</option>
            <option value="RECHAZADO">Rechazadas</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading && requests.length === 0 ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <AlertCircle size={48} className="text-destructive mb-4" />
              <p className="text-lg font-semibold text-foreground mb-1">Error al cargar las solicitudes</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">{error}</p>
              <Button variant="outline" onClick={reload}>
                Reintentar
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList size={48} className="text-muted-foreground/40 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-1">No hay solicitudes de presupuesto</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                En cuanto un cliente complete el flujo de presupuesto en la página pública, la reserva va a aparecer acá con su número de orden.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">N° de orden</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dispositivo</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recibida</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const ajustado = toNumber(r.precio_ajustado);
                    const ofertado = toNumber(r.precio_ofertado);
                    return (
                      <tr key={r.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelected(r)}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-primary tabular-nums">{r.numero}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-foreground">{r.nombre}</p>
                          <p className="text-xs text-muted-foreground">{r.whatsapp}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground">{r.dispositivo}</p>
                          {r.modelo && <p className="text-xs text-muted-foreground">{r.modelo}</p>}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-foreground">
                          {ajustado != null ? (
                            <span>
                              {formatARS(ajustado)}
                              {ofertado != null && ajustado !== ofertado && (
                                <span className="block text-[11px] font-medium text-muted-foreground line-through">
                                  {formatARS(ofertado)}
                                </span>
                              )}
                            </span>
                          ) : ofertado != null ? (
                            formatARS(ofertado)
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={ESTADO_VARIANT[r.estado]}>{ESTADO_LABEL[r.estado]}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(r.created_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>
                              Ver
                            </Button>
                            {r.estado !== 'CONVERTIDO' && (
                              <Button size="sm" variant="ghost" className="text-primary" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>
                                <ArrowRight size={15} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="p-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground font-medium">
                Mostrando {filtered.length} de {total} solicitudes
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Anterior
                </Button>
                <span className="text-xs text-muted-foreground font-medium">
                  Página {page} de {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailDialog key={selected?.id ?? 'closed'} request={selected} onClose={() => setSelected(null)} onSaved={onSaved} />
    </div>
  );
}