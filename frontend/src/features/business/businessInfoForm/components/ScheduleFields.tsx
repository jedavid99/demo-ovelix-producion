import { Clock } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

const DAYS = [
  { day: 'Lunes', field: 'lunes' },
  { day: 'Martes', field: 'martes' },
  { day: 'Miércoles', field: 'miercoles' },
  { day: 'Jueves', field: 'jueves' },
  { day: 'Viernes', field: 'viernes' },
  { day: 'Sábado', field: 'sabado' },
  { day: 'Domingo', field: 'domingo' },
];

interface ScheduleFieldsProps {
  horarios: Record<string, string | undefined>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScheduleFields({ horarios, onChange }: ScheduleFieldsProps) {
  return (
    <div className="bg-card  rounded-xl border border-border  p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground dark:text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-4 h-4" /> Horarios de Atención
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DAYS.map(({ day, field }) => (
          <div key={field} className="space-y-2">
            <label htmlFor={`horarios-${field}`} className="text-sm font-medium">{day}</label>
            <Input
              id={`horarios-${field}`}
              type="text"
              name={`horarios.${field}`}
              value={horarios?.[field] || ''}
              onChange={onChange}
              placeholder="09:00-18:00 o Cerrado"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
