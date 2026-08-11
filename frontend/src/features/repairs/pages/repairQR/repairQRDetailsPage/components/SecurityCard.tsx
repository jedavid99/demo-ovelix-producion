import { Shield, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { RepairDetail } from '../../../../types/repairQR/repairQR.types';

interface SecurityCardProps {
  repair: RepairDetail;
}

export function SecurityCard({ repair }: SecurityCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-base"><Shield className="w-5 h-5 text-primary" />Seguridad del Teléfono</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {repair.seguridad_telefono ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {repair.seguridad_telefono.pin && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">PIN</label><p className="font-mono font-semibold mt-0.5">{repair.seguridad_telefono.pin}</p></div>}
              {repair.seguridad_telefono.patron && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patrón</label><p className="font-mono font-semibold mt-0.5">{repair.seguridad_telefono.patron}</p></div>}
              {repair.seguridad_telefono.password && <div className="sm:col-span-2"><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contraseña</label><p className="font-mono font-semibold mt-0.5">{repair.seguridad_telefono.password}</p></div>}
            </div>
            <div className="flex flex-wrap gap-3">
              {repair.seguridad_telefono.face_id !== undefined && <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium"><Shield className="w-3.5 h-3.5 text-primary" /> Face ID: {repair.seguridad_telefono.face_id ? '✅ Sí' : '❌ No'}</Badge>}
              {repair.seguridad_telefono.touch_id !== undefined && <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-medium"><Shield className="w-3.5 h-3.5 text-primary" /> Touch ID: {repair.seguridad_telefono.touch_id ? '✅ Sí' : '❌ No'}</Badge>}
            </div>
            {repair.seguridad_telefono.notas && <div><label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notas de Seguridad</label><p className="text-sm font-medium bg-muted/30 p-2 rounded-lg mt-1">{repair.seguridad_telefono.notas}</p></div>}
          </>
        ) : (
          <div className="flex items-center justify-center p-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed"><Info className="w-5 h-5 mr-2" />No hay información de seguridad registrada</div>
        )}
      </CardContent>
    </Card>
  );
}
