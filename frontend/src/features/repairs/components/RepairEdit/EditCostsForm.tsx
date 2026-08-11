import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { formatCurrency } from './RepairEdit.types';
import type { FormData } from './RepairEdit.types';

interface EditCostsFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditCostsForm: React.FC<EditCostsFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Mano de Obra</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={formData.costo_mano_obra}
              onChange={(e) => setFormData({ ...formData, costo_mano_obra: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              min={0}
              step={0.01}
              className="pl-7"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Piezas</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={formData.costo_piezas}
              disabled
              className="pl-7 bg-muted"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Total</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={formData.total_reparacion}
              onChange={(e) => setFormData({ ...formData, total_reparacion: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              min={0}
              step={0.01}
              className="pl-7 font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total a cobrar</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(formData.total_reparacion)}
          </p>
        </div>
      </div>
    </div>
  );
};
