import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { MdSchedule, MdShoppingCart } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatCurrency } from '../constants/dashboard.constants';

interface DailySale {
  name: string;
  stock: number;
  stockCount: number;
}

interface SalesSummaryProps {
  dailyBreakdown: DailySale[];
  stockSalesTotal: number;
  stockSalesCount: number;
  loading: boolean;
}

export function SalesSummary({ dailyBreakdown, stockSalesTotal, stockSalesCount, loading }: SalesSummaryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const timelineData = dailyBreakdown.map(d => ({
    date: d.name,
    transactions: d.stockCount,
    revenue: d.stock,
  }));

  const allZero = timelineData.every(d => d.transactions === 0 && d.revenue === 0);

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MdShoppingCart className="text-primary" size={18} />
          Ventas (Últimos 7 días)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {stockSalesTotal > 0 && (
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="text-muted-foreground">
              Total:{' '}
              <span className="font-semibold text-foreground">{formatCurrency(stockSalesTotal)}</span>
            </span>
            <span className="text-muted-foreground">
              Transacciones:{' '}
              <span className="font-semibold text-foreground">{stockSalesCount}</span>
            </span>
          </div>
        )}
        {allZero ? (
          <div className="text-center py-12 text-muted-foreground">
            <MdSchedule size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <p>No hay datos de ventas para mostrar</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" yAxisId="left" />
              <YAxis className="text-xs" yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const date = payload[0]?.payload?.date || '';
                  const transactions = payload.find(p => p.name === 'transactions')?.value || 0;
                  const revenue = payload.find(p => p.name === 'revenue')?.value as number || 0;
                  return (
                    <Card className="p-3 shadow-lg border-border">
                      <p className="text-sm font-semibold text-foreground">{date}</p>
                      <p className="text-sm" style={{ color: '#3b82f6' }}>Transacciones: {transactions}</p>
                      <p className="text-sm" style={{ color: '#10b981' }}>Ingresos: {formatCurrency(revenue)}</p>
                    </Card>
                  );
                }
                return null;
              }} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="transactions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTransactions)" name="Transacciones" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
export default SalesSummary;