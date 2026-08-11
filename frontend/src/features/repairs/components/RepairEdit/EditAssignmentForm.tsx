import React from 'react';
import { Input } from '@/shared/components/ui/input';
import type { FormData } from './RepairEdit.types';

interface EditAssignmentFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditAssignmentForm: React.FC<EditAssignmentFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Técnico Asignado</label>
        <Input
          value={formData.tecnico_asignado_id}
          onChange={(e) => setFormData({ ...formData, tecnico_asignado_id: e.target.value })}
          placeholder="Nombre del técnico"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Fecha Estimada de Entrega</label>
        <Input
          type="date"
          value={formData.fecha_estimada_entrega}
          onChange={(e) => setFormData({ ...formData, fecha_estimada_entrega: e.target.value })}
        />
      </div>
    </div>
  );
};
