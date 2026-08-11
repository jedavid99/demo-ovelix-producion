import React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import { ESTADOS_KEYS, getEstadoConfig } from '@/config/estadosReparacion.config';
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
        <label className="block text-sm font-medium text-foreground mb-2">Estado actual</label>
        <div className="flex flex-wrap gap-2">
          {ESTADOS_KEYS.map((key) => {
            const config = getEstadoConfig(key);
            const isActive = formData.estado === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, estado: key })}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  backgroundColor: isActive ? config.color : 'transparent',
                  color: isActive ? '#fff' : config.color,
                  borderColor: config.color,
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

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
