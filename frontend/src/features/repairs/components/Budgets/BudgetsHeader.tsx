import React from 'react';
import { MdFileDownload, MdAdd } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';

interface BudgetsHeaderProps {
  onExport: () => void;
  onNewBudget: () => void;
  hasBudgets: boolean;
}

export const BudgetsHeader: React.FC<BudgetsHeaderProps> = ({
  onExport,
  onNewBudget,
  hasBudgets,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Presupuestos de Reparaciones</h1>
        <p className="text-muted-foreground">Gestión de presupuestos y cotizaciones</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onExport} variant="outline" className="gap-2" disabled={!hasBudgets}>
          <MdFileDownload size={18} />
          Exportar
        </Button>
        <Button onClick={onNewBudget} className="gap-2">
          <MdAdd size={18} />
          Nuevo presupuesto
        </Button>
      </div>
    </div>
  );
};
