import React, { useState } from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Check, AlertTriangle, RefreshCw } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  lastCheck: string;
}

export default function Health() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      name: 'Servidor API',
      status: 'healthy',
      value: '99.9% uptime',
      lastCheck: 'Hace 1 minuto'
    },
    {
      name: 'Base de Datos',
      status: 'healthy',
      value: 'Conectado',
      lastCheck: 'Hace 1 minuto'
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      value: 'Conectado',
      lastCheck: 'Hace 1 minuto'
    },
    {
      name: 'CPU',
      status: 'warning',
      value: '75% uso',
      lastCheck: 'Hace 1 minuto'
    },
    {
      name: 'Memoria',
      status: 'healthy',
      value: '4GB / 8GB',
      lastCheck: 'Hace 1 minuto'
    },
    {
      name: 'Disco',
      status: 'healthy',
      value: '120GB / 500GB',
      lastCheck: 'Hace 1 minuto'
    },
  ]);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return <Check className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusColor = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-destructive/10 border-red-200';
    }
  };

  const getStatusBadge = (status: HealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Estado del Sistema</h2>
          <p className="text-sm text-muted-foreground mt-1">Health checks, uptime y rendimiento del sistema</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover">
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Resumen general */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Activity className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Sistema Operativo</h3>
            <p className="text-sm text-muted-foreground">Todos los servicios funcionando correctamente</p>
          </div>
        </div>
      </div>

      {/* Health checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthChecks.map((check) => (
          <div key={check.name} className={`rounded-xl border p-4 ${getStatusColor(check.status)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(check.status)}
                <span className="font-semibold text-foreground">{check.name}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadge(check.status)}`}>
                {check.status === 'healthy' ? 'Saludable' : check.status === 'warning' ? 'Advertencia' : 'Crítico'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium text-foreground">{check.value}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Último check:</span>
                <span className="text-muted-foreground">{check.lastCheck}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Métricas de rendimiento */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Métricas de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground mt-1">Uptime</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-success">45ms</div>
            <div className="text-sm text-muted-foreground mt-1">Response Time</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-purple-600">1,234</div>
            <div className="text-sm text-muted-foreground mt-1">Requests/min</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">0.01%</div>
            <div className="text-sm text-muted-foreground mt-1">Error Rate</div>
          </div>
        </div>
      </div>

      {/* Historial de uptime */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Historial de Uptime (Últimos 7 días)</h3>
        <div className="flex items-end justify-between h-32 px-4">
          {[95, 98, 99, 99, 100, 99, 99].map((uptime, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2">
              <div
                className="w-12 bg-primary rounded-t"
                style={{ height: `${uptime}%` }}
              />
              <span className="text-xs text-muted-foreground">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
