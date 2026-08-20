import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  MdPrint,
  MdCheckCircle,
  MdCancel,
  MdEdit,
  MdDelete,
} from 'react-icons/md';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency, getStatusBadge } from './Budgets.types';
import type { Budget } from './Budgets.types';

interface BudgetDetailProps {
  budget: Budget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPrint?: (budget: Budget) => void;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-border pb-2">
    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      {label}
    </dt>
    <dd className="truncate text-right font-medium text-foreground">{children}</dd>
  </div>
);

export const BudgetDetail: React.FC<BudgetDetailProps> = ({
  budget,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onPrint,
}) => {
  if (!budget) return null;

  const editable = budget.status === 'Pendiente';
  const items = budget.items ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <DialogTitle className="flex items-center gap-2">
              Presupuesto
              <span className="font-mono text-sm text-primary">{budget.numero || budget.id}</span>
            </DialogTitle>
            <Badge variant={getStatusBadge(budget.status)} size="sm">
              {budget.status}
            </Badge>
          </div>
          <DialogDescription className="sr-only">Detalle del presupuesto</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Cliente
            </p>
            <dl className="space-y-2">
              <Row label="Nombre">{budget.clientName}</Row>
              {budget.clientDni && <Row label="DNI">{budget.clientDni}</Row>}
              <Row label="Teléfono">{budget.clientPhone}</Row>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Detalle
            </p>
            <dl className="space-y-2">
              <Row label="Dispositivo">{budget.device}</Row>
              {budget.deviceType && <Row label="Tipo">{budget.deviceType}</Row>}
              {budget.issue && (
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-border pb-2">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    Problema
                  </dt>
                  <dd className="text-right text-sm text-foreground">{budget.issue}</dd>
                </div>
              )}
              {budget.tipo && <Row label="Tipo">{budget.tipo === 'venta' ? 'Venta' : 'Reparación'}</Row>}
              {budget.category && <Row label="Categoría">{budget.category}</Row>}
              <Row label="Emitido">
                {format(budget.date, 'dd/MM/yyyy HH:mm', { locale: es })}
              </Row>
            </dl>
          </div>

          {items.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Productos / Servicios
              </p>
              <ul className="space-y-1.5">
                {items.map((it, i) => (
                  <li key={it.id} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-foreground">
                      {it.device || it.deviceType || `Producto ${i + 1}`}
                    </span>
                    <span className="shrink-0 font-mono tabular-nums text-foreground">
                      {formatCurrency(it.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Totales
            </p>
            <dl className="space-y-2">
              <Row label="Subtotal">{formatCurrency(budget.baseTotal ?? budget.total)}</Row>
              {(budget.taxRatePorct ?? 0) > 0 && (
                <Row label={`Recargo (${budget.taxRatePorct}%)`}>
                  {formatCurrency(budget.total - (budget.baseTotal ?? budget.total))}
                </Row>
              )}
              <div className="flex items-baseline justify-between gap-4 pt-1">
                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  Total a pagar
                </dt>
                <dd className="font-mono text-2xl font-bold tabular-nums text-primary">
                  {formatCurrency(budget.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Vigencia
            </p>
            <dl className="space-y-2">
              <Row label="Válido por">{budget.vigenciaDias ?? 7} días</Row>
              <Row label="Vence el">
                {budget.fechaVencimiento
                  ? format(budget.fechaVencimiento, 'dd/MM/yyyy', { locale: es })
                  : '\u2014'}
              </Row>
              {budget.status === 'Pendiente' && budget.fechaVencimiento && budget.fechaVencimiento < new Date() && (
                <p className="text-sm font-medium text-destructive">
                  Este presupuesto venció. No se puede aprobar ni modificar: emití uno nuevo.
                </p>
              )}
            </dl>
          </div>

          {budget.status === 'Aprobado' && budget.repairNumber && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-green-600">
                Aprobado y enviado a reparaciones
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                Reparación N° {budget.repairNumber}
              </p>
            </div>
          )}

          {budget.status === 'Aprobado' && !budget.repairNumber && (
            <p className="text-sm text-muted-foreground">
              Aprobado por el cliente. El precio queda fijado y no puede modificarse.
            </p>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {onPrint && (
            <Button variant="outline" onClick={() => onPrint?.(budget)} className="gap-1.5">
              <MdPrint size={16} />
              Imprimir PDF
            </Button>
          )}
          {editable && onApprove && (
            <Button
              onClick={() => onApprove?.(budget.id)}
              className="gap-1.5 bg-green-600 hover:bg-green-700"
            >
              <MdCheckCircle size={16} />
              Aprobar
            </Button>
          )}
          {editable && onReject && (
            <Button variant="destructive" onClick={() => onReject?.(budget.id)} className="gap-1.5">
              <MdCancel size={16} />
              Rechazar
            </Button>
          )}
          {editable && onEdit && (
            <Button variant="outline" onClick={() => onEdit?.(budget.id)} className="gap-1.5">
              <MdEdit size={16} />
              Editar
            </Button>
          )}
          {editable && onDelete && (
            <Button
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(budget.id)}
            >
              <MdDelete size={16} />
              Eliminar
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDetail;