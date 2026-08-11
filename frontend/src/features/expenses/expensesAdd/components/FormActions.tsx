import { Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

export function FormActions({ isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-border">
      <Button variant="outline" onClick={onCancel} size="sm">Cancelar</Button>
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? <span className="animate-spin mr-2">⟳</span> : <Save size={16} className="mr-2" />}
        {isLoading ? 'Guardando...' : 'Guardar gasto'}
      </Button>
    </div>
  );
}
