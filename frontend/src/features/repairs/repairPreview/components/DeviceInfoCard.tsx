import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface DeviceInfo {
  dispositivo: string;
  marca?: string;
  modelo?: string;
}

export function DeviceInfoCard({ dispositivo, marca, modelo }: DeviceInfo) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Información del Dispositivo</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dispositivo:</span>
          <span className="font-medium">{dispositivo || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Marca:</span>
          <span className="font-medium">{marca || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Modelo:</span>
          <span className="font-medium">{modelo || '—'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
