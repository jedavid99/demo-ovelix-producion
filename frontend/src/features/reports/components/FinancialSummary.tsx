import React from 'react';
import { MdAttachMoney, MdMoneyOff, MdTrendingUp, MdTrendingDown, MdAccountBalance } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '../constants/financial.constants';

interface FinancialSummaryProps {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  hasData: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ totalIncome, totalExpense, netProfit, profitMargin, hasData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><MdAttachMoney className="h-5 w-5 text-emerald-600" /></div>
            {hasData && <Badge variant="success" size="sm" className="gap-1"><MdTrendingUp size={12} />+15%</Badge>}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
          <p className="text-sm text-muted-foreground">Ingresos Totales</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><MdMoneyOff className="h-5 w-5 text-destructive" /></div>
            {hasData && <Badge variant="destructive" size="sm" className="gap-1"><MdTrendingDown size={12} />-8%</Badge>}
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpense)}</p>
          <p className="text-sm text-muted-foreground">Egresos Totales</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><MdAccountBalance className="h-5 w-5 text-primary" /></div>
            {hasData && (
              <Badge variant={netProfit >= 0 ? 'success' : 'destructive'} size="sm" className="gap-1">
                {netProfit >= 0 ? <MdTrendingUp size={12} /> : <MdTrendingDown size={12} />}{Math.abs(profitMargin).toFixed(1)}%
              </Badge>
            )}
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(netProfit)}</p>
          <p className="text-sm text-muted-foreground">Ganancia Neta</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><MdTrendingUp className="h-5 w-5 text-primary" /></div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-foreground">{profitMargin.toFixed(1)}%</p>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${netProfit >= 0 ? 'bg-success' : 'bg-destructive'} transition-all duration-300`} style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Margen de Ganancia</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default FinancialSummary;
