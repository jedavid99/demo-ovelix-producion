import React from 'react';
import { Ticket, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import type { NotificationPreference } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';
import { Switch } from '@/shared/components/ui/switch';
import { getSectionMeta } from '../constants/settings.constants';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SettingsCard } from '../components/ui/SettingsCard';

interface NotificationsSectionProps {
  notificationPrefs: NotificationPreference[];
  setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPreference[]>>;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notificationPrefs, setNotificationPrefs }) => {
  const meta = getSectionMeta('notificationes');
  const eventIcons = [Ticket, CheckCircle2, AlertCircle];
  const colorClasses: Record<string, string> = {
    blue: 'bg-primary/10 text-blue-500',
    green: 'bg-green-500/10 text-success',
    amber: 'bg-amber-500/10 text-amber-500',
  };

  const togglePref = async (pref: NotificationPreference) => {
    try {
      const updated = await settingsApi.updateNotificationPreference(pref.id, !pref.activo);
      setNotificationPrefs(prev => prev.map(p => (p.id === pref.id ? updated : p)));
    } catch {
      toast({ title: 'Error', description: 'Error al actualizar la preferencia', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader icon={meta.icon} eyebrow={meta.eyebrow} title={meta.label} description={meta.description} />
      <SettingsCard
        title="Notificaciones de eventos"
        description="Activa o desactiva los eventos que generan alertas"
        icon={<Bell size={18} />}
      >
        {notificationPrefs.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No hay notificaciones configuradas</p>
        ) : (
          <div className="space-y-2.5">
            {notificationPrefs.map((pref, idx) => {
              const IconComp = eventIcons[idx] || Bell;
              return (
                <div
                  key={pref.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 dark:bg-muted/20 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${colorClasses[['blue', 'green', 'amber'][idx]] || 'bg-muted text-muted-foreground'}`}>
                      <IconComp size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{pref.titulo}</p>
                      {pref.descripcion && <p className="text-xs text-muted-foreground">{pref.descripcion}</p>}
                    </div>
                  </div>
                  <Switch checked={pref.activo} onCheckedChange={() => togglePref(pref)} aria-label={`Activar ${pref.titulo}`} />
                </div>
              );
            })}
          </div>
        )}
      </SettingsCard>
    </div>
  );
};
export default NotificationsSection;