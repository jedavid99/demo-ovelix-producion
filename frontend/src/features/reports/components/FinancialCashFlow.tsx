import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '../constants/financial.constants';
import type { CashFlow } from '../types/financial.types';

interface FinancialCashFlowProps {
  cashFlow: CashFlow[];
}

export const FinancialCashFlow: React.FC<FinancialCashFlowProps> = ({ cashFlow }) => {
  return (
    <Card>
      <CardHeader><CardTitle>Flujo de Caja (Últimos 3 meses)</CardTitle></CardHeader>
      <CardContent>
        {cashFlow.length === 0 ? (
          <EmptyState icon={BarChart3} title="No hay datos de flujo de caja disponibles" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-3 shadow-lg">
                      <p className="text-sm font-semibold">{payload[0].payload.month}</p>
                      <p className="text-sm text-success">Ingresos: {formatCurrency(payload[0].payload.income)}</p>
                      <p className="text-sm text-destructive">Egresos: {formatCurrency(payload[0].payload.expense)}</p>
                      <p className="text-sm font-semibold">Balance: {formatCurrency(payload[0].payload.balance)}</p>
                    </Card>
                  );
                }
                return null;
              }} />
              <Legend />
              <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
export default FinancialCashFlow;
