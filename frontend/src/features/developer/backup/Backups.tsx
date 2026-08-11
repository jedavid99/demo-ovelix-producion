import React, { useState, useEffect } from 'react';
import { HardDrive, Download, Trash2, Calendar, Clock, Play, Check, AlertTriangle } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import api from '../../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
}

export default function Backups() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setError(null);
      const response = await api.get('/backups');
      const backupsData = response.data?.data || [];
      setBackups(Array.isArray(backupsData) ? backupsData : []);
    } catch (error) {
      setError('No se pudieron cargar las copias de seguridad. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching backups:', error);
      setBackups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsCreating(true);
      await api.post('/backups');
      await fetchBackups();
    } catch (error) {
      toast({ title: 'Error', description: 'Error al guardar. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error creating backup:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await api.get(`/backups/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup_${id}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error downloading backup:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/backups/${id}`);
      setBackups(backups.filter(b => b.id !== id));
      toast({ title: 'Éxito', description: 'Backup eliminado correctamente.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Error al eliminar. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error deleting backup:', error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    await handleDelete(target);
  };

  const getStatusIcon = (status: Backup['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-success" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-primary animate-pulse" />;
    }
  };

  const getStatusBadge = (status: Backup['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-primary/10 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Copias de Seguridad</h2>
          <p className="text-sm text-muted-foreground mt-1">Programar backups manuales o automáticos de la base de datos</p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>{isCreating ? 'Creando...' : 'Crear Backup'}</span>
        </button>
      </div>

      {/* Configuración de backups automáticos */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Configuración de Backups Automáticos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Frecuencia</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring">
              <option>Diario</option>
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Hora</label>
            <input type="time" defaultValue="02:00" className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Retención (días)</label>
            <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </div>

      {/* Lista de backups */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); fetchBackups(); }} className="!py-8 m-4" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-muted border-b border-border sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{backup.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {backup.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      backup.type === 'automatic' ? 'bg-primary/10 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {backup.type === 'automatic' ? 'Automático' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusBadge(backup.status)}`}>
                        {backup.status === 'completed' ? 'Completado' : backup.status === 'failed' ? 'Fallido' : 'En progreso'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDownload(backup.id)}
                        disabled={backup.status !== 'completed'}
                        className="p-1.5 text-primary hover:bg-primary/5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(backup.id)}
                        disabled={backup.status === 'in_progress'}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {backups.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    <HardDrive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No se encontraron backups</p>
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información de almacenamiento */}
      <div className="bg-primary/5 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <HardDrive className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Almacenamiento de Backups</h4>
            <p className="text-sm text-blue-800">
              Espacio utilizado: 11.5 GB / 50 GB (23%)
              <br />
              <span className="text-xs">Se recomienda mantener backups de los últimos 30 días</span>
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Eliminar backup"
        description="¿Estás seguro de que deseas eliminar este backup de forma permanente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
