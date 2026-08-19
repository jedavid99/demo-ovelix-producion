import React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditStatusFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditStatusForm: React.FC<EditStatusFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Problema Reportado</label>
        <Textarea
          value={formData.problema_reportado}
          onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
          placeholder="Descripción del problema reportado por el cliente"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Diagnóstico</label>
        <Textarea
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          placeholder="Diagnóstico técnico del equipo"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Reparación Realizada</label>
        <Textarea
          value={formData.reparacion_realizada}
          onChange={(e) => setFormData({ ...formData, reparacion_realizada: e.target.value })}
          placeholder="Descripción de la reparación realizada"
          rows={3}
        />
      </div>
    </div>
  );
};