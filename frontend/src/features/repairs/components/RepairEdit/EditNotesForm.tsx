import React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditNotesFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditNotesForm: React.FC<EditNotesFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">Notas Adicionales</label>
      <Textarea
        value={formData.notas}
        onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
        placeholder="Notas adicionales sobre la reparación..."
        rows={4}
      />
    </div>
  );
};
