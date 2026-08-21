import { useEffect, useState, useCallback } from 'react';
import { MdContentCopy, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { getAuditLogs } from '@/services/audit.service';
import { useAuth } from '@/contexts/AuthContext';
import { AsyncState } from '@/shared/components/async/AsyncState';
import { Button } from '@/shared/components/ui/button';

interface AuditEntry {
  id: string;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  fecha: string;
  usuario?: { id: string; email: string; nombre: string; apellido: string } | null;
}

interface ActivityLogSectionProps {
  usuarioId?: string;
}

const entityLabel: Record<string, string> = {
  CLIENTE: 'Cliente',
  REPARACION: 'Orden de servicio',
  VENTA: 'Venta',
  USUARIO: 'Usuario',
  PRODUCTO: 'Producto',
  STOCK: 'Stock',
  PRESUPUESTO: 'Presupuesto',
  CAJA: 'Cierre de caja',
  WHATSAPP: 'WhatsApp',
  EMPRESA: 'Empresa',
  ROL: 'Rol',
  PERMISO: 'Permiso',
  CONFIGURACION: 'Configuración',
};

const typeBadge = (entidad: string) => {
  const e = entidad.toUpperCase();
  if (e === 'CLIENTE') return 'bg-primary/10 text-primary';
  if (e === 'REPARACION') return 'bg-success/10 text-success';
  if (e === 'VENTA') return 'bg-amber-500/10 text-amber-600';
  if (e === 'USUARIO') return 'bg-purple-500/10 text-purple-600';
  if (e === 'STOCK' || e === 'PRODUCTO') return 'bg-cyan-500/10 text-cyan-600';
  if (e === 'PRESUPUESTO') return 'bg-pink-500/10 text-pink-600';
  if (e === 'CAJA') return 'bg-orange-500/10 text-orange-600';
  if (e === 'WHATSAPP') return 'bg-emerald-500/10 text-emerald-600';
  return 'bg-muted/50 text-muted-foreground';
};

const actionLabel = (accion: string): string => {
  const a = accion.toUpperCase();
  if (a === 'CREAR' || a === 'CREATE') return 'Creación';
  if (a === 'ACTUALIZAR' || a === 'UPDATE') return 'Actualización';
  if (a === 'ELIMINAR' || a === 'DELETE') return 'Eliminación';
  if (a === 'LOGIN') return 'Inicio de sesión';
  if (a === 'LOGOUT') return 'Cierre de sesión';
  if (a === 'DESCARGAR' || a === 'DOWNLOAD') return 'Descarga';
  if (a === 'ENVIAR' || a === 'SEND') return 'Envío';
  return accion;
};

const userLabel = (u?: { nombre: string; apellido: string } | null) =>
  u ? [u.nombre, u.apellido].filter(Boolean).join(' ') : '\u2014';

export const ActivityLogSection = ({ usuarioId }: ActivityLogSectionProps) => {
  const { user: rawUser } = useAuth();
  const user = (rawUser?.data ?? rawUser) as { rol?: { name: string } };
  const isAdmin = user?.rol?.name === 'ADMIN' || user?.rol?.name === 'DESARROLLADOR';

  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await getAuditLogs({ page, limit: 20, usuario_id: isAdmin ? undefined : usuarioId });
      const d = res?.data ?? res ?? [];
      setLogs(Array.isArray(d) ? d : []);
      setTotalPages(res?.meta?.totalPages ?? 1);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, usuarioId, isAdmin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setLoading(true);
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdContentCopy size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Registro de Actividad</h2>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Actividad de todos los usuarios' : 'Tu actividad en el sistema'}
            </p>
          </div>
        </div>
      </div>

      <AsyncState
        loading={loading}
        empty={!loading && logs.length === 0}
        loadingLabel="Cargando actividad..."
        emptyTitle="No hay actividad registrada"
        emptyDescription="Las acciones realizadas aparecerán aquí"
      >
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono" role="grid">
              <thead className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border">
                <tr>
                  {isAdmin && <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Usuario</th>}
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Acción</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Entidad</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                    {isAdmin && (
                      <td className="py-3 px-4 text-foreground font-medium">
                        {userLabel(log.usuario)}
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold ${typeBadge(log.entidad)}`}>
                        {actionLabel(log.accion)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {entityLabel[log.entidad?.toUpperCase()] || log.entidad || '\u2014'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {log.fecha
                        ? new Date(log.fecha).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="gap-1.5"
              >
                <MdChevronLeft size={14} />
                Anterior
              </Button>
              <span className="text-xs font-mono text-muted-foreground px-2">
                Pág. {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="gap-1.5"
              >
                Siguiente
                <MdChevronRight size={14} />
              </Button>
            </div>
          )}
        </>
      </AsyncState>
    </div>
  );
};