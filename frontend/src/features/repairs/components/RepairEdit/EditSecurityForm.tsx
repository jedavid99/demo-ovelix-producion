import React from 'react';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditSecurityFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditSecurityForm: React.FC<EditSecurityFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="editsec-tipo" className="block text-sm font-medium text-foreground mb-1">Tipo de Seguridad</label>
        <select
          id="editsec-tipo"
          value={formData.tipo_seguridad}
          onChange={(e) => setFormData({ ...formData, tipo_seguridad: e.target.value })}
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="none">Ninguno</option>
          <option value="pin">PIN / Contraseña</option>
          <option value="pattern">Patrón</option>
          <option value="fingerprint">Huella</option>
        </select>
      </div>

      {formData.tipo_seguridad === 'pin' && (
        <div>
          <label htmlFor="editsec-pin" className="block text-sm font-medium text-foreground mb-1">PIN / Contraseña</label>
          <Input
            id="editsec-pin"
            type="password"
            value={formData.pin_acceso}
            onChange={(e) => setFormData({ ...formData, pin_acceso: e.target.value })}
            placeholder="Ingrese el PIN o contraseña"
          />
        </div>
      )}

      {formData.tipo_seguridad === 'pattern' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="editsec-puntos" className="block text-sm font-medium text-foreground mb-1">Puntos del Patrón</label>
            <Textarea
              id="editsec-puntos"
              value={formData.patron_puntos}
              onChange={(e) => setFormData({ ...formData, patron_puntos: e.target.value })}
              placeholder="Separar por comas: 0,1,2,5,8..."
              rows={2}
            />
          </div>
          <div>
            <label htmlFor="editsec-secuencia" className="block text-sm font-medium text-foreground mb-1">Secuencia</label>
            <Textarea
              id="editsec-secuencia"
              value={formData.secuencia_patron}
              onChange={(e) => setFormData({ ...formData, secuencia_patron: e.target.value })}
              placeholder="Descripción de la secuencia"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};
