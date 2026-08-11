import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface ClientInfo {
  nombre_completo?: string;
  telefono?: string;
  email?: string;
}

export function ClientInfoCard({ cliente }: { cliente?: ClientInfo }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Información del Cliente</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Row label="Nombre:" value={cliente?.nombre_completo} />
        <Row label="Teléfono:" value={cliente?.telefono} />
        <Row label="Email:" value={cliente?.email} />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  );
}
