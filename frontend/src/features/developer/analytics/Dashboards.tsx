import React from 'react';
import { BarChart, LineChart, PieChart, TrendingUp, DollarSign, Users, Activity, Package } from 'lucide-react';

export default function Dashboards() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboards</h2>
        <p className="text-sm text-muted-foreground mt-1">Visualización de métricas clave del sistema</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-card/20 px-2 py-1 rounded">+15%</span>
          </div>
          <div className="text-3xl font-bold mb-1">$45,234</div>
          <div className="text-sm opacity-80">Ventas Totales</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-card/20 px-2 py-1 rounded">+8%</span>
          </div>
          <div className="text-3xl font-bold mb-1">1,234</div>
          <div className="text-sm opacity-80">Usuarios Activos</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-card/20 px-2 py-1 rounded">+25%</span>
          </div>
          <div className="text-3xl font-bold mb-1">567</div>
          <div className="text-sm opacity-80">Reparaciones</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-card/20 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-3xl font-bold mb-1">8,901</div>
          <div className="text-sm opacity-80">Productos en Stock</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Ventas Mensuales</h3>
            <LineChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64 flex items-end justify-between px-4">
            {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div
                  className="w-8 bg-primary rounded-t"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-muted-foreground">{['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Distribución por Categoría</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {[
              { category: 'Ventas', value: 45, color: 'bg-primary' },
              { category: 'Reparaciones', value: 25, color: 'bg-success' },
              { category: 'Servicios', value: 20, color: 'bg-purple-600' },
              { category: 'Otros', value: 10, color: 'bg-orange-600' },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{item.category}</span>
                  <span className="text-foreground font-medium">{item.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de tendencias */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Tendencia de Actividad</h3>
          <BarChart className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Logins/Día</div>
            <div className="text-2xl font-bold text-primary">234</div>
            <div className="flex items-center text-success text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% vs ayer</span>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Ventas/Día</div>
            <div className="text-2xl font-bold text-success">$4,567</div>
            <div className="flex items-center text-success text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+8% vs ayer</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Reparaciones/Día</div>
            <div className="text-2xl font-bold text-purple-600">45</div>
            <div className="flex items-center text-destructive text-xs mt-1">
              <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
              <span>-5% vs ayer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
