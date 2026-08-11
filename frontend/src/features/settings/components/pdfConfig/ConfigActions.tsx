import { RefreshCw, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ConfigActionsProps {
  onReset: () => void;
  onSave: () => void;
}

export const ConfigActions = ({ onReset, onSave }: ConfigActionsProps) => (
  <div className="flex flex-col gap-3">
    <Button onClick={onReset} variant="outline" className="w-full"><RefreshCw size={16} className="mr-2" /> Restablecer</Button>
    <Button onClick={onSave} className="w-full"><Save size={16} className="mr-2" /> Guardar configuración</Button>
  </div>
);
