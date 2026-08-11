import React, { useState, useEffect } from 'react';
import { BarChart, Users, Building2, Activity, TrendingUp, Calendar } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import api from '../../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

export default function Stats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await api.get('/analytics/stats');
      setStats(response.data?.data ?? response.data);
    } catch (error) {
      setError('No se pudieron cargar las estadísticas. Verificá tu conexión e intentá de nuevo.');
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState label="Cargando estadísticas..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => { setLoading(true); fetchStats(); }} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Estadísticas de Uso</h2>
        <p className="text-sm text-muted-foreground mt-1">Usuarios activos, empresas creadas, pruebas ejecutadas</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.users || 0}</div>
          <div className="text-sm text-muted-foreground">Usuarios Activos</div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.companies || 0}</div>
          <div className="text-sm text-muted-foreground">Empresas Creadas</div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+25%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.repairs || 0}</div>
          <div className="text-sm text-muted-foreground">Reparaciones</div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15%</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.sales || 0}</div>
          <div className="text-sm text-muted-foreground">Ventas</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Usuarios por Rol</h3>
          <div className="space-y-4">
            {(stats?.usersByRole || []).map((item: any) => (
              <div key={item.role}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.role}</span>
                  <span className="text-foreground font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full bg-primary`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Actividad Semanal</h3>
          <div className="flex items-end justify-between h-40 px-4">
            {(stats?.weeklyActivity || [40, 65, 45, 80, 55, 90, 70]).map((value: number, idx: number) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div
                  className="w-8 bg-primary rounded-t"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-muted-foreground">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de estadísticas */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Estadísticas Detalladas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Métrica</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Hoy</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Ayer</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Esta Semana</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Este Mes</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Cambio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 text-sm text-foreground">Logins Exitosos</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.loginsToday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.loginsYesterday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.loginsWeek || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.loginsMonth || 0}</td>
                <td className="py-3 px-4 text-sm text-success text-right">+18%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-foreground">Ventas Realizadas</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.salesToday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.salesYesterday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.salesWeek || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.salesMonth || 0}</td>
                <td className="py-3 px-4 text-sm text-success text-right">+17%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-foreground">Reparaciones Creadas</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.repairsToday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.repairsYesterday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.repairsWeek || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.repairsMonth || 0}</td>
                <td className="py-3 px-4 text-sm text-destructive text-right">-13%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-foreground">API Requests</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.apiRequestsToday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.apiRequestsYesterday || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.apiRequestsWeek || 0}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground text-right">{stats?.apiRequestsMonth || 0}</td>
                <td className="py-3 px-4 text-sm text-success text-right">+10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
