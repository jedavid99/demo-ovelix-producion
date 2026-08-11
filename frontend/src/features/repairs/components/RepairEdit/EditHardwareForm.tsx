import React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditHardwareFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditHardwareForm: React.FC<EditHardwareFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        Estado del Hardware
      </label>
      <Textarea
        value={formData.chequeo_hardware}
        onChange={(e) => setFormData({ ...formData, chequeo_hardware: e.target.value })}
        placeholder='{"pantalla": true, "bateria": false, "wifi": true}'
        rows={4}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Formato JSON con el estado de cada componente del hardware
      </p>
    </div>
  );
};
