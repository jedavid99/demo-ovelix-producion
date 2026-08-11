import { Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function CashRegisterHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Cierre de Caja</h1>
        <p className="text-muted-foreground">Conciliación para 25 de marzo, 2024 • Tienda #104</p>
      </div>
      <Button variant="outline">
        <Download size={16} className="mr-2" />
        Exportar resumen
      </Button>
    </div>
  );
}
