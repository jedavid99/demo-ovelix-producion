import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ExpensesHeaderProps {
  onAddNew?: () => void;
}

export function ExpensesHeader({ onAddNew }: ExpensesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos</h1>
        <p className="text-muted-foreground">Monitorea y analiza los costos operativos del negocio</p>
      </div>
      <Button onClick={onAddNew}>
        <Plus size={16} className="mr-2" />
        Nuevo gasto
      </Button>
    </div>
  );
}
