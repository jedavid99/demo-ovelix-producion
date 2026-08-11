import React, { useState, useEffect } from 'react';
import { Terminal, AlertTriangle, Info, Check, Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import api from '../../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  module: string;
  details?: any;
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filterLevel]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (filterLevel !== 'all') params.level = filterLevel;
      const response = await api.get('/server-logs', { params });
      const logsData = response.data?.data || [];
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (error) {
      setError('No se pudieron cargar los logs del servidor. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/server-logs/stats');
      setStats(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching stats:', error);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Info className="w-4 h-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'debug':
        return <Terminal className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'bg-primary/5 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-destructive/10 border-red-200';
      case 'debug':
        return 'bg-muted border-border';
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return 'bg-primary/10 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'debug':
        return 'bg-muted text-foreground';
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Logs del Servidor</h2>
          <p className="text-sm text-muted-foreground mt-1">Visualización de errores y advertencias del sistema</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
          <Download className="w-4 h-4" />
          <span>Exportar Logs</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-primary">{stats?.total || logs.length}</div>
          <div className="text-sm text-muted-foreground">Total de Logs</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-destructive">{stats?.byLevel?.find((l: any) => l.level === 'error')?._count || 0}</div>
          <div className="text-sm text-muted-foreground">Errores</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats?.byLevel?.find((l: any) => l.level === 'warning')?._count || 0}</div>
          <div className="text-sm text-muted-foreground">Advertencias</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-purple-600">{stats?.byModule?.length || 0}</div>
          <div className="text-sm text-muted-foreground">Módulos</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en logs..."
            aria-label="Buscar en logs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent w-full"
          />
        </div>
        <div className="flex space-x-2">
          {(['all', 'info', 'warning', 'error', 'debug'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                filterLevel === level
                  ? level === 'error' ? 'bg-destructive text-white' : 
                    level === 'warning' ? 'bg-yellow-600 text-white' :
                    level === 'info' ? 'bg-primary text-white' :
                    'bg-primary text-white'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de logs */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); fetchLogs(); }} className="!py-8 m-4" />
        ) : (
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`p-4 cursor-pointer hover:bg-muted transition-colors ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start space-x-3">
                  {getLevelIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded capitalize">{log.level}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{log.module}</span>
                    </div>
                    <p className="text-sm text-foreground">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                <Terminal className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p>No se encontraron logs</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getLevelIcon(selectedLog.level)}
                  Detalle del Log
                </DialogTitle>
                <DialogDescription>{formatDate(selectedLog.timestamp)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Nivel</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${getLevelBadge(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Módulo</p>
                  <p className="text-sm text-foreground">{selectedLog.module}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Mensaje</p>
                  <p className="text-sm text-foreground">{selectedLog.message}</p>
                </div>
                {selectedLog.details && (
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Detalles</p>
                    <pre className="text-sm text-foreground bg-muted p-3 rounded-lg overflow-x-auto">
                      {typeof selectedLog.details === 'string'
                        ? selectedLog.details
                        : JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
