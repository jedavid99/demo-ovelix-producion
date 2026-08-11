import React from 'react'
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts'
import { Wrench, Smartphone, CalendarClock } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { DEVICE_COLORS, formatCurrency } from '../constants/repairsReport.constants'
import type { RepairByStatus, RepairByDevice, RepairTimeline } from '../types/repairsReport.types'

interface RepairsReportChartProps {
  repairsByStatus: RepairByStatus[]
  repairsByDevice: RepairByDevice[]
  timelineData: RepairTimeline[]
}

export const RepairsReportChart: React.FC<RepairsReportChartProps> = ({ repairsByStatus, repairsByDevice, timelineData }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Reparaciones por Estado</CardTitle></CardHeader>
          <CardContent>
            {repairsByStatus.every(d => d.value === 0) ? (
              <EmptyState icon={Wrench} title="No hay datos de reparaciones" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={repairsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {repairsByStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) return <Card className="p-3 shadow-lg"><p className="text-sm font-semibold">{payload[0].name}</p><p className="text-sm text-muted-foreground">{payload[0].value} reparaciones</p></Card>
                    return null
                  }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reparaciones por Tipo de Dispositivo</CardTitle></CardHeader>
          <CardContent>
            {repairsByDevice.length === 0 ? (
              <EmptyState icon={Smartphone} title="Sin datos de dispositivos" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={repairsByDevice}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) return <Card className="p-3 shadow-lg"><p className="text-sm font-semibold">{payload[0].payload.name}</p><p className="text-sm text-muted-foreground">{payload[0].value} reparaciones</p></Card>
                    return null
                  }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {repairsByDevice.map((_, index) => <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Reparaciones e Ingresos (Últimos 7 días)</CardTitle></CardHeader>
        <CardContent>
          {timelineData.every(d => d.repairs === 0 && d.revenue === 0) ? (
            <EmptyState icon={CalendarClock} title="No hay datos de reparaciones para mostrar" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" yAxisId="left" />
                <YAxis className="text-xs" yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) return <Card className="p-3 shadow-lg"><p className="text-sm font-semibold">{payload[0].payload.date}</p><p className="text-sm text-primary">Reparaciones: {payload.find(p => p.name === 'repairs')?.value || 0}</p><p className="text-sm text-success">Ingresos: {formatCurrency(payload.find(p => p.name === 'revenue')?.value as number || 0)}</p></Card>
                  return null
                }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="repairs" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRepairs)" name="Reparaciones" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
export default RepairsReportChart
