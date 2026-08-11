import React, { useState } from 'react';
import { Plus, Info, Send, Trash2 } from 'lucide-react';
import { BusinessInfoCard } from '@/features/business/BusinessInfoCard';
import { BusinessInfoForm } from '@/features/business/BusinessInfoForm';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { EMPTY_BUSINESS_INFO } from '../constants/settings.constants';
import { getEstadoConfig } from '@/config/estadosReparacion.config';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import type { PaymentMethod, RepairStateRequest } from '../types/settings.types';

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
    } catch (e) {
      toast({ title: 'Error', description: 'Error al enviar la solicitud', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePaymentMethod = async (method: PaymentMethod) => {
    try {
      const updated = await settingsApi.updatePaymentMethod(method.id, { activo: !method.activo });
      setPaymentMethods(prev => prev.map(m => (m.id === method.id ? updated : m)));
    } catch (e) {
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
    } catch (e) {
      toast({ title: 'Error', description: 'Error al agregar el método de pago', variant: 'destructive' });
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      await settingsApi.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
    } catch (e) {
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
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
            <p className="font-semibold">No se pudo cargar la información</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <div className="bg-primary/5 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
            <p className="font-semibold">Modo offline</p>
            <p className="text-sm mt-1">Puedes configurar la información del negocio manualmente. Los cambios se guardarán cuando tengas conexión.</p>
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          No hay información de la empresa configurada
        </div>
        <BusinessInfoForm businessInfo={EMPTY_BUSINESS_INFO as any} onSubmit={handleBusinessEdit} onCancel={() => setIsEditingBusiness(false)} loading={mutationLoading} />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {renderBusinessInfo()}

      <section className="bg-card  rounded-xl border border-border  overflow-hidden">
        <div className="p-6 border-b border-border  flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-foreground">Estados de reparación</h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Estados disponibles en el flujo de reparaciones</p>
          </div>
          <button onClick={() => setShowRequestForm(v => !v)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
            <Send size={14} /> Solicitar nuevo estado
          </button>
        </div>
        <div className="p-6">
          {showRequestForm && (
            <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-xl space-y-3">
              <p className="text-sm font-bold text-foreground">Solicitar un nuevo estado al desarrollador</p>
              <input
                aria-label="Nombre del estado"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
                placeholder="Nombre del estado (ej. Esperando repuesto del exterior)"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
              />
              <textarea
                aria-label="Motivo de la solicitud"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
                rows={3}
                placeholder="¿Por qué lo necesitás? (opcional)"
                value={newStateMessage}
                onChange={(e) => setNewStateMessage(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={submitStateRequest} disabled={submitting || !newStateName.trim()} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50">
                  {submitting ? 'Enviando...' : 'Enviar solicitud'}
                </button>
                <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 text-xs font-bold text-muted-foreground border border-border dark:border-border rounded-lg hover:bg-card  transition-all">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {stateRequests.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Solicitudes enviadas</p>
              <div className="space-y-2">
                {stateRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted dark:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-card  flex items-center justify-center shadow-sm">
                        <Send size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{req.estado_nombre}</p>
                        {req.mensaje && <p className="text-xs text-muted-foreground">{req.mensaje}</p>}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.estado === 'revisado' ? 'bg-green-50 dark:bg-green-900/20 text-success dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300'}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {repairStates.map((state) => {
                const config = getEstadoConfig(state);
                return (
                  <div key={state} className="flex items-center gap-3 p-3 bg-muted dark:bg-muted rounded-lg border border-border dark:border-border">
                    <div className="size-3 rounded-full" style={{ backgroundColor: config.color }} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{config.label}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{config.fase}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-card  rounded-xl border border-border  overflow-hidden">
        <div className="p-6 border-b border-border  flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-foreground">Métodos de pago aceptados</h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Activa las opciones de pago disponibles durante el checkout</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-muted dark:bg-muted rounded-xl">
              <div>
                <p className="font-bold">{method.nombre}</p>
                {method.descripcion && <p className="text-xs text-muted-foreground">{method.descripcion}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => deletePaymentMethod(method.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label={`Eliminar ${method.nombre}`}>
                  <Trash2 size={16} />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={method.activo} onChange={() => togglePaymentMethod(method)} />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          ))}
          {paymentMethods.length === 0 && (
            <EmptyState title="No hay métodos de pago configurados" className="!py-8" />
          )}
          <div className="p-4 border border-dashed border-border dark:border-border rounded-xl space-y-3">
            <input
              aria-label="Nombre del método de pago"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
              placeholder="Nombre del método de pago (ej. Mercado Pago)"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
            />
            <input
              aria-label="Descripción del método de pago"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
              placeholder="Descripción (opcional)"
              value={newMethodDesc}
              onChange={(e) => setNewMethodDesc(e.target.value)}
            />
            <button onClick={addPaymentMethod} disabled={!newMethodName.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
              <Plus size={14} /> Agregar método
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default BusinessSection;
