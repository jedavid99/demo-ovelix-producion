import { TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ExpectedBalanceCardProps {
  transactions: number;
}

export function ExpectedBalanceCard({ transactions }: ExpectedBalanceCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <CardTitle>Saldo esperado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Efectivo inicial</span>
            <span className="font-semibold text-foreground">$</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Ventas en efectivo (+)</span>
            <span className="font-semibold text-foreground">$</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Ventas tarjeta (ref)</span>
            <span className="font-semibold text-muted-foreground">$</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Gastos (-)</span>
            <span className="font-semibold text-destructive">$</span>
          </div>
          <div className="flex justify-between items-center pt-6">
            <span className="text-lg font-bold text-foreground">Total esperado</span>
            <span className="text-2xl font-bold text-primary">$</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary rounded-lg text-primary-foreground">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-primary font-semibold uppercase tracking-wider">Transacciones</p>
              <p className="text-2xl font-bold text-foreground">{transactions} reparaciones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
