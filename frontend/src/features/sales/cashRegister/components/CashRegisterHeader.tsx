import { Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function CashRegisterHeader() {
  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Cierre de Caja</h1>
        <p className="text-muted-foreground capitalize">{today}</p>
      </div>
      <Button variant="outline" className="w-full sm:w-auto">
        <Download size={16} className="mr-2" />
        Exportar resumen
      </Button>
    </div>
  );
}
