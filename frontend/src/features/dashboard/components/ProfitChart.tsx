import React from 'react';
import { Wallet, TrendingUp, CalendarDays, ArrowUpRight, ArrowDownRight, Package, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ChartDataPoint } from '../types/dashboard.types';
import { formatCurrency } from '../constants/dashboard.constants';

interface ProfitChartProps {
  totalProfit30d: number;
  salesData: ChartDataPoint[];
  loading: boolean;
}

export function ProfitChart({ totalProfit30d, salesData, loading }: ProfitChartProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-16 w-36 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const total7d = salesData.reduce((sum, d) => sum + d.ingresos, 0);
  const avgDaily = total7d > 0 ? total7d / salesData.filter(d => d.ingresos > 0).length : 0;
  const maxDay = Math.max(...salesData.map(d => d.ingresos), 1);

  const lastDay = salesData[salesData.length - 1]?.ingresos || 0;
  const prevDay = salesData[salesData.length - 2]?.ingresos || 0;
  const dayTrend = prevDay > 0 ? ((lastDay - prevDay) / prevDay) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ganancias Totales</p>
              <p className="text-4xl font-bold text-foreground">{formatCurrency(totalProfit30d)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays size={16} />
            <span>Últimos 30 días</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Promedio diario (7d)</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(Math.round(avgDaily))}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">Total últimos 7 días</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(total7d)}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              {dayTrend >= 0
                ? <ArrowUpRight size={16} className="text-success" />
                : <ArrowDownRight size={16} className="text-destructive" />
              }
              <span className="text-xs text-muted-foreground">vs. día anterior</span>
            </div>
            <p className={`text-xl font-semibold ${dayTrend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {dayTrend > 0 ? '+' : ''}{dayTrend.toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-3">Ingresos diarios (7 días)</p>
          <div className="flex items-end gap-2 h-24">
            {salesData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max((day.ingresos / maxDay) * 100, 4)}%`,
                    background: 'linear-gradient(to top, #1e3f57, #3c517d)',
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{day.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ProfitChart;