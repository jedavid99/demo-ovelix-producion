import { Button } from '@/shared/components/ui/button';

interface ExpensesAddHeaderProps {
  onCancel: () => void;
}

export function ExpensesAddHeader({ onCancel }: ExpensesAddHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo gasto</h1>
        <p className="text-sm text-muted-foreground">Registra una nueva transacci&oacute;n para el control de costos.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} size="sm">Cancelar</Button>
      </div>
    </div>
  );
}
