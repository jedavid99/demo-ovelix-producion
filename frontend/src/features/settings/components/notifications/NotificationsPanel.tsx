import { AlertTriangle, BellOff } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';
import { iconMap } from '../../constants/notifications/notifications.constants';
import type { NotificationItem, NotificationFilter } from '../../types/notifications/notifications.types';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  filter: NotificationFilter;
  onFilterChange: (f: NotificationFilter) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAll: () => void;
}

export const NotificationsPanel = ({ notifications, filter, onFilterChange, onMarkAsRead, onMarkAll }: NotificationsPanelProps) => (
  <Card>
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-foreground">Notificaciones</h3>
        <Button variant="ghost" size="sm" onClick={onMarkAll}>Marcar todas</Button>
      </div>
      <div className="flex gap-2">
        {(['all', 'unread', 'urgent', 'system'] as const).map((f) => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm"
            onClick={() => onFilterChange(f)} className="text-xs">
            {f === 'all' ? 'Todos' : f === 'unread' ? 'No leídas' : f === 'urgent' ? 'Urgentes' : 'Sistema'}
          </Button>
        ))}
      </div>
    </div>
    <div className="overflow-y-auto max-h-[calc(100vh-20rem)] p-3 space-y-3">
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellOff size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-medium text-foreground">No hay notificaciones</p>
          <p className="text-sm text-muted-foreground">Las alertas del sistema aparecerán aquí</p>
        </div>
      ) : notifications.map(n => {
        const IconComponent = iconMap[n.icon] || AlertTriangle;
        return (
          <div key={n.id} onClick={() => onMarkAsRead(n.id)}
            className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-sm ${
              n.type === 'urgent' ? 'border-l-red-500 bg-destructive/10/50 dark:bg-red-900/10' :
              n.type === 'system' ? 'border-l-blue-500' :
              n.type === 'sale' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' :
              'border-l-muted-foreground'
            } ${!n.read ? 'bg-card' : 'bg-muted/50 opacity-75'}`}>
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                n.type === 'urgent' ? 'bg-red-100 dark:bg-red-900/20' :
                n.type === 'system' ? 'bg-primary/10 dark:bg-blue-900/20' :
                n.type === 'sale' ? 'bg-green-100 dark:bg-green-900/20' :
                'bg-muted'
              }`}>
                <IconComponent size={16} className={
                  n.type === 'urgent' ? 'text-destructive dark:text-destructive' :
                  n.type === 'system' ? 'text-primary dark:text-blue-400' :
                  n.type === 'sale' ? 'text-success dark:text-green-400' :
                  'text-muted-foreground'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-sm font-medium text-foreground truncate">{n.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{n.message}</p>
                <Button variant={n.type === 'urgent' ? 'destructive' : n.type === 'sale' ? 'default' : 'outline'} size="sm"
                  onClick={(e) => { e.stopPropagation(); toast({ title: n.action, description: 'Acción de notificación (demo)' }); }} className="text-xs">
                  {n.action}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);
