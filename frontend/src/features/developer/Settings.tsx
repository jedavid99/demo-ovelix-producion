import React, { useState, useEffect } from 'react';
import { Settings, Key, Shield, Bell, Globe } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import api, { API_BASE } from '../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';

export default function DeveloperSettings() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/settings/config');
      setConfig(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar los datos. Intentalo de nuevo.', variant: 'destructive' });
      if (import.meta.env.DEV) console.error('Error fetching config:', error);
      // Set default config if API fails
      setConfig({
        environment: import.meta.env.DEV ? 'development' : 'production',
        apiUrl: API_BASE,
        version: '1.0.0',
        rateLimiting: true,
        cors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState label="Cargando configuración..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configuración</h2>
        <p className="text-sm text-muted-foreground mt-1">Configuración del entorno de desarrollador</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">API Keys</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Gestionar las claves de API del sistema</p>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">JWT Secret</div>
              <div className="text-sm font-mono text-foreground">••••••••••••••••</div>
            </div>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm">
              Regenerar Keys
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Seguridad</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Configuración de seguridad del sistema</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-foreground">Rate Limiting</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${config?.rateLimiting ? 'bg-green-100 text-success' : 'bg-red-100 text-destructive'}`}>
                {config?.rateLimiting ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-foreground">CORS</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${config?.cors ? 'bg-green-100 text-success' : 'bg-red-100 text-destructive'}`}>
                {config?.cors ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground">Notificaciones</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Configurar alertas y notificaciones</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer">
              <span className="text-sm text-foreground">Email alerts</span>
              <input type="checkbox" className="w-4 h-4 text-primary rounded" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer">
              <span className="text-sm text-foreground">Error logs</span>
              <input type="checkbox" className="w-4 h-4 text-primary rounded" defaultChecked />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-foreground">Entorno</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Información del entorno actual</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Modo:</span>
              <span className="font-medium text-foreground capitalize">{config?.environment || 'Desarrollo'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">API URL:</span>
              <span className="font-medium text-foreground font-mono">{config?.apiUrl || API_BASE}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versión:</span>
              <span className="font-medium text-foreground">{config?.version || '1.0.0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
