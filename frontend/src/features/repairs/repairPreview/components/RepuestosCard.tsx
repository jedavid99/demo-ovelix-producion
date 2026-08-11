import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Package } from 'lucide-react';

interface Repuesto {
  nombre: string;
  cantidad: number;
  costo_unitario: number | string;
}

interface RepuestosCardProps {
  repuestos: Repuesto[];
  formatCurrency: (v: any) => string;
  calculateTotal: () => number;
}

export function RepuestosCard({ repuestos, formatCurrency, calculateTotal }: RepuestosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-4 w-4" />
          Repuestos Usados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {repuestos.map((repuesto, index) => (
            <div key={index} className="flex justify-between text-sm border-b pb-2">
              <span>{repuesto.nombre}</span>
              <span>{repuesto.cantidad} x {formatCurrency(repuesto.costo_unitario)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total repuestos:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
