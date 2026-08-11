import { Settings, Plus, X } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { FormSection } from './FormSection';
import { QUICK_DEVICES } from '../constants';

interface CompatibilitySectionProps {
  compatibility: string[];
  compatibilityInput: string;
  onInputChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onAdd: (device: string) => void;
  onRemove: (device: string) => void;
}

export function CompatibilitySection({
  compatibility, compatibilityInput, onInputChange,
  onKeyPress, onAdd, onRemove,
}: CompatibilitySectionProps) {
  return (
    <FormSection icon={<Settings size={18} className="text-primary" />} title="Compatibilidad" index={3} className="p-4 space-y-3">
      <p className="text-xs text-muted-foreground">Agrega los dispositivos compatibles con este repuesto:</p>
      <div className="flex flex-wrap gap-1.5 p-3 border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[48px] items-center">
        {compatibility.map(device => (
          <Badge key={device} variant="secondary" className="px-2.5 py-1 text-xs font-medium flex items-center gap-1">
            {device}
            <button type="button" onClick={() => onRemove(device)} className="hover:text-destructive transition-colors"><X size={12} /></button>
          </Badge>
        ))}
        <div className="flex items-center ml-1">
          <input
            value={compatibilityInput}
            onChange={e => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            className="bg-transparent border-none focus:ring-0 text-xs placeholder:text-muted-foreground p-1 outline-none min-w-[100px]"
            placeholder="Escribe y Enter..."
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_DEVICES.filter(d => !compatibility.includes(d)).map(device => (
          <Button key={device} type="button" variant="outline" size="sm" onClick={() => onAdd(device)} className="h-7 text-[10px] px-2.5">
            <Plus size={12} className="mr-1" />{device}
          </Button>
        ))}
      </div>
    </FormSection>
  );
}
