import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, User, ChevronDown, ArrowRightToLine, LogOut, Camera, MessageSquare, Package, Wrench, ShoppingCart, Calendar, ClipboardList } from 'lucide-react'
import { MdSearch, MdSettings, MdBarChart, MdInventory2, MdAttachMoney, MdReceipt, MdLocalShipping } from 'react-icons/md'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { SimpleNotifications, SimpleNotification } from '../notifications/SimpleNotifications'
import { SearchModal } from '../SearchModal'
import { QuickVerificationButton, QuickVerificationDialog } from '@/features/quickVerifications'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '../../components/ui/use-toast'
import { ToastAction } from '../../components/ui/toast'
import { notificationService, Notification } from '@/services/notificationService'
export const AdminTopBar = ({
  onMenuClick = () => {},
  onToggleCollapse = () => {},
  sidebarCollapsed = false,
}: {
  onMenuClick?: () => void
  onToggleCollapse?: () => void
  sidebarCollapsed?: boolean
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [verificationsOpen, setVerificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const knownNotificationIds = useRef<Set<string>>(new Set())
  const hasLoadedFirstBatch = useRef(false)
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  
  const handleLogout = () => {
    logout()
  }

  // Alerta visual y sonora cuando llega una nueva solicitud de presupuesto
  const alertNewBudgetRequest = (notification: Notification) => {
    try {
      const AudioCtx: typeof AudioContext | undefined =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const notes = [880, 1174.66]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        const start = ctx.currentTime + i * 0.15
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.22)
      })
      setTimeout(() => ctx.close().catch(() => {}), 1000)
    } catch {
      // Audio no disponible: continuar con el toast
    }

    toast({
      title: 'Nueva solicitud de presupuesto',
      description: notification.mensaje,
      action: (
        <ToastAction altText="Ver solicitudes" onClick={() => navigate('/reparaciones/budget-requests')}>
          Ver
        </ToastAction>
      ),
    })
  }

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll()
      const list = Array.isArray(data) ? data : []
      setNotifications(list)
      list.forEach((notification) => {
        if (notification.tipo !== 'nuevo_presupuesto') return
        if (!hasLoadedFirstBatch.current) {
          knownNotificationIds.current.add(notification.id)
          return
        }
        if (!knownNotificationIds.current.has(notification.id)) {
          knownNotificationIds.current.add(notification.id)
          alertNewBudgetRequest(notification)
        }
      })
      hasLoadedFirstBatch.current = true
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  // Cargar notificaciones al montar y hacer polling cada 10 segundos
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
    
    const interval = setInterval(() => {
      loadNotifications()
      loadUnreadCount()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])
  
  // 📦 ESTADO DE NOTIFICACIONES – Conectado con API
  const handleNotificationRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id.toString())
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id.toString() ? { ...notif, leida: true } : notif
        )
      )
      loadUnreadCount()
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({ title: 'Error', description: 'No se pudo marcar la notificación como leída.', variant: 'destructive' })
    }
  }

  const handleNotificationDelete = async (id: number) => {
    try {
      await notificationService.delete(id.toString())
      setNotifications(prev => prev.filter(notif => notif.id !== id.toString()))
      loadUnreadCount()
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast({ title: 'Error', description: 'No se pudo eliminar la notificación.', variant: 'destructive' })
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      )
      loadUnreadCount()
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast({ title: 'Error', description: 'No se pudieron marcar todas las notificaciones como leídas.', variant: 'destructive' })
    }
  }

  // Convertir notificaciones del backend al formato del componente
  const simpleNotifications: SimpleNotification[] = notifications.map(notif => {
    const iconMap: Record<string, React.ReactNode> = {
      whatsapp: <MessageSquare size={16} className="text-green-500" />,
      stock_bajo: <Package size={16} className="text-orange-500" />,
      reparacion_completada: <Wrench size={16} className="text-green-500" />,
      reparacion_recibida: <Wrench size={16} className="text-blue-500" />,
      venta_realizada: <ShoppingCart size={16} className="text-green-500" />,
      cierre_caja: <Calendar size={16} className="text-purple-500" />,
      nuevo_presupuesto: <ClipboardList size={16} className="text-blue-500" />,
    }

    return {
      id: parseInt(notif.id),
      title: notif.titulo,
      description: notif.mensaje,
      icon: iconMap[notif.tipo] || <Bell size={16} />,
      read: notif.leida,
      time: new Date(notif.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    }
  })
  return (
    <header data-tour="topbar" className="h-14 flex items-center justify-between px-4 lg:px-6 bg-card/80 backdrop-blur-md border-b border-border z-30 sticky top-0">
      <div className="flex items-center gap-3">
        <Button onClick={onMenuClick} variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Abrir menú">
          <Menu size={18} />
        </Button>
        <Button onClick={onToggleCollapse} variant="ghost" size="icon-sm" className="hidden lg:inline-flex" aria-label="Colapsar sidebar">
          <ArrowRightToLine size={18} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-input bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors w-64"
        >
          <MdSearch size={16} />
          <span className="flex-1 text-left">Buscar...</span>
          <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">⌘K</kbd>
        </button>
        
        {/* Mobile Search Button */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <MdSearch size={20} className="text-muted-foreground" />
        </button>

        {/* 🪟 Notificaciones – vacías por defecto */}
        <div className="relative" ref={notificationsRef}>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notificaciones"
          >
            <Bell size={18} className="text-muted-foreground" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          {notificationsOpen && (
            <div className="fixed inset-x-4 top-16 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2">
              <SimpleNotifications
                notifications={simpleNotifications}
                onRead={handleNotificationRead}
                onDelete={handleNotificationDelete}
                onMarkAllRead={handleMarkAllRead}
                unreadCount={unreadCount}
              />
            </div>
          )}
        </div>

        {/* QR Scanner Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate('/reparaciones/qr-scanner')}
          title="Escanear QR"
          aria-label="Escáner QR"
        >
          <Camera size={18} className="text-muted-foreground" />
        </Button>
        {/* Verificaciones rápidas */}
        <QuickVerificationButton onClick={() => setVerificationsOpen(true)} />
        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">
                  {user?.nombre || 'Usuario'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {user?.apellido || ''}
                </div>
              </div>
              <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User size={16} className="mr-2" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <MdSettings size={16} className="mr-2" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                Cerrar sesión <LogOut size={18} />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
      <QuickVerificationDialog open={verificationsOpen} onOpenChange={setVerificationsOpen} />
    </header>
  )
}
export default AdminTopBar
