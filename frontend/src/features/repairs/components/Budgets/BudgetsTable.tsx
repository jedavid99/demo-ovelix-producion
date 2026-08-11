import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Receipt } from 'lucide-react';
import { MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency, getStatusBadge } from './Budgets.types';
import type { Budget } from './Budgets.types';

interface BudgetsTableProps {
  budgets: Budget[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalFiltered: number;
  onDelete?: (budgetId: string) => void;
}

export const BudgetsTable: React.FC<BudgetsTableProps> = ({
  budgets,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalFiltered,
  onDelete,
}) => {
  const navigate = useNavigate();

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de presupuestos</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Receipt}
            title="No hay presupuestos que coincidan con los filtros"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de presupuestos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/80 backdrop-blur-md sticky top-0">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Dispositivo</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium">Fecha</th>
                <th className="pb-3 font-medium text-center">Estado</th>
                <th className="pb-3 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {budgets.map((budget) => (
                <tr
                  key={budget.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 font-mono font-medium">{budget.id}</td>
                  <td className="py-3">{budget.clientName}</td>
                  <td className="py-3">{budget.device}</td>
                  <td className="py-3 text-right font-semibold">
                    {formatCurrency(budget.total)}
                  </td>
                  <td className="py-3">
                    {format(budget.date, 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={getStatusBadge(budget.status)} size="sm">
                      {budget.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8"
                        onClick={() => navigate(`/budgets/${budget.id}`)}
                      >
                        <MdVisibility size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8"
                        onClick={() => navigate(`/budgets/edit/${budget.id}`)}
                      >
                        <MdEdit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete?.(budget.id)}
                      >
                        <MdDelete size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, totalFiltered)} de{' '}
            {totalFiltered}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
