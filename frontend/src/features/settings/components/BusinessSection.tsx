import React, { useState } from 'react';
import { Plus, Send, Trash2, Wrench, CreditCard } from 'lucide-react';
import { BusinessInfoCard } from '@/features/business/BusinessInfoCard';
import { BusinessInfoForm } from '@/features/business/BusinessInfoForm';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { EMPTY_BUSINESS_INFO } from '../constants/settings.constants';
import { getSectionMeta } from '../constants/settings.constants';
import { getEstadoConfig } from '@/config/estadosReparacion.config';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import type { PaymentMethod, RepairStateRequest } from '../types/settings.types';
import { SectionHeader } from './ui/SectionHeader';
import { SettingsCard } from './ui/SettingsCard';
import { Field } from './ui/Field';
import { SettingsRow } from './ui/SettingsRow';

interface BusinessSectionProps {
  loading: boolean;
  error: string | null;
  businessInfo: any;
  isEditingBusiness: boolean;
  setIsEditingBusiness: (v: boolean) => void;
  mutationLoading: boolean;
  handleBusinessEdit: (data: any) => void;
  repairStates: string[];
  stateRequests: RepairStateRequest[];
  setStateRequests: React.Dispatch<React.SetStateAction<RepairStateRequest[]>>;
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({
  loading, error, businessInfo, isEditingBusiness, setIsEditingBusiness,
  mutationLoading, handleBusinessEdit,
  repairStates, stateRequests, setStateRequests, paymentMethods, setPaymentMethods,
}) => {
  const meta = getSectionMeta('business');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newStateName, setNewStateName] = useState('');
  const [newStateMessage, setNewStateMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodDesc, setNewMethodDesc] = useState('');

  const submitStateRequest = async () => {
    if (!newStateName.trim()) return;
    setSubmitting(true);
    try {
      const created = await settingsApi.createRepairStateRequest({
        estado_nombre: newStateName.trim(),
        mensaje: newStateMessage.trim() || undefined,
      });
      setStateRequests(prev => [created, ...prev]);
      setNewStateName('');
      setNewStateMessage('');
      setShowRequestForm(false);
      toast({ title: 'Éxito', description: 'Solicitud enviada al desarrollador correctamente' });
    } catch {
      toast({ title: 'Error', description: 'Error al enviar la solicitud', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePaymentMethod = async (method: PaymentMethod) => {
    try {
      const updated = await settingsApi.updatePaymentMethod(method.id, { activo: !method.activo });
      setPaymentMethods(prev => prev.map(m => (m.id === method.id ? updated : m)));
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar el método de pago', variant: 'destructive' });
    }
  };

  const addPaymentMethod = async () => {
    if (!newMethodName.trim()) return;
    try {
      const created = await settingsApi.createPaymentMethod({
        nombre: newMethodName.trim(),
        descripcion: newMethodDesc.trim() || undefined,
      });
      setPaymentMethods(prev => [...prev, created]);
      setNewMethodName('');
      setNewMethodDesc('');
    } catch {
      toast({ title: 'Error', description: 'Error al agregar el método de pago', variant: 'destructive' });
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await settingsApi.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
    } catch {
      toast({ title: 'Error', description: 'Error al eliminar el método de pago', variant: 'destructive' });
    }
  };

  const renderBusinessInfo = () => {
    if (loading) {
      return <LoadingState label="Cargando información de la empresa..." className="!py-16" />;
    }
    if (error) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            <p className="font-semibold">No se pudo cargar la información</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
          <BusinessInfoForm businessInfo={EMPTY_BUSINESS_INFO as any} onSubmit={handleBusinessEdit} onCancel={() => setIsEditingBusiness(false)} loading={mutationLoading} />
        </div>
      );
    }
    if (businessInfo) {
      return isEditingBusiness ? (
        <BusinessInfoForm businessInfo={businessInfo} onSubmit={handleBusinessEdit} onCancel={() => setIsEditingBusiness(false)} loading={mutationLoading} />
      ) : (
        <BusinessInfoCard businessInfo={businessInfo} onEdit={() => setIsEditingBusiness(true)} />
      );
    }
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-300/40 bg-amber-50 px-4 py-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          No hay información de la empresa configurada
        </div>
        <BusinessInfoForm businessInfo={EMPTY_BUSINESS_INFO as any} onSubmit={handleBusinessEdit} onCancel={() => setIsEditingBusiness(false)} loading={mutationLoading} />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.label} description={meta.description} />

      {renderBusinessInfo()}

      <SettingsCard
        title="Estados de reparación"
        description="Estados disponibles en el flujo de reparaciones"
        icon={<Wrench size={18} />}
        actions={
          <Button variant="secondary" size="sm" onClick={() => setShowRequestForm(v => !v)}>
            <Send size={14} /> Solicitar nuevo estado
          </Button>
        }
      >
        {showRequestForm && (
          <div className="mb-6 space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">
              Solicitar un nuevo estado al desarrollador
            </p>
            <Field label="Nombre del estado" htmlFor="nuevo-estado">
              <Input
                id="nuevo-estado"
                placeholder="Ej. Esperando repuesto del exterior"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
              />
            </Field>
            <Field label="¿Por qué lo necesitás? (opcional)" htmlFor="nuevo-estado-motivo">
              <textarea
                id="nuevo-estado-motivo"
                rows={3}
                className="w-full rounded border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 focus:outline-none"
                placeholder="Contanos qué estado te falta"
                value={newStateMessage}
                onChange={(e) => setNewStateMessage(e.target.value)}
              />
            </Field>
            <div className="flex gap-2">
              <Button size="sm" onClick={submitStateRequest} disabled={submitting || !newStateName.trim()}>
                {submitting ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {stateRequests.length > 0 && (
          <div className="mb-6">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Solicitudes enviadas
            </p>
            <div className="space-y-2">
              {stateRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 dark:bg-muted/20 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-card shadow-sm">
                      <Send size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{req.estado_nombre}</p>
                      {req.mensaje && <p className="truncate text-xs text-muted-foreground">{req.mensaje}</p>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${req.estado === 'revisado' ? 'bg-green-500/10 text-success' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                    {req.estado === 'revisado' ? 'Revisado' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {repairStates.length === 0 ? (
          <EmptyState title="No hay estados disponibles" className="!py-8" />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {repairStates.map((state) => {
              const config = getEstadoConfig(state);
              return (
                <div key={state} className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 dark:bg-muted/20 p-3">
                  <div className="size-3 shrink-0 rounded-full" style={{ backgroundColor: config.color }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{config.label}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{config.fase}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Métodos de pago aceptados"
        description="Activá las opciones de pago disponibles durante el checkout"
        icon={<CreditCard size={18} />}
      >
        <div className="space-y-2.5">
          {paymentMethods.map((method) => (
            <SettingsRow
              key={method.id}
              left={
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{method.nombre}</p>
                  {method.descripcion && <p className="text-xs text-muted-foreground">{method.descripcion}</p>}
                </div>
              }
              right={
                <>
                  <Button variant="ghost" size="icon-sm" onClick={() => deletePaymentMethod(method.id)} aria-label={`Eliminar ${method.nombre}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                  <Switch checked={method.activo} onCheckedChange={() => togglePaymentMethod(method)} aria-label={`Activar ${method.nombre}`} />
                </>
              }
            />
          ))}
          {paymentMethods.length === 0 && (
            <EmptyState title="No hay métodos de pago configurados" className="!py-8" />
          )}
        </div>

        <div className="mt-4 space-y-3 rounded-xl border border-dashed border-border p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Nombre" htmlFor="metodo-nombre">
              <Input
                id="metodo-nombre"
                placeholder="Ej. Mercado Pago"
                value={newMethodName}
                onChange={(e) => setNewMethodName(e.target.value)}
              />
            </Field>
            <Field label="Descripción (opcional)" htmlFor="metodo-desc">
              <Input
                id="metodo-desc"
                placeholder="Ej. Efectivo o transferencia"
                value={newMethodDesc}
                onChange={(e) => setNewMethodDesc(e.target.value)}
              />
            </Field>
          </div>
          <Button onClick={addPaymentMethod} disabled={!newMethodName.trim()}>
            <Plus size={16} /> Agregar método
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
};
export default BusinessSection;