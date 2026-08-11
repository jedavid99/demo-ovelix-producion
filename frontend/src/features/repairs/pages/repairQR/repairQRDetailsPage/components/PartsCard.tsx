import { Package, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface PartsCardProps {
  repair: RepairDetail;
  formatCurrency: (v: number) => string;
}

export function PartsCard({ repair, formatCurrency }: PartsCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><Package className="w-5 h-5 text-primary" />Repuestos Usados</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        {repair.repuestos_usados && repair.repuestos_usados.length > 0 ? (
          <div className="space-y-3">
            {repair.repuestos_usados.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/60">
                <div><p className="font-semibold text-sm">{item.nombre}</p><p className="text-xs text-muted-foreground">Cantidad: {item.cantidad}</p></div>
                <p className="font-bold text-primary text-sm">{formatCurrency(item.precio)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed"><Package className="w-5 h-5 mr-2" />No se han usado repuestos</div>
        )}
      </CardContent>
    </Card>
  );
}
