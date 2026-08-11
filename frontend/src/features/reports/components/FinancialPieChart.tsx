import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency, EXPENSE_COLORS } from '../constants/financial.constants';

interface FinancialPieChartProps {
  expenseData: { name: string; value: number }[];
}

export const FinancialPieChart: React.FC<FinancialPieChartProps> = ({ expenseData }) => {
  return (
    <Card>
      <CardHeader><CardTitle>Distribución de Gastos</CardTitle></CardHeader>
      <CardContent>
        {expenseData.length === 0 ? (
          <EmptyState icon={BarChart3} title="Sin datos de gastos" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {expenseData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const total = expenseData.reduce((sum, cat) => sum + cat.value, 0);
                    return (
                      <Card className="p-3 shadow-lg">
                        <p className="text-sm font-semibold">{payload[0].name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value as number)}</p>
                        <p className="text-xs text-muted-foreground">{((payload[0].value as number) / total * 100).toFixed(1)}%</p>
                      </Card>
                    );
                  }
                  return null;
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {expenseData.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }} />
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
  );
};
export default FinancialPieChart;
