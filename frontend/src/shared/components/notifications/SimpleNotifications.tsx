import React from 'react'
import { Bell, X, Check } from 'lucide-react'
export interface SimpleNotification {
  id: number
  title: string
  description: string
  time: string
  icon: string
  read: boolean
}
interface SimpleNotificationsProps {
  notifications: SimpleNotification[]
  onRead: (id: number) => void
  onDelete: (id: number) => void
  onMarkAllRead: () => void
  unreadCount: number
}
export const SimpleNotifications: React.FC<SimpleNotificationsProps> = ({
  notifications,
  onRead,
  onDelete,
  onMarkAllRead,
  unreadCount
}) => {
  return (
    <div className="w-full sm:w-[400px] max-h-[70vh] flex flex-col bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
      {/* Cabecera con gradiente sutil */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={18} className="text-primary" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            )}
          </div>
          <h4 className="font-semibold text-foreground tracking-tight">Notificaciones</h4>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-sm shadow-primary/20">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Check size={13} />
            Marcar todas
          </button>
        )}
      </div>
      {/* Lista con scroll personalizado */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/20 scrollbar-track-transparent hover:scrollbar-thumb-border/40">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
              <Bell size={28} className="text-muted-foreground/60" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">No tienes notificaciones</p>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Te avisaremos cuando haya novedades importantes
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative group p-4 rounded-xl border transition-all duration-200 cursor-pointer
                  ${notification.read 
                    ? 'bg-muted/20 border-border/30 hover:bg-muted/30 hover:border-border/50' 
                    : 'bg-gradient-to-br from-card to-card/50 border-primary/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
                  }`}
                onClick={() => !notification.read && onRead(notification.id)}
              >
                {/* Indicador de no leído con animación */}
                {!notification.read && (
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  {/* Icono con fondo gradiente */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {notification.icon}
                  </div>
                  {/* Contenido */}
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className={`text-sm font-semibold mb-1.5 leading-snug ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </h4>
                    {notification.description && (
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
                        {notification.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full ${notification.read ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  {/* Botón eliminar con hover mejorado */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(notification.id)
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-destructive/10 rounded-lg hover:scale-110"
                    title="Eliminar notificación"
                  >
                    <X size={14} className="text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Pie con borde sutil */}
      <div className="p-3 border-t border-border/50 bg-muted/20 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Sistema activo
          </span>
          <span>{notifications.length} total</span>
        </div>
      </div>
    </div>
  )
}
