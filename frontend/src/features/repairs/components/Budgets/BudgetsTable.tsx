import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Receipt } from 'lucide-react';
import { MdVisibility, MdEdit, MdDelete, MdCheckCircle, MdCancel, MdPrint } from 'react-icons/md';
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
  onView?: (budgetId: string) => void;
  onEdit?: (budgetId: string) => void;
  onDelete?: (budgetId: string) => void;
  onApprove?: (budgetId: string) => void;
  onReject?: (budgetId: string) => void;
  onPrint?: (budget: Budget) => void;
}

const canEdit = (b: Budget) => b.status === 'Pendiente';

export const BudgetsTable: React.FC<BudgetsTableProps> = ({
  budgets,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalFiltered,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onPrint,
}) => {
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
          <table className="w-full min-w-[1024px]">
            <thead className="sticky top-0 z-10 bg-card/95 backdrop-blur-md">
              <tr className="text-left font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Cliente</th>
                <th className="pb-3 pr-4 font-medium">Dispositivo</th>
                <th className="pb-3 pr-4 font-medium">Fecha</th>
                <th className="pb-3 pr-4 font-medium">Vigencia</th>
                <th className="pb-3 pr-4 font-medium">Estado</th>
                <th className="pb-3 pl-6 pr-8 text-right font-medium">Total</th>
                <th className="pb-3 text-center font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {budgets.map((budget) => {
                const editable = canEdit(budget);
                return (
                  <tr
                    key={budget.id}
                    className="border-b border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="py-3 pr-4 font-mono text-xs font-medium text-muted-foreground">
                      {budget.numero || budget.id}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{budget.clientName}</p>
                      <p className="text-xs text-muted-foreground">{budget.clientPhone}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p>{budget.device}</p>
                      {budget.issue && (
                        <p className="max-w-[200px] truncate text-xs text-muted-foreground" title={budget.issue}>
                          {budget.issue}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                      {format(budget.date, 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs">{budget.vigenciaDias ?? 7} días</p>
                      {budget.fechaVencimiento && (
                        <p
                          className={
                            budget.status === 'Pendiente' && budget.fechaVencimiento < new Date()
                              ? 'text-xs font-medium text-destructive'
                              : 'text-xs text-muted-foreground'
                          }
                        >
                          vence {format(budget.fechaVencimiento, 'dd/MM/yyyy', { locale: es })}
                        </p>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={getStatusBadge(budget.status)} size="sm">
                        {budget.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-8 text-right font-mono text-sm font-semibold tabular-nums">
                      {formatCurrency(budget.total)}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8"
                          onClick={() => onView?.(budget.id)}
                          title="Ver detalle"
                        >
                          <MdVisibility size={16} />
                        </Button>
                        {onPrint && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8"
                            onClick={() => onPrint?.(budget)}
                            title="Imprimir PDF"
                          >
                            <MdPrint size={16} />
                          </Button>
                        )}
                        {editable && onApprove && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-green-600 hover:text-green-600"
                            onClick={() => onApprove?.(budget.id)}
                            title="Aprobar (crea la reparación)"
                          >
                            <MdCheckCircle size={16} />
                          </Button>
                        )}
                        {editable && onReject && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onReject?.(budget.id)}
                            title="Rechazar"
                          >
                            <MdCancel size={16} />
                          </Button>
                        )}
                        {editable && onEdit && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8"
                            onClick={() => onEdit?.(budget.id)}
                            title="Editar"
                          >
                            <MdEdit size={16} />
                          </Button>
                        )}
                        {editable && onDelete && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onDelete?.(budget.id)}
                            title="Eliminar"
                          >
                            <MdDelete size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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