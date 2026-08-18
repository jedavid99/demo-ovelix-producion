import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import type { RepairCost, RepairCostForm, TaxRate } from '../../types/repairCosts.types';
import { CostFormFields } from './CostFormFields';

interface CostFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: RepairCost | null;
  categories: string[];
  taxRates: TaxRate[];
  submitting: boolean;
  onSubmit: (values: RepairCostForm) => Promise<void>;
}

export function CostFormDialog({
  open,
  onOpenChange,
  initial,
  categories,
  taxRates,
  submitting,
  onSubmit,
}: CostFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar costo de reparación' : 'Nuevo costo de reparación'}</DialogTitle>
          <DialogDescription>
            Definí la solución, el precio que pagás y los equipos que abarca. El precio al cliente se calcula al
            instante con tus porcentajes.
          </DialogDescription>
        </DialogHeader>

        <CostFormFields
          key={initial?.id ?? 'create'}
          initial={initial}
          categories={categories}
          taxRates={taxRates}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}