import React from 'react';
import { MdReceipt, MdHourglassEmpty, MdCheckCircle, MdBarChart } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from './Budgets.types';

interface BudgetsKPIsProps {
  totalBudgets: number;
  totalPending: number;
  totalApproved: number;
  totalValue: number;
}

export const BudgetsKPIs: React.FC<BudgetsKPIsProps> = ({
  totalBudgets,
  totalPending,
  totalApproved,
  totalValue,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MdReceipt className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalBudgets}</p>
          <p className="text-sm text-muted-foreground">Total de presupuestos</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <MdHourglassEmpty className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-500">{totalPending}</p>
          <p className="text-sm text-muted-foreground">Pendientes de aprobación</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <MdCheckCircle className="h-5 w-5 text-success" />
            </div>
          </div>
          <p className="text-2xl font-bold text-success">{totalApproved}</p>
          <p className="text-sm text-muted-foreground">Aprobados</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MdBarChart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
          <p className="text-sm text-muted-foreground">Valor total</p>
        </CardContent>
      </Card>
    </div>
  );
};
