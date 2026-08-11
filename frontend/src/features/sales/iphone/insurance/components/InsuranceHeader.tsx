import { Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface InsuranceHeaderProps {
  onAddInsurance: () => void;
}

export function InsuranceHeader({ onAddInsurance }: InsuranceHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dispositivos Vendidos y Asegurados</h1>
        <p className="text-muted-foreground text-base max-w-lg">
          Gestione registros de ventas detallados, rastree pólizas de seguro activas y monitoree fechas de vencimiento para todas las unidades iPhone.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onAddInsurance} variant="outline" className="w-full gap-2 bg-primary text-primary-foreground">
          <Shield size={16} />
          Agregar seguro
        </Button>
      </div>
    </div>
  );
}
