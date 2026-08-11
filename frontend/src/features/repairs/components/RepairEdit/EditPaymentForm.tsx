import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import type { FormData } from './RepairEdit.types';
import { formatCurrency } from './RepairEdit.types';

const METODO_PAGO_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito' },
  { value: 'cuotas', label: 'Cuotas' },
];

interface EditPaymentFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditPaymentForm: React.FC<EditPaymentFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleTogglePagado = () => {
    setFormData((prev) => {
      const nuevoPagado = !prev.pagado;
      return {
        ...prev,
        pagado: nuevoPagado,
        monto_pagado: nuevoPagado ? prev.total_reparacion : 0,
      };
    });
  };

  const handleMontoPagadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({
      ...prev,
      monto_pagado: isNaN(value) ? 0 : value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Estado de pago</span>
          <Badge
            variant={formData.pagado ? 'success' : 'destructive'}
            className="text-xs"
          >
            {formData.pagado ? 'Pagado' : 'Pendiente'}
          </Badge>
        </div>
        <button
          type="button"
          onClick={handleTogglePagado}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            formData.pagado ? 'bg-success' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
              formData.pagado ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Método de Pago
        </label>
        <select
          value={formData.metodo_pago}
          onChange={(e) =>
            setFormData({ ...formData, metodo_pago: e.target.value })
          }
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Seleccionar método</option>
          {METODO_PAGO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">Total de la reparación</p>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(formData.total_reparacion)}
          </p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <label htmlFor="montoPagado" className="text-xs text-muted-foreground">
            Monto pagado
          </label>
          <Input
            id="montoPagado"
            type="number"
            step="0.01"
            min="0"
            value={formData.monto_pagado || 0}
            onChange={handleMontoPagadoChange}
            className="mt-1 h-8 text-lg font-bold bg-transparent border-0 p-0 focus-visible:ring-0"
            disabled={!formData.pagado}
          />
        </div>
      </div>
    </div>
  );
};
