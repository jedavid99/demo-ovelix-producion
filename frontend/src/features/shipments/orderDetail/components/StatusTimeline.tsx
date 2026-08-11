import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { StatusChange } from '../types';

interface StatusTimelineProps {
  history: StatusChange[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de estados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((change, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  change.status === 'Pendiente' ? 'bg-warning' :
                  change.status === 'Enviada' ? 'bg-primary' :
                  change.status === 'Recibida' ? 'bg-success' :
                  'bg-destructive'
                }`} />
                {index < history.length - 1 && (
                  <div className="w-0.5 h-8 bg-border" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{change.status}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(change.date, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                {change.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{change.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
