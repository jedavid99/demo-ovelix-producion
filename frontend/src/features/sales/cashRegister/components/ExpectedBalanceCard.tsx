import { TrendingUp, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ExpectedBalanceCardProps {
  transactions: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalTransferencia: number;
  totalVentas: number;
  loading?: boolean;
}

export function ExpectedBalanceCard({
  transactions, totalEfectivo, totalTarjeta, totalTransferencia, totalVentas, loading,
}: ExpectedBalanceCardProps) {
  const fmt = (v: number) => `$${v.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <Row label="Ventas en efectivo (+)" value={fmt(totalEfectivo)} />
              <Row label="Ventas tarjeta (ref)" value={fmt(totalTarjeta)} muted />
              <Row label="Transferencias (ref)" value={fmt(totalTransferencia)} muted />
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-lg font-bold text-foreground">Total esperado</span>
                <span className="text-2xl font-bold text-primary">{fmt(totalVentas)}</span>
              </div>
            </>
          )}
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
              <p className="text-2xl font-bold text-foreground">{transactions} ventas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
