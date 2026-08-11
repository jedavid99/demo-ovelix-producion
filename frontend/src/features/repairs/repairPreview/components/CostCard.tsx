import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { DollarSign } from 'lucide-react';

interface CostCardProps {
  total_reparacion: number | string;
  repuestosTotal: number;
  hasRepuestos: boolean;
  formatCurrency: (v: any) => string;
}

export function CostCard({ total_reparacion, repuestosTotal, hasRepuestos, formatCurrency }: CostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Costos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {hasRepuestos && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total repuestos:</span>
            <span className="font-medium">{formatCurrency(repuestosTotal)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total reparación:</span>
          <span className="font-bold">{formatCurrency(total_reparacion)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
