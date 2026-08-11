import React, { useState, useEffect } from 'react';
import { Database, Server, HardDrive, Activity } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import api from '../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';

export default function DeveloperDatabase() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/database/stats');
      setStats(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (process.env.NODE_ENV === 'development') console.error('Error fetching database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Base de Datos</h2>
        <p className="text-sm text-muted-foreground mt-1">Herramientas de administración de base de datos</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Estadísticas</h3>
        {loading ? (
          <LoadingState className="!py-8" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats?.companies || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Empresas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-success">{stats?.users || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Usuarios</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats?.clients || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Clientes</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats?.repairs || 0}</div>
              <div className="text-sm text-muted-foreground mt-1">Reparaciones</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Estado del Servidor</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Verificar el estado de conexión con la base de datos</p>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm">
            Verificar Conexión
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Migraciones</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Gestionar migraciones de la base de datos</p>
          <button className="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors text-sm">
            Ver Migraciones
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground">Prisma Studio</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Interfaz visual para gestionar la base de datos</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Abrir Studio
          </button>
        </div>
      </div>
    </div>
  );
}
