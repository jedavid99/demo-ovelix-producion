import { Settings } from 'lucide-react';
import { CURRENCY_OPTIONS, DATE_FORMAT_OPTIONS, TIMEZONE_OPTIONS } from '@/features/settings/constants/settings.constants';

interface SystemPrefsFieldsProps {
  moneda: string;
  formato_fecha: string;
  zona_horaria: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SystemPrefsFields({ moneda, formato_fecha, zona_horaria, onChange }: SystemPrefsFieldsProps) {
  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Settings className="w-4 h-4" /> Preferencias del sistema
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="prefs-moneda" className="text-sm font-medium">Moneda</label>
          <select id="prefs-moneda" name="moneda" value={moneda} onChange={onChange} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {CURRENCY_OPTIONS.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="prefs-fecha" className="text-sm font-medium">Formato de fecha</label>
          <select id="prefs-fecha" name="formato_fecha" value={formato_fecha} onChange={onChange} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {DATE_FORMAT_OPTIONS.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="prefs-zona" className="text-sm font-medium">Zona horaria</label>
          <select id="prefs-zona" name="zona_horaria" value={zona_horaria} onChange={onChange} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            {TIMEZONE_OPTIONS.filter(o => o.value).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
