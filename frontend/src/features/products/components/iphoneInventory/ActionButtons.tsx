import { Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ActionButtonsProps {
  isSaving: boolean;
  autoSaveTime: string;
  onSubmit: () => void;
  onNavigateInsurance: () => void;
}

export const ActionButtons = ({ isSaving, autoSaveTime, onSubmit, onNavigateInsurance }: ActionButtonsProps) => (
  <>
    <Button onClick={onSubmit} className="w-full" disabled={isSaving}>
      {isSaving ? 'Guardando...' : 'Agregar al inventario'}
    </Button>
    <Button onClick={onNavigateInsurance} variant="outline" className="w-full gap-2">
      <Shield size={16} />
      Agregar seguro
    </Button>
    <p className="text-center text-[10px] text-muted-foreground">Último auto-guardado a las {autoSaveTime}</p>
  </>
);
