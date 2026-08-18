import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Landmark, Wallet, RefreshCw, Plug } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { Integration } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import { getSectionMeta } from '../constants/settings.constants';
import { SectionHeader } from './ui/SectionHeader';
import { SettingsCard } from './ui/SettingsCard';

interface ApiSectionProps {
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
}

export const ApiSection: React.FC<ApiSectionProps> = ({ integrations, setIntegrations }) => {
  const meta = getSectionMeta('api');

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
    } catch {
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
      <SectionHeader
        icon={meta.icon}
        eyebrow={meta.eyebrow}
        title={meta.label}
        description={meta.description}
        actions={
          <Button variant="outline" size="sm" onClick={refreshIntegrations}>
            <RefreshCw size={14} /> Refrescar estado
          </Button>
        }
      />

      <SettingsCard title="APIs conectadas" description="Servicios de terceros vinculados a tu cuenta" icon={<Plug size={18} />}>
        {integrations.length === 0 ? (
          <EmptyState icon={Plug} title="No hay integraciones configuradas" className="py-8" />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex flex-col rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-5 transition-colors hover:border-primary/30">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                    {renderIcon(integration.nombre)}
                  </div>
                  <Badge variant={integration.conectado ? 'success' : 'secondary'}>
                    {integration.conectado ? 'Conectado' : 'No conectado'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground">{renderName(integration.nombre)}</h3>
                {integration.estado_real && (
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    Estado de sesión: {integration.estado_real}
                  </p>
                )}
                <p className="mb-6 mt-1 text-xs leading-relaxed text-muted-foreground">{integration.descripcion}</p>
                {integration.nombre === 'whatsapp' ? (
                  <Button asChild className="mt-auto w-full" size="sm">
                    <a href="/whatsapp">
                      {integration.conectado ? 'Gestionar sesión' : 'Conectar WhatsApp'}
                    </a>
                  </Button>
                ) : (
                  <Button
                    className="mt-auto w-full"
                    size="sm"
                    variant={integration.conectado ? 'outline' : 'default'}
                    onClick={() => toggleIntegration(integration)}
                  >
                    {integration.conectado ? 'Desconectar' : 'Conectar cuenta'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </SettingsCard>
    </div>
  );
};
export default ApiSection;