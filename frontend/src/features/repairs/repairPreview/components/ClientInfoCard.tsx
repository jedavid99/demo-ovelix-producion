import { User } from 'lucide-react';

interface ClientInfo {
  nombre_completo?: string;
  telefono?: string;
  email?: string;
}

export function ClientInfoCard({ cliente }: { cliente?: ClientInfo }) {
  return (
    <div className="px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <User className="h-3.5 w-3.5" />
        Cliente
      </div>
      <div className="space-y-2.5">
        <Field label="Nombre" value={cliente?.nombre_completo} />
        <Field label="Teléfono" value={cliente?.telefono} />
        <Field label="Email" value={cliente?.email} />
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
