import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface RecordsActionsProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
}

export function RecordsActions({ currentStep, onBack, onNext }: RecordsActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-6 border-t border-border">
      <Button onClick={onBack} variant="outline">
        Atrás
      </Button>
      <Button onClick={onNext} disabled={currentStep === 4} size="lg">
        <span>{currentStep === 4 ? 'Finalizar Venta y Activar Seguro' : 'Siguiente Paso'}</span>
        <ArrowRight size={20} className="ml-2" />
      </Button>
    </div>
  );
}
