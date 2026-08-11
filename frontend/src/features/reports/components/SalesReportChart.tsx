import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { COLORS, formatCurrency } from '../constants/salesReport.constants'
import type { EvolutionData, CategoryData } from '../types/salesReport.types'

interface SalesReportChartProps {
  evolutionData: EvolutionData[]
  categoryData: CategoryData[]
}

const SalesReportChart: React.FC<SalesReportChartProps> = ({ evolutionData, categoryData }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          {evolutionData.length === 0 ? (
            <EmptyState icon={BarChart3} title="No hay datos de ventas para mostrar" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrimary)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ventas por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <EmptyState icon={BarChart3} title="Sin datos de categorías" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
                        const value = payload[0].value as number
                        const percentage = ((value / total) * 100).toFixed(1)
                        return (
                          <Card className="p-3 shadow-lg">
                            <p className="text-sm font-semibold">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                            <p className="text-xs text-muted-foreground">{percentage}%</p>
                          </Card>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default SalesReportChart
