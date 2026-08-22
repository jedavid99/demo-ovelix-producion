import { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { CURRENCY_OPTIONS, DATE_FORMAT_OPTIONS, TIMEZONE_OPTIONS } from '@/features/settings/constants/settings.constants';

interface SystemPrefsFieldsProps {
  moneda: string;
  formato_fecha: string;
  zona_horaria: string;
  hora_cierre_caja?: string;
  margen_porcentaje?: number[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMargenChange?: (value: number[]) => void;
}

export function SystemPrefsFields({ moneda, formato_fecha, zona_horaria, hora_cierre_caja = '18:00', margen_porcentaje = [10, 20, 30, 50], onChange, onInputChange, onMargenChange }: SystemPrefsFieldsProps) {
  const [nuevoMargen, setNuevoMargen] = useState('');

  const addMargen = () => {
    const val = parseFloat(nuevoMargen);
    if (!isNaN(val) && val >= 0 && val <= 1000 && !margen_porcentaje.includes(val)) {
      const sorted = [...margen_porcentaje, val].sort((a, b) => a - b);
      onMargenChange?.(sorted);
      setNuevoMargen('');
    }
  };

  const removeMargen = (val: number) => {
    onMargenChange?.(margen_porcentaje.filter(v => v !== val));
  };

  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Settings className="w-4 h-4" /> Preferencias del sistema
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="space-y-2">
          <label htmlFor="prefs-hora-cierre" className="text-sm font-medium">Hora cierre caja</label>
          <input
            id="prefs-hora-cierre"
            type="time"
            name="hora_cierre_caja"
            value={hora_cierre_caja}
            onChange={onInputChange}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Márgenes de ganancia disponibles (%)</label>
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-dashed border-border bg-muted/30 min-h-[40px] items-center">
            {margen_porcentaje.map(val => (
              <Badge key={val} variant="secondary" className="px-2.5 py-1 text-xs font-medium flex items-center gap-1">
                {val}%
                <button type="button" onClick={() => removeMargen(val)} className="hover:text-destructive transition-colors">
                  <X size={12} />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-1 ml-1">
              <input
                type="number"
                min={0}
                max={1000}
                value={nuevoMargen}
                onChange={e => setNuevoMargen(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMargen(); } }}
                placeholder="Nuevo"
                className="bg-transparent border-none focus:ring-0 text-xs placeholder:text-muted-foreground p-1 outline-none w-14"
              />
              <Button type="button" variant="ghost" size="icon-sm" className="h-6 w-6" onClick={addMargen}>
                <Plus size={12} />
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">El usuario seleccionará uno de estos porcentajes al agregar un producto.</p>
        </div>
      </div>
    </div>
  );
}
