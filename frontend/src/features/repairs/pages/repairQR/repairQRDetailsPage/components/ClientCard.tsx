import { User, Phone, Mail, MapPin, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface ClientCardProps {
  repair: RepairDetail;
  clientDni: string;
  technicianName: string;
}

export function ClientCard({ repair, clientDni, technicianName }: ClientCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><User className="w-5 h-5 text-primary" />Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre Completo</label>
          <p className="font-semibold text-lg mt-0.5">{repair.cliente?.nombre_completo || repair.cliente?.nombre || '—'}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DNI</label>
          <p className="font-mono font-semibold mt-0.5">{clientDni}</p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"><Phone className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{repair.cliente?.telefono || '—'}</span></div>
        {repair.cliente?.email && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"><Mail className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{repair.cliente.email}</span></div>}
        {repair.cliente?.direccion && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"><MapPin className="w-4 h-4 text-muted-foreground" /><span className="font-semibold">{repair.cliente.direccion}</span></div>}
        <div className="pt-3 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Técnico Asignado</label>
          <p className="font-semibold mt-0.5 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-primary" />{technicianName}</p>
        </div>
      </CardContent>
    </Card>
  );
}
