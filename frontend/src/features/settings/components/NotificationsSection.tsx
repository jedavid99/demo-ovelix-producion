import React from 'react';
import { Ticket, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import type { NotificationPreference } from '../types/settings.types';
import { settingsApi } from '../services/settingsApi';
import { toast } from '@/shared/components/ui/use-toast';

interface NotificationsSectionProps {
  notificationPrefs: NotificationPreference[];
  setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPreference[]>>;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notificationPrefs, setNotificationPrefs }) => {
  const eventIcons = [Ticket, CheckCircle2, AlertCircle];
  const colorClasses: Record<string, string> = {
    blue: 'bg-primary/5 dark:bg-blue-900/20 text-blue-500',
    green: 'bg-green-50 dark:bg-green-900/20 text-success',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500',
  };

  const togglePref = async (pref: NotificationPreference) => {
    try {
      const updated = await settingsApi.updateNotificationPreference(pref.id, !pref.activo);
      setNotificationPrefs(prev => prev.map(p => (p.id === pref.id ? updated : p)));
    } catch (e) {
      toast({ title: 'Error', description: 'Error al actualizar la preferencia', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-card  rounded-xl border border-border  overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border  flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bell className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Notificaciones de eventos</h2>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Activa o desactiva los eventos que generan alertas</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="bg-muted dark:bg-muted/50 border-b border-border ">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Activo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border ">
              {notificationPrefs.map((pref, idx) => {
                const IconComp = eventIcons[idx] || Bell;
                return (
                  <tr key={pref.id}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`size-8 ${colorClasses[['blue', 'green', 'amber'][idx]] || 'bg-muted dark:bg-muted text-muted-foreground'} rounded flex items-center justify-center`}>
                          <IconComp size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{pref.titulo}</p>
                          {pref.descripcion && <p className="text-xs text-muted-foreground dark:text-muted-foreground">{pref.descripcion}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={pref.activo} onChange={() => togglePref(pref)} />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </td>
                  </tr>
                );
              })}
              {notificationPrefs.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                    <p className="font-medium">No hay notificaciones configuradas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default NotificationsSection;
