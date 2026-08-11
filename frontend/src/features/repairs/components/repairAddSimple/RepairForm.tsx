import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import type { UseFormReturn } from 'react-hook-form';
import type { RepairCreateFormData } from '@/validations/repair.validation';

interface RepairFormProps {
  form: UseFormReturn<RepairCreateFormData>;
  submitting: boolean;
  onSubmit: (data: RepairCreateFormData) => void;
  onCancel: () => void;
}

export const RepairForm = ({ form, submitting, onSubmit, onCancel }: RepairFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Datos de la reparación</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dispositivo">Dispositivo *</Label>
              <Input id="dispositivo" {...register('dispositivo')} placeholder="ej. iPhone 13, Samsung Galaxy..." />
              {errors.dispositivo && <p className="text-sm text-destructive">{errors.dispositivo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" {...register('marca')} placeholder="ej. Apple, Samsung..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" {...register('modelo')} placeholder="ej. A2633, S21..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <select id="prioridad" {...register('prioridad')}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option><option value="critical">Urgente</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
              <Input id="fecha_ingreso" type="date" {...register('fecha_ingreso')} />
              {errors.fecha_ingreso && <p className="text-sm text-destructive">{errors.fecha_ingreso.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tecnico_asignado_id">Técnico asignado</Label>
              <Input id="tecnico_asignado_id" {...register('tecnico_asignado_id')} placeholder="ID del técnico (opcional)" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="problema_reportado">Problema reportado *</Label>
            <textarea id="problema_reportado" {...register('problema_reportado')} placeholder="Describe el problema del dispositivo..." rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            {errors.problema_reportado && <p className="text-sm text-destructive">{errors.problema_reportado.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <textarea id="diagnosis" {...register('diagnosis')} placeholder="Diagnosis técnica del problema..." rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <textarea id="notas" {...register('notas')} placeholder="Notas adicionales sobre la reparación..." rows={2}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            {errors.notas && <p className="text-sm text-destructive">{errors.notas.message}</p>}
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting || isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={submitting || isSubmitting}>
              {submitting || isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar reparación'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
