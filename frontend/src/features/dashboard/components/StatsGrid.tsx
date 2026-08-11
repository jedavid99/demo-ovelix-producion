import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, DollarSign, Wrench, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { DashboardStats, KpiTrends } from '../types/dashboard.types';
import { formatCurrency } from '../constants/dashboard.constants';

interface StatsGridProps {
  stats: DashboardStats;
  kpiTrends: KpiTrends;
  loading: boolean;
}

function TrendBadge({ value, invert = false }: { value: number; invert?: boolean }) {
  const isPositive = invert ? value < 0 : value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Clock : isPositive ? TrendingUp : TrendingUp;
  const variant = isNeutral ? 'secondary' : isPositive ? 'success' : 'destructive';
  const label = isNeutral ? '0%' : `${Math.abs(value).toFixed(0)}%`;
  return (
    <Badge variant={variant} size="sm" className="gap-1">
      <Icon size={12} /> {label}
    </Badge>
  );
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, kpiTrends, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card
        variant="interactive"
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        onClick={() => navigate('/reparaciones/list')}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <TrendBadge value={kpiTrends.ordersTrend} />
          </div>
          <p className="text-sm text-muted-foreground">Órdenes Activas</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalActiveOrders}</p>
        </CardContent>
      </Card>

      <Card
        variant="interactive"
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        onClick={() => navigate('/reparaciones/list?estado=ready')}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <TrendBadge value={0} />
          </div>
          <p className="text-sm text-muted-foreground">Listos para Entrega</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalToDeliver}</p>
        </CardContent>
      </Card>

      <Card
        variant="interactive"
        className="hover:shadow-md hover:-translate-y-1 transition-all duration-200"
        onClick={() => navigate('/reports/financial')}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <TrendBadge value={kpiTrends.revenueTrend} />
          </div>
          <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalRevenueToday)}</p>
        </CardContent>
      </Card>

      <Card
        variant="interactive"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-info" />
            </div>
            <TrendBadge value={kpiTrends.repairedTrend} />
          </div>
          <p className="text-sm text-muted-foreground">Equipos Reparados</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalRepaired}</p>
        </CardContent>
      </Card>

      <Card
        variant="interactive"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <TrendBadge value={0} />
          </div>
          <p className="text-sm text-muted-foreground">Ganancias 30 días</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalProfit30d)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default StatsGrid;