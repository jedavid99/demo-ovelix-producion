import { AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getCategoryBadge, getStatusBadge } from '../constants';
import type { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
  onAddNew?: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  totalCount?: number;
  totalPages?: number;
}

export function ExpenseTable({ expenses, onAddNew, loading, error, onRetry, totalCount = 0, totalPages = 1 }: ExpenseTableProps) {
  if (loading && expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
          <AlertCircle size={48} className="text-destructive mb-4" />
          <p className="text-lg font-semibold text-foreground mb-1">Error al cargar los gastos</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">{error}</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={48} className="text-muted-foreground/40 mb-4" />
            <p className="text-lg font-semibold text-foreground mb-1">No hay gastos</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Aún no hay gastos registrados. Agrega tu primer gasto para comenzar a monitorear los costos.
            </p>
            <Button variant="outline" className="mt-4" onClick={onAddNew}>
              <Plus size={16} className="mr-2" />
              Nuevo gasto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proveedor</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{expense.description}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={getCategoryBadge(expense.categoryColor).variant}>{expense.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{expense.supplier}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={getStatusBadge(expense.status).variant}>{expense.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {expenses.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">Mostrando {expenses.length} de {totalCount} gastos</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Anterior</Button>
              <Button variant="default" size="sm" disabled={totalPages <= 1} title={totalPages <= 1 ? 'No hay más páginas' : undefined}>Siguiente</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
