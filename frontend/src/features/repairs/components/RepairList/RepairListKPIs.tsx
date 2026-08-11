import React from 'react';
import { Clock, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from './RepairList.types';

interface RepairListKPIsProps {
  pendingToday: number;
  expiringSoon: number;
  readyToPickup: number;
  totalRevenue: number;
}

export const RepairListKPIs: React.FC<RepairListKPIsProps> = ({
  pendingToday,
  expiringSoon,
  readyToPickup,
  totalRevenue,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendientes Hoy</p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{pendingToday}</p>
        </CardContent>
      </Card>

      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Esperando Repuestos</p>
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{expiringSoon}</p>
        </CardContent>
      </Card>

      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Listos para Recoger</p>
            <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{readyToPickup}</p>
        </CardContent>
      </Card>

      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ingresos Totales</p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{formatCurrency(totalRevenue)}</p>
        </CardContent>
      </Card>
    </div>
  );
};
