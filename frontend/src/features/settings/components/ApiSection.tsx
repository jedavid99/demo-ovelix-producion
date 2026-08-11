import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Landmark, Wallet, RefreshCw, Plug } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import type { Integration } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';

interface ApiSectionProps {
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
}

export const ApiSection: React.FC<ApiSectionProps> = ({ integrations, setIntegrations }) => {
  const toggleIntegration = async (integration: Integration) => {
    try {
      const updated = await settingsApi.updateIntegration(integration.id, !integration.conectado);
      setIntegrations(prev => prev.map(i => (i.id === integration.id ? updated : i)));
      toast({ title: 'Éxito', description: 'Integración actualizada correctamente' });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.response?.data?.message || 'Error al actualizar la integración', variant: 'destructive' });
    }
  };

  const refreshIntegrations = async () => {
    try {
      const data = await settingsApi.getIntegrations();
      setIntegrations(data);
      toast({ title: 'Éxito', description: 'Estado de las integraciones actualizado' });
    } catch (e) {
      toast({ title: 'Error', description: 'Error al refrescar las integraciones', variant: 'destructive' });
    }
  };

  const renderIcon = (nombre: string) => {
    if (nombre === 'whatsapp') return <FaWhatsapp size={24} className="text-success" />;
    if (nombre === 'arca') return <Landmark size={24} className="text-primary" />;
    if (nombre === 'mobbex') return <Wallet size={24} className="text-purple-600" />;
    return null;
  };

  const renderName = (nombre: string) => {
    if (nombre === 'whatsapp') return 'WhatsApp';
    if (nombre === 'arca') return 'ARCA';
    if (nombre === 'mobbex') return 'Mobbex';
    return nombre;
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API e integraciones</h1>
          <p className="text-muted-foreground dark:text-muted-foreground mt-1">Estado de las APIs conectadas a tu cuenta</p>
        </div>
        <button onClick={refreshIntegrations} className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground border border-border rounded-lg text-sm font-bold hover:bg-muted  transition-all">
          <RefreshCw size={16} /> Refrescar estado
        </button>
      </div>

      <div className="bg-card  rounded-xl border border-border  overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border ">
          <h2 className="text-lg font-bold text-foreground">APIs conectadas</h2>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Servicios de terceros vinculados a tu cuenta</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex flex-col p-5 border border-border  rounded-xl bg-muted dark:bg-muted/30 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="size-12 bg-card dark:bg-muted rounded-xl flex items-center justify-center shadow-sm border border-border dark:border-border">
                  {renderIcon(integration.nombre)}
                </div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${integration.conectado ? 'bg-green-50 dark:bg-green-900/20 text-success dark:text-green-300' : 'bg-muted  text-muted-foreground'}`}>
                  {integration.conectado ? 'Conectado' : 'No conectado'}
                </span>
              </div>
              <h3 className="font-bold text-foreground">{renderName(integration.nombre)}</h3>
              {integration.estado_real && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Estado de sesión: {integration.estado_real}</p>
              )}
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 mb-6 leading-relaxed">{integration.descripcion}</p>
              {integration.nombre === 'whatsapp' ? (
                <a
                  href="/whatsapp"
                  className="mt-auto w-full py-2 text-center bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
                >
                  {integration.conectado ? 'Gestionar sesión' : 'Conectar WhatsApp'}
                </a>
              ) : (
                <button
                  onClick={() => toggleIntegration(integration)}
                  className={`mt-auto w-full py-2 rounded-lg text-xs font-bold transition-all ${integration.conectado ? 'bg-destructive/10 dark:bg-red-900/20 text-destructive dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-muted dark:bg-muted text-foreground  border border-border dark:border-border hover:bg-muted '}`}
                >
                  {integration.conectado ? 'Desconectar' : 'Conectar cuenta'}
                </button>
              )}
            </div>
          ))}
          {integrations.length === 0 && (
            <EmptyState
              icon={Plug}
              title="No hay integraciones configuradas"
              className="py-8"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ApiSection;
