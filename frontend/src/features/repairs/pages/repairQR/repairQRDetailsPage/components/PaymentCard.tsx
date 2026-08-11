import { CreditCard, CheckCircle, AlertTriangle, AlertCircle, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { GarantiaProgress } from '../../../../components/GarantiaProgress';
import { RepairTimeline } from '../../../../components/RepairTimeline';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface PaymentCardProps {
  repair: RepairDetail;
}

export function PaymentCard({ repair }: PaymentCardProps) {
  return (
    <>
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden mt-6">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-base"><CreditCard className="w-5 h-5 text-primary" />Información de Pago</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          {repair.metodo_pago && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Método de Pago</label><p className="font-semibold mt-0.5">{repair.metodo_pago}</p></div>}
          {repair.forma_pago && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Forma de Pago</label><p className="font-semibold mt-0.5">{repair.forma_pago}</p></div>}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado del Pago</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {repair.pago_completo && <Badge className="bg-success text-white gap-1.5 px-3 py-1.5 text-sm"><CheckCircle className="w-3.5 h-3.5" /> Pago Completo</Badge>}
              {repair.pago_parcial && <Badge className="bg-yellow-500 text-white gap-1.5 px-3 py-1.5 text-sm"><AlertTriangle className="w-3.5 h-3.5" /> Pago Parcial</Badge>}
              {!repair.pago_completo && !repair.pago_parcial && <Badge className="bg-muted0 text-white gap-1.5 px-3 py-1.5 text-sm"><AlertCircle className="w-3.5 h-3.5" /> Sin Pagar</Badge>}
            </div>
          </div>
          <div className="md:col-span-3">
            <GarantiaProgress
              tiene_garantia={repair.tiene_garantia || false}
              fecha_inicio_garantia={repair.fecha_inicio_garantia}
              fecha_fin_garantia={repair.fecha_fin_garantia}
              garantia_duracion={repair.garantia_duracion}
              garantia_unidad={repair.garantia_unidad}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden mt-6">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2 text-base"><History className="w-5 h-5 text-primary" />Historial de Cambios de Estado</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <RepairTimeline repairId={repair.id} />
        </CardContent>
      </Card>
    </>
  );
}
