import { Smartphone } from 'lucide-react';

interface DeviceInfo {
  dispositivo: string;
  marca?: string;
  modelo?: string;
}

export function DeviceInfoCard({ dispositivo, marca, modelo }: DeviceInfo) {
  return (
    <div className="px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Smartphone className="h-3.5 w-3.5" />
        Dispositivo
      </div>
      <div className="space-y-2.5">
        <Field label="Tipo" value={dispositivo} />
        <Field label="Marca" value={marca} />
        <Field label="Modelo" value={modelo} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right truncate">{value || '—'}</span>
    </div>
  );
}
