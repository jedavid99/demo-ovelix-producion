import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '../constants/financial.constants';
import type { EvolutionData } from '../types/financial.types';

interface FinancialChartProps {
  evolutionData: EvolutionData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const income = (payload.find((p: any) => p.name === 'income')?.value as number) || 0;
    const expense = (payload.find((p: any) => p.name === 'expense')?.value as number) || 0;
    return (
      <Card className="p-3 shadow-lg">
        <p className="text-sm font-semibold">{payload[0].payload.date}</p>
        <p className="text-sm text-success">Ingresos: {formatCurrency(income)}</p>
        <p className="text-sm text-destructive">Egresos: {formatCurrency(expense)}</p>
        <p className="text-sm font-semibold">Balance: {formatCurrency(income - expense)}</p>
      </Card>
    );
  }
  return null;
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ evolutionData }) => {
  return (
    <Card>
      <CardHeader><CardTitle>Ingresos vs Egresos</CardTitle></CardHeader>
      <CardContent>
        {evolutionData.length === 0 ? (
          <EmptyState icon={BarChart3} title="No hay datos financieros para mostrar" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
export default FinancialChart;
