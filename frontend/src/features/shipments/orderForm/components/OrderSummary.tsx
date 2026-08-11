import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency, IVA_RATE } from '../constants';

interface OrderSummaryProps {
  subtotal: number;
  total: number;
}

export function OrderSummary({ subtotal, total }: OrderSummaryProps) {
  const iva = subtotal * IVA_RATE;

  return (
    <Card>
      <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">IVA (21%)</span>
          <span>{formatCurrency(iva)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
