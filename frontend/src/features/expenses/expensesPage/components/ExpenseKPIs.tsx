import { AlertCircle, Clock, PieChart } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatCurrency } from '@/utils/currency';

interface ExpenseKPIsProps {
  totalMonth: number;
  pendingCount: number;
  pendingApproval: number;
  totalSpent?: number;
  topCategory?: string | null;
}

export function ExpenseKPIs({ totalMonth, pendingCount, pendingApproval, totalSpent, topCategory }: ExpenseKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total (Mes)</p>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{formatCurrency(totalMonth)}</p>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
            <span>{totalMonth > 0 ? 'Gastos registrados este mes' : 'Sin gastos este mes'}</span>
          </div>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pagos Pendientes</p>
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">{pendingCount}</p>
          <p className="text-muted-foreground text-sm mt-2">Esperando aprobación: {pendingApproval}</p>
        </CardContent>
      </Card>
      <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría Principal</p>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <PieChart className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2 truncate">{topCategory || '—'}</p>
          <p className="text-muted-foreground text-sm mt-2">{topCategory ? 'Mayor gasto del período' : 'Sin datos'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
