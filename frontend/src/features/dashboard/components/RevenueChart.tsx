import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronRight } from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartDataPoint, RepairStateData, RepairSummary } from '../types/dashboard.types';
import { getStatusBadge, getStatusIcon } from '../constants/dashboard.constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-lg rounded-lg p-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload, repairStatesData }: any) => {
  if (active && payload && payload.length && repairStatesData && Array.isArray(repairStatesData)) {
    const data = payload[0];
    const total = repairStatesData.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    return (
      <div className="bg-card border border-border shadow-lg rounded-lg p-3">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-lg font-bold text-primary">
          {data.value} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  salesData: ChartDataPoint[];
  repairStatesData: RepairStateData[];
  repairs: RepairSummary[];
  onStatesModalOpen: () => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  salesData,
  repairStatesData,
  repairs,
  onStatesModalOpen,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const gridStroke = isDark ? '#2A2A2A' : '#E4E4E7';
  const tickFill = isDark ? '#A1A1AA' : '#71717A';
  const cursorFill = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,102,255,0.1)';

  return (
    <div className="space-y-5">
      {/* Gráfico de Barras: Ingresos */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Ingresos (Últimos 7 días)</CardTitle>
            <Button variant="ghost" size="sm">
              Ver Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={36}>
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0066FF" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="repairGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: tickFill, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                  iconType="rect"
                  iconSize={10}
                />
                <Bar
                  yAxisId="left"
                  dataKey="ingresos"
                  fill="url(#primaryGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                  name="Ingresos"
                />
                <Bar
                  yAxisId="right"
                  dataKey="reparaciones"
                  fill="url(#repairGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                  name="Reparaciones"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Torta: Estados de Reparación */}
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Estados de Reparación</CardTitle>
            <Button variant="ghost" size="sm" onClick={onStatesModalOpen}>
              Ver Detalle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-48 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repairStatesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {repairStatesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip repairStatesData={repairStatesData} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabla: Últimas Reparaciones */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Últimas Reparaciones</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate('/reparaciones/list')}
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-auto max-h-52">
            <table className="w-full">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">
                    ORDEN
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">
                    DISPOSITIVO
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">
                    ESTADO
                  </th>
                </tr>
              </thead>
              <tbody>
                {repairs.length > 0 ? (
                  repairs.map((repair) => {
                    const statusBadge = getStatusBadge(repair.estado);
                    return (
                      <tr key={repair.id} className="border-b border-border">
                        <td className="text-sm font-mono text-foreground py-2 px-3">
                          {repair.id}
                        </td>
                        <td className="text-sm text-foreground py-2 px-3">
                          <div className="flex items-center gap-2">
                            <MdPhoneAndroid size={16} />
                            <span className="truncate">{repair.dispositivo}</span>
                          </div>
                        </td>
                        <td className="text-sm py-2 px-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${statusBadge?.color}20`,
                              color: statusBadge?.color,
                            }}
                          >
                            {getStatusIcon(repair.estado)}
                            {statusBadge?.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border-b border-border">
                    <td colSpan={3} className="text-sm text-muted-foreground py-4 px-3 text-center">
                      No hay reparaciones recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default RevenueChart;
