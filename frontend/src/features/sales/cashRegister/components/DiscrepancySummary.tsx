import { MdWarning, MdCheckCircle } from 'react-icons/md';
import { Lock, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

interface DiscrepancySummaryProps {
  discrepancy: number;
  hasDiscrepancy: boolean;
  onSaveProgress: () => void;
  onFinalize: () => void;
}

export function DiscrepancySummary({ discrepancy, hasDiscrepancy, onSaveProgress, onFinalize }: DiscrepancySummaryProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Diferencia</span>
            <div className="flex items-center gap-2">
              {hasDiscrepancy ? (
                <>
                  <MdWarning size={24} className="text-destructive" />
                  <span className="text-3xl font-bold text-destructive">${discrepancy.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <MdCheckCircle size={24} className="text-success" />
                  <span className="text-3xl font-bold text-success">${discrepancy.toFixed(2)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Button onClick={onSaveProgress} variant="outline" size="lg" className="w-full sm:w-auto">
            <Save size={18} className="mr-2" />
            Guardar progreso
          </Button>
          <Button onClick={onFinalize} size="lg" className="w-full sm:w-auto">
            <Lock size={18} className="mr-2" />
            Finalizar y cerrar día
          </Button>
        </div>
      </div>
    </Card>
  );
}
