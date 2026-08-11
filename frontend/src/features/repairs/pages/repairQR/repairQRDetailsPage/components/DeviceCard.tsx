import { Smartphone, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface DeviceCardProps {
  repair: RepairDetail;
  formatDate: (d: string) => string;
  formatCurrency: (v: number) => string;
}

export function DeviceCard({ repair, formatDate, formatCurrency }: DeviceCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><Smartphone className="w-5 h-5 text-primary" />Dispositivo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dispositivo</label>
            <p className="font-semibold text-foreground mt-0.5">{repair.dispositivo || '—'}</p>
          </div>
          {repair.marca && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Marca</label><p className="font-semibold text-foreground mt-0.5">{repair.marca}</p></div>}
          {(repair.modelo || repair.modelo_dispositivo) && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo</label><p className="font-semibold text-foreground mt-0.5">{repair.modelo || repair.modelo_dispositivo}</p></div>}
          {repair.categoria_dispositivo && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoría</label><p className="font-semibold text-foreground mt-0.5">{repair.categoria_dispositivo}</p></div>}
          {repair.imei && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">IMEI</label><p className="font-mono text-sm font-semibold text-foreground mt-0.5">{repair.imei}</p></div>}
        </div>
        {repair.numero_serie && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Número de Serie</label><p className="font-mono text-sm font-semibold text-foreground mt-0.5">{repair.numero_serie}</p></div>}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Problema Reportado</label>
          <p className="text-sm font-medium text-foreground mt-0.5 bg-muted/30 p-2 rounded-lg">{repair.problema_reportado || repair.problema || '—'}</p>
        </div>
        {repair.diagnostico && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diagnóstico</label><p className="text-sm font-medium text-foreground mt-0.5 bg-muted/30 p-2 rounded-lg">{repair.diagnostico}</p></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Ingreso</label>
            <p className="font-semibold mt-0.5">{formatDate(repair.fecha_ingreso)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Entrega estimada</label>
            <p className="font-semibold mt-0.5">{formatDate(repair.fecha_estimada_entrega)}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo Total</label>
          <p className="text-2xl font-bold text-primary mt-0.5">{formatCurrency(repair.total_reparacion)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
