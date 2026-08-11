import React from 'react';
import { Clock, Play, Pause, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'running' | 'idle' | 'failed';
  duration?: string;
}

const statusMeta: Record<CronJob['status'], { label: string; badge: string; icon: React.ReactNode }> = {
  running: { label: 'Ejecutando', badge: 'bg-primary/10 text-blue-800', icon: <RefreshCw className="w-4 h-4 text-primary animate-spin" /> },
  idle: { label: 'Completado', badge: 'bg-green-100 text-green-800', icon: <Check className="w-4 h-4 text-success" /> },
  failed: { label: 'Fallido', badge: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4 text-destructive" /> },
};

interface StatCardProps {
  label: string;
  value: number;
  valueClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, valueClass }) => (
  <div className="bg-card rounded-xl shadow-sm border border-border p-4">
    <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

// Datos mock eliminados - conectar con API real (api.get('/cron'))
export default function Cron() {
  const jobs: CronJob[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tareas Programadas (Cron)</h2>
        <p className="text-sm text-muted-foreground mt-1">Ver y ejecutar jobs en cola programados</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={jobs.length} valueClass="text-primary" />
        <StatCard label="Completados" value={jobs.filter(j => j.status === 'idle').length} valueClass="text-success" />
        <StatCard label="Ejecutando" value={jobs.filter(j => j.status === 'running').length} valueClass="text-primary" />
        <StatCard label="Fallidos" value={jobs.filter(j => j.status === 'failed').length} valueClass="text-destructive" />
      </div>

      {/* Lista de jobs */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Jobs</h3>
          <span className="text-xs text-muted-foreground">Pendiente: conectar con el backend de cron jobs</span>
        </div>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Sin tareas programadas"
            description="No hay jobs de cron cargados. Conecta el endpoint de cron jobs del backend para ver y ejecutar tareas."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Última Ejecución</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Próxima Ejecución</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duración</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {statusMeta[job.status].icon}
                        <span className="text-sm font-medium text-foreground">{job.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">{job.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{job.lastRun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{job.nextRun}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta[job.status].badge}`}>
                        {statusMeta[job.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{job.duration || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {job.status === 'running' ? (
                          <button className="p-1.5 text-muted-foreground hover:bg-muted rounded" title="Pausar">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-1.5 text-primary hover:bg-primary/5 rounded" title="Ejecutar ahora">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información de cron */}
      <div className="bg-primary/5 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-semibold text-primary mb-2">Formato de Schedule</h4>
            <p className="text-sm text-blue-800">
              Los jobs usan formato cron estándar: <code className="bg-primary/10 px-1 rounded">* * * * *</code>
              <br />
              <span className="text-xs">Minuto Hora DíaMes Mes DíaSemana</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
