import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Clock } from 'lucide-react';

interface StatusCardProps {
  title: string;
  badgeVariant: 'warning' | 'default' | 'success' | 'destructive';
  badgeLabel: string;
}

export function StatusCard({ title, badgeVariant, badgeLabel }: StatusCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <Badge variant={badgeVariant} size="sm">{badgeLabel}</Badge>
      </CardContent>
    </Card>
  );
}

interface DatesCardProps {
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  formatDate: (d: string) => string;
}

export function DatesCard({ fecha_ingreso, fecha_estimada_entrega, formatDate }: DatesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Fechas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fecha de ingreso:</span>
          <span className="font-medium">{formatDate(fecha_ingreso)}</span>
        </div>
        {fecha_estimada_entrega && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha estimada de entrega:</span>
            <span className="font-medium">{formatDate(fecha_estimada_entrega)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
