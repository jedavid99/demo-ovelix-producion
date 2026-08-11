import React, { useState, useEffect } from 'react';
import { Clock, Shield, AlertTriangle, Check, Search, Filter, ChevronDown, ChevronUp, ChevronRight, Database, Building2, User as UserIcon } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import api from '../../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

interface AuditLog {
  id: string;
  usuario_id: string | null;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
  } | null;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  datos_antiguos: any;
  datos_nuevos: any;
  fecha: string;
  empresa_id: string;
  empresa: {
    id: string;
    codigo_empresa: string;
    razon_social: string;
  };
}

export default function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntidad, setFilterEntidad] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/audit');
      const logsData = response.data?.data || [];
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      setError('No se pudieron cargar los registros de auditoría. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/audit/stats');
      setStats(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching audit stats:', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.usuario?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entidad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEntidad === 'all' || log.entidad === filterEntidad;
    return matchesSearch && matchesFilter;
  });

  const entidades = Array.from(new Set(logs.map(log => log.entidad)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const toggleExpand = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Auditoría de Acceso</h2>
        <p className="text-sm text-muted-foreground mt-1">Historial de inicios de sesión, intentos fallidos y acciones del sistema</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-primary">{stats?.total || logs.length}</div>
          <div className="text-sm text-muted-foreground">Total de Eventos</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-purple-600">{entidades.length}</div>
          <div className="text-sm text-muted-foreground">Entidades</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-success">{stats?.byUsuario?.length || 0}</div>
          <div className="text-sm text-muted-foreground">Usuarios Activos</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-orange-600">{stats?.byEntidad?.[0]?._count || 0}</div>
          <div className="text-sm text-muted-foreground">Entidad Más Activa</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por usuario, acción o entidad..."
            aria-label="Buscar por usuario, acción o entidad"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterEntidad}
            onChange={(e) => setFilterEntidad(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
          >
            <option value="all">Todas las Entidades</option>
            {entidades.map((entidad) => (
              <option key={entidad} value={entidad}>
                {entidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); fetchLogs(); }} className="!py-8 m-4" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-muted border-b border-border sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Entidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <>
                  <tr key={log.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : 'Sistema'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.usuario?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {log.accion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{log.entidad}</span>
                      </div>
                      {log.entidad_id && (
                        <div className="text-xs text-muted-foreground">ID: {log.entidad_id.slice(0, 8)}...</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">{log.empresa.codigo_empresa}</div>
                          <div className="text-xs text-muted-foreground">{log.empresa.razon_social}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(log.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="flex items-center space-x-1 text-primary hover:text-blue-800 text-sm"
                      >
                        {expandedLog === log.id ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Ocultar</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Ver Detalles</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedLog === log.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-muted">
                        <div className="space-y-4">
                          {log.datos_antiguos && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Datos Antiguos
                              </h4>
                              <pre className="bg-muted text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(log.datos_antiguos, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.datos_nuevos && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                Datos Nuevos
                              </h4>
                              <pre className="bg-muted text-blue-400 p-3 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(log.datos_nuevos, null, 2)}
                              </pre>
                            </div>
                          )}
                          {!log.datos_antiguos && !log.datos_nuevos && (
                            <p className="text-sm text-muted-foreground">No hay datos adicionales disponibles</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No se encontraron registros</p>
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
