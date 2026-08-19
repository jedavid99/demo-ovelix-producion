import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { Search, Loader2, Smartphone, MessageCircle, AlertTriangle, CheckCircle2, CalendarClock, ShieldCheck, BadgeCheck, Trash2, Wallet, RefreshCw, QrCode, Landmark, Banknote, Percent } from 'lucide-react'
import { API_BASE } from '@/services/api'
import { useTenantPage } from './TenantProvider'
import { resolveIcon } from './icons'
import {
  fetchPublicBudgetRequest,
  confirmPublicBudgetRequest,
  cancelPublicBudgetRequest,
  payPublicBudgetRequest,
  type PublicBudgetRequest,
} from './services'

interface RepairData {
  numero_reparacion: string
  estado: string
  dispositivo?: string | null
  marca?: string | null
  modelo?: string | null
  problema_reportado?: string | null
  diagnosis?: string | null
  reparacion_realizada?: string | null
  fecha_ingreso?: string | null
  fecha_estimada_entrega?: string | null
  fecha_entrega?: string | null
  total_reparacion?: number | null
  garantia_meses?: number | null
  tecnico_asignado?: { nombre?: string; apellido?: string } | null
}

type Tone = 'primary' | 'success' | 'warn' | 'danger'

interface EstadoTracking {
  label: string
  description: string
  progress: number
  done: number
  active: number
  terminal: boolean
  tone: Tone
}

// Mapeo de los 20 estados reales del enum EstadoReparacion
const ESTADO_TRACKING: Record<string, EstadoTracking> = {
  INGRESADO: { label: 'Ingresado', description: 'Recibimos tu equipo y lo registramos en el sistema.', progress: 8, done: 0, active: 0, terminal: false, tone: 'primary' },
  EN_COLA_DIAGNOSTICO: { label: 'En cola de diagnóstico', description: 'Tu equipo está en la fila para ser revisado por el técnico.', progress: 14, done: 0, active: 0, terminal: false, tone: 'primary' },
  EN_DIAGNOSTICO: { label: 'En diagnóstico', description: 'Estamos evaluando el problema de tu equipo.', progress: 28, done: 1, active: 1, terminal: false, tone: 'primary' },
  PRESUPUESTADO_ESPERANDO_OK: { label: 'Esperando tu aprobación', description: 'Te enviamos el presupuesto. Estamos esperando tu OK para avanzar.', progress: 38, done: 1, active: 1, terminal: false, tone: 'primary' },
  PRESUPUESTO_RECHAZADO: { label: 'Presupuesto rechazado', description: 'No aprobaste el presupuesto. Podés pasar a retirar tu equipo.', progress: 100, done: 1, active: -1, terminal: true, tone: 'danger' },
  RESPALDO_DE_DATOS: { label: 'Respaldo de datos', description: 'Estamos resguardando la información de tu equipo.', progress: 45, done: 1, active: 1, terminal: false, tone: 'primary' },
  EN_REPARACION: { label: 'En reparación', description: 'Estamos trabajando en tu equipo.', progress: 60, done: 1, active: 1, terminal: false, tone: 'primary' },
  ESPERANDO_REPUESTO_LOCAL: { label: 'Esperando repuesto', description: 'Tu equipo está en pausa esperando un repuesto disponible en el país.', progress: 48, done: 1, active: 1, terminal: false, tone: 'warn' },
  ESPERANDO_REPUESTO_IMPORTACION: { label: 'Esperando repuesto (importación)', description: 'El repuesto llega desde el exterior. Te avisamos en cuanto esté.', progress: 44, done: 1, active: 1, terminal: false, tone: 'warn' },
  EN_PRUEBAS_CONTROL_CALIDAD: { label: 'En control de calidad', description: 'Tu equipo está pasando las pruebas finales de verificación.', progress: 78, done: 2, active: 2, terminal: false, tone: 'primary' },
  REPARADO_PENDIENTE_PAGO: { label: 'Reparado, pendiente de pago', description: 'Tu equipo está reparado. Podés pasar a retirarlo y abonar.', progress: 92, done: 3, active: 3, terminal: false, tone: 'success' },
  LISTO_PARA_RETIRAR: { label: 'Listo para retirar', description: 'Tu equipo está listo. Podés pasar a retirarlo cuando quieras.', progress: 95, done: 3, active: 3, terminal: false, tone: 'success' },
  ENTREGADO_AL_CLIENTE: { label: 'Entregado', description: 'Ya retiraste tu equipo. ¡Gracias por confiar en nosotros!', progress: 100, done: 4, active: -1, terminal: false, tone: 'success' },
  CERRADO_FACTURADO: { label: 'Cerrado y facturado', description: 'Operación completada. ¡Gracias por confiar en nosotros!', progress: 100, done: 4, active: -1, terminal: false, tone: 'success' },
  IRREPARABLE_PARA_RETIRAR: { label: 'Irreparable', description: 'Lamentablemente tu equipo no puede ser reparado. Podés retirarlo.', progress: 100, done: 1, active: -1, terminal: true, tone: 'danger' },
  IRREPARABLE_ENTREGADO: { label: 'Irreparable, entregado', description: 'Te devolvimos el equipo porque no fue posible repararlo.', progress: 100, done: 1, active: -1, terminal: true, tone: 'danger' },
  EN_GARANTIA_REINGRESO: { label: 'Reingreso en garantía', description: 'Tu equipo volvió al taller por un tema cubierto por la garantía.', progress: 40, done: 1, active: 1, terminal: false, tone: 'primary' },
  GARANTIA_ENTREGADO: { label: 'Entregado (garantía)', description: 'Tu equipo fue entregado dentro del período de garantía.', progress: 100, done: 4, active: -1, terminal: false, tone: 'success' },
  ABANDONADO_POR_CLIENTE: { label: 'Abandonado', description: 'No retiraste tu equipo. Escribinos por WhatsApp para resolverlo.', progress: 100, done: 1, active: -1, terminal: true, tone: 'danger' },
  CANCELADO_POR_CLIENTE: { label: 'Cancelado', description: 'La reparación fue cancelada.', progress: 100, done: 1, active: -1, terminal: true, tone: 'danger' },
}

const STEPS = [
  { icon: 'check', label: 'PASO 01', title: 'Ingresado' },
  { icon: 'settings', label: 'PASO 02', title: 'En reparación' },
  { icon: 'shield', label: 'PASO 03', title: 'Control de calidad' },
  { icon: 'package', label: 'PASO 04', title: 'Listo para retirar' },
]

function buildSteps(estado: string) {
  const info = ESTADO_TRACKING[estado] ?? { done: 0, active: 0, terminal: false }
  return STEPS.map((s, i) => ({
    ...s,
    status: info.terminal ? (i < info.done ? 'done' : 'muted') : i < info.done ? 'done' : i === info.active ? 'active' : 'pending',
  }))
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}

const TONES: Record<Tone, { banner: string; bar: string; dot: string; iconBg: string }> = {
  primary: { banner: 'border-border', bar: 'bg-primary', dot: 'bg-secondary', iconBg: 'bg-primary/10 text-primary' },
  success: { banner: 'border-emerald-500/30', bar: 'bg-emerald-500', dot: 'bg-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-600' },
  warn: { banner: 'border-amber-500/30', bar: 'bg-amber-500', dot: 'bg-amber-500', iconBg: 'bg-amber-500/10 text-amber-600' },
  danger: { banner: 'border-red-500/30', bar: 'bg-red-500', dot: 'bg-red-500', iconBg: 'bg-red-500/10 text-red-600' },
}

export default function TrackingPage() {
  const { tracking, contact } = useTenantPage()
  const [searchParams] = useSearchParams()
  const orderParam = searchParams.get('order')?.trim() ?? ''
  const [orderNumber, setOrderNumber] = useState(orderParam)
  const [isLoading, setIsLoading] = useState(Boolean(orderParam))
  const [error, setError] = useState('')
  const [repair, setRepair] = useState<RepairData | null>(null)
  const [reservation, setReservation] = useState<PublicBudgetRequest | null>(null)
  const [actionBusy, setActionBusy] = useState(false)

  const [payPlan, setPayPlan] = useState<'half' | 'full' | null>(null)
  const [señaMethod, setSeñaMethod] = useState<'qr' | 'transferencia' | null>(null)
  const [comprobante, setComprobante] = useState('')
  const [restoMethod, setRestoMethod] = useState<'qr' | 'transferencia' | 'efectivo' | null>(null)

  const lookupOrder = async (term: string) => {
    // Primero intentamos una reparación (REP-…); si no existe, probamos una reserva de presupuesto (REQ-…).
    let foundRepair: RepairData | null = null
    try {
      const res = await axios.get(`${API_BASE}/repairs/public/${encodeURIComponent(term)}`)
      const payload = res.data?.data
      if (payload) foundRepair = payload
    } catch {
      foundRepair = null
    }
    if (foundRepair) {
      setRepair(foundRepair)
      setReservation(null)
      return
    }
    const foundReservation = await fetchPublicBudgetRequest(term)
    if (foundReservation) {
      setRepair(null)
      setReservation(foundReservation)
      return
    }
    setRepair(null)
    setReservation(null)
    throw new Error('empty')
  }

  useEffect(() => {
    if (!orderParam) return
    let cancelled = false
    const fetchOrder = async () => {
      try {
        await lookupOrder(orderParam)
        if (cancelled) return
      } catch {
        if (!cancelled) setError('No encontramos ninguna orden con ese número. Verificá el número e intentá de nuevo.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void fetchOrder()
    return () => {
      cancelled = true
    }
  }, [orderParam])

  const runSearch = async (value: string) => {
    const term = value.trim()
    if (!term) {
      setError('Ingresá tu número de orden para consultar.')
      return
    }
    setIsLoading(true)
    setError('')
    setRepair(null)
    setReservation(null)
    try {
      await lookupOrder(term)
    } catch {
      setError('No encontramos ninguna orden con ese número. Verificá el número e intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmReservation = async () => {
    if (!reservation) return
    setActionBusy(true)
    setError('')
    const ok = await confirmPublicBudgetRequest(reservation.numero)
    setActionBusy(false)
    if (ok) {
      setReservation({ ...reservation, estado: 'CONFIRMADO' })
    } else {
      setError('No pudimos confirmar la reserva. Probá de nuevo o escribinos por WhatsApp.')
    }
  }

  const handleCancelReservation = async () => {
    if (!reservation) return
    const ok = window.confirm('¿Seguro que querés eliminar esta reserva? El taller dejará de trabajar en tu cotización.')
    if (!ok) return
    setActionBusy(true)
    setError('')
    const removed = await cancelPublicBudgetRequest(reservation.numero)
    setActionBusy(false)
    if (removed) {
      setReservation(null)
      setRepair(null)
      setError('Tu reserva fue eliminada. Si cambiás de opinión, volvé a generar tu presupuesto.')
    } else {
      setError('No pudimos eliminar la reserva. Probá de nuevo o escribinos por WhatsApp.')
    }
  }

  const handlePay = async () => {
    if (!reservation) return
    if (!payPlan) {
      setError('Elegí si vas a pagar el 50% o el total.')
      return
    }
    if (!señaMethod) {
      setError('Elegí cómo vas a abonar la seña: por QR o por transferencia.')
      return
    }
    if (!comprobante.trim()) {
      setError('Ingresá el número de comprobante de la seña.')
      return
    }
    if (payPlan === 'half' && !restoMethod) {
      setError('Elegí cómo vas a abonar el resto.')
      return
    }
    setActionBusy(true)
    setError('')
    try {
      const updated = await payPublicBudgetRequest(reservation.numero, {
        plan_pago: payPlan,
        sena_metodo: señaMethod,
        comprobante: comprobante.trim(),
        resto_metodo: payPlan === 'half' ? (restoMethod ?? undefined) : undefined,
      })
      if (updated) {
        setReservation(updated)
        setPayPlan(null)
        setSeñaMethod(null)
        setComprobante('')
        setRestoMethod(null)
      } else {
        setError('No pudimos registrar el pago. Probá de nuevo o escribinos por WhatsApp.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos registrar el pago. Probá de nuevo.')
    } finally {
      setActionBusy(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void runSearch(orderNumber)
  }

  const info = repair ? ESTADO_TRACKING[repair.estado] ?? { label: repair.estado, description: 'Tu reparación está en proceso.', progress: 50, done: 1, active: 1, terminal: false, tone: 'primary' as Tone } : null
  const tone = info ? TONES[info.tone] : TONES.primary
  const steps = repair ? buildSteps(repair.estado) : []
  const waLink = contact.whatsapp
    ? `${contact.whatsapp}?text=${encodeURIComponent(`Hola, quiero consultar el estado de mi orden ${repair?.numero_reparacion ?? ''}.`)}`
    : ''

  const reservationPrice =
    reservation != null ? Number(reservation.precio_ajustado ?? reservation.precio_ofertado) : null
  const reservationPriceDefined = reservationPrice != null && !Number.isNaN(reservationPrice)
  const hasPaymentData = !!reservation?.plan_pago
  const showPaymentStep = reservation?.estado === 'PENDIENTE' && reservationPriceDefined && !hasPaymentData

  const details = repair
    ? [
        { label: 'Dispositivo', value: `${[repair.marca, repair.modelo, repair.dispositivo].filter(Boolean).join(' ')}` || '—' },
        { label: 'Problema reportado', value: repair.problema_reportado || '—' },
        { label: 'Diagnóstico', value: repair.diagnosis || '—' },
        { label: 'Reparación realizada', value: repair.reparacion_realizada || '—' },
        { label: 'Fecha de ingreso', value: formatDate(repair.fecha_ingreso) },
        { label: 'Fecha estimada de entrega', value: formatDate(repair.fecha_estimada_entrega) },
        { label: 'Fecha de entrega', value: formatDate(repair.fecha_entrega) },
        { label: 'Técnico asignado', value: repair.tecnico_asignado ? `${repair.tecnico_asignado.nombre ?? ''} ${repair.tecnico_asignado.apellido ?? ''}`.trim() || '—' : '—' },
        { label: 'Total', value: formatCurrency(repair.total_reparacion) },
        { label: 'Garantía', value: repair.garantia_meses ? `${repair.garantia_meses} ${repair.garantia_meses === 1 ? 'mes' : 'meses'}` : '—' },
      ]
    : []

  return (
    <main className="bg-muted min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className={`w-2 h-2 rounded-full ${repair && info ? tone.dot : 'bg-secondary'}`}
              />
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                {repair && info ? `${info.label} · ${repair.numero_reparacion}` : tracking.statusLabel}
              </p>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tighter"
            >
              SEGUIMIENTO
            </motion.h2>
            <p className="text-muted-foreground max-w-xl">
              {repair
                ? `Consultá el estado actual de la orden ${repair.numero_reparacion}.`
                : 'Ingresá tu número de orden para ver en qué etapa está tu reparación.'}
            </p>
          </div>

          {repair && (
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
              <Smartphone size={22} className="text-secondary shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Dispositivo</p>
                <p className="text-sm font-bold uppercase tracking-widest">
                  {[repair.marca, repair.modelo, repair.dispositivo].filter(Boolean).join(' ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Buscador */}
        <form onSubmit={handleSubmit} className="max-w-2xl mb-12">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="REP-20260725-0001"
              disabled={isLoading}
              className="w-full pl-12 pr-36 py-4 bg-background border border-border rounded-xl text-sm font-bold uppercase tracking-widest placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground text-xs font-black uppercase tracking-widest hover:bg-[var(--tc-secondary-hover)] disabled:opacity-50 rounded-lg transition-colors"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Consultar'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="max-w-2xl flex items-start gap-3 bg-red-500/10 border border-red-600/30 text-red-700 rounded-xl px-5 py-4 text-sm font-semibold">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Cargando */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted-foreground text-sm font-bold uppercase tracking-widest">
            <Loader2 size={20} className="animate-spin mr-3" /> Consultando...
          </div>
        )}

        {/* Reserva de presupuesto (REQ-…): el admin aún no confirmó el costo */}
        {reservation && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className={`border rounded-2xl p-8 md:p-10 ${reservation.estado === 'CONFIRMADO' ? 'border-emerald-500/30' : 'border-border'}`}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${reservation.estado === 'CONFIRMADO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                  {reservation.estado === 'CONFIRMADO' ? <BadgeCheck size={26} /> : <CalendarClock size={26} />}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Reserva de presupuesto · {reservation.numero}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground">
                    {reservation.estado === 'CONFIRMADO' ? 'Reparación confirmada' : 'Esperando la cotización del taller'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reservation.estado === 'CONFIRMADO'
                      ? 'El taller ya tiene tu OK y avanzará con la reparación.'
                      : showPaymentStep
                      ? 'El taller te confirmó el costo. Registrá tu forma de pago para confirmar tu reparación.'
                      : 'Recibimos tu solicitud. El taller te envía el costo por WhatsApp para que confirmes.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
              <h3 className="text-lg font-black uppercase tracking-widest mb-8">Detalles de la reserva</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Equipo</p>
                  <p className="text-sm font-semibold text-foreground">{reservation.dispositivo || reservation.modelo || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Problema</p>
                  <p className="text-sm font-semibold text-foreground">{reservation.problema || reservation.descripcion || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Fecha</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(reservation.created_at)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Estado</p>
                  <p className="text-sm font-semibold text-foreground">
                    {reservation.estado === 'PENDIENTE' ? 'Pendiente de cotización' : reservation.estado === 'CONFIRMADO' ? 'Confirmada' : reservation.estado === 'CONVERTIDO' ? 'En taller' : reservation.estado === 'RECHAZADO' ? 'Rechazada' : reservation.estado}
                  </p>
                </div>
                {reservation.plan_pago && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Plan de pago</p>
                    <p className="text-sm font-semibold text-foreground">
                      {reservation.plan_pago === 'half' ? '50% + 50%' : 'Pago completo'}
                    </p>
                  </div>
                )}
                {(reservation.sena_monto != null || reservation.sena_metodo) && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Seña</p>
                    <p className="text-sm font-semibold text-foreground">
                      {`${formatCurrency(Number(reservation.sena_monto ?? 0))}${reservation.sena_metodo ? ` (${reservation.sena_metodo === 'qr' ? 'QR' : 'Transferencia'})` : ''}`}
                    </p>
                  </div>
                )}
                {reservation.resto_metodo && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Resto</p>
                    <p className="text-sm font-semibold text-foreground">
                      {reservation.resto_metodo === 'qr' ? 'QR' : reservation.resto_metodo === 'transferencia' ? 'Transferencia' : 'Efectivo en el local'}
                    </p>
                  </div>
                )}
              </div>

              {(reservation.precio_ajustado != null || reservation.precio_ofertado != null) && reservation.estado !== 'CONVERTIDO' && (
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {showPaymentStep ? 'Costo confirmado por el taller' : 'Costo de la reparación'}
                    </p>
                    <p className="text-2xl font-black text-foreground tabular-nums">
                      {formatCurrency(Number(reservation.precio_ajustado ?? reservation.precio_ofertado))}
                    </p>
                    {showPaymentStep && payPlan && reservationPrice != null && (
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
                        {payPlan === 'half'
                          ? `Seña (50%): ${formatCurrency(Math.round(reservationPrice * 0.5))} · Resto (50%): ${formatCurrency(Math.round(reservationPrice * 0.5))}`
                          : `Seña (100%): ${formatCurrency(reservationPrice)}`}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {reservation.estado === 'CONVERTIDO' && reservation.repair?.numero_reparacion && (
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                  <span>Tu equipo ya ingresó al taller con la orden <strong className="text-foreground">{reservation.repair.numero_reparacion}</strong>. Podés seguirlo con ese número.</span>
                </div>
              )}

              {showPaymentStep ? (
                <div className="mt-10 pt-8 border-t border-border space-y-8">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">PLAN DE PAGO</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <button
                        type="button"
                        onClick={() => setPayPlan('half')}
                        aria-pressed={payPlan === 'half'}
                        className={`flex items-center gap-3 p-5 border rounded-xl text-left transition-colors ${
                          payPlan === 'half'
                            ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                            : 'border-border bg-card text-foreground hover:border-primary'
                        }`}
                      >
                        <Percent size={20} className="shrink-0" />
                        <span className="text-sm font-black uppercase tracking-widest">PAGO 50% + 50%</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayPlan('full')}
                        aria-pressed={payPlan === 'full'}
                        className={`flex items-center gap-3 p-5 border rounded-xl text-left transition-colors ${
                          payPlan === 'full'
                            ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                            : 'border-border bg-card text-foreground hover:border-primary'
                        }`}
                      >
                        <CheckCircle2 size={20} className="shrink-0" />
                        <span className="text-sm font-black uppercase tracking-widest">PAGO COMPLETO</span>
                      </button>
                    </div>
                  </div>

                  {payPlan && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">
                        SEÑA (OBLIGATORIA) {payPlan === 'half' ? '· 50%' : '· 100%'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setSeñaMethod('qr')}
                          aria-pressed={señaMethod === 'qr'}
                          className={`flex items-center gap-3 p-5 border rounded-xl text-left transition-colors ${
                            señaMethod === 'qr'
                              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                              : 'border-border bg-card text-foreground hover:border-primary'
                          }`}
                        >
                          <QrCode size={20} className="shrink-0" />
                          <span className="text-sm font-black uppercase tracking-widest">QR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSeñaMethod('transferencia')}
                          aria-pressed={señaMethod === 'transferencia'}
                          className={`flex items-center gap-3 p-5 border rounded-xl text-left transition-colors ${
                            señaMethod === 'transferencia'
                              ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                              : 'border-border bg-card text-foreground hover:border-primary'
                          }`}
                        >
                          <Landmark size={20} className="shrink-0" />
                          <span className="text-sm font-black uppercase tracking-widest">TRANSFERENCIA</span>
                        </button>
                      </div>

                      {señaMethod && (
                        <div className="mt-4 flex flex-col gap-2 max-w-md">
                          <label htmlFor="track-comprobante" className="text-xs font-bold text-muted-foreground tracking-widest">
                            N° DE COMPROBANTE *
                          </label>
                          <input
                            id="track-comprobante"
                            type="text"
                            placeholder="EJ: OPERACIÓN 000000123456"
                            value={comprobante}
                            onChange={(e) => setComprobante(e.target.value)}
                            className="bg-transparent border-b border-input py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {payPlan === 'half' && (
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">RESTO (50%)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        {([
                          ['qr', QrCode, 'QR'],
                          ['transferencia', Landmark, 'TRANSFERENCIA'],
                          ['efectivo', Banknote, 'EFECTIVO'],
                        ] as const).map(([key, Icon, label]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setRestoMethod(key)}
                            aria-pressed={restoMethod === key}
                            className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-colors ${
                              restoMethod === key
                                ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                                : 'border-border bg-card text-foreground hover:border-primary'
                            }`}
                          >
                            <Icon size={18} className="shrink-0" />
                            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck size={16} /> El taller ya te confirmó el costo. Registrá tu forma de pago para confirmar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleCancelReservation}
                        disabled={actionBusy}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-destructive/50 text-destructive text-xs font-black uppercase tracking-widest hover:bg-destructive/5 disabled:opacity-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} /> Eliminar reserva
                      </button>
                      <button
                        onClick={handlePay}
                        disabled={actionBusy}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground text-xs font-black uppercase tracking-widest hover:bg-[var(--tc-secondary-hover)] disabled:opacity-50 rounded-lg transition-colors"
                      >
                        {actionBusy ? <Loader2 size={15} className="animate-spin" /> : <Wallet size={15} />}
                        Confirmar y registrar pago
                      </button>
                    </div>
                  </div>
                </div>
              ) : (reservation.estado === 'PENDIENTE' || reservation.estado === 'CONFIRMADO') && (
                <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck size={16} />
                    {reservation.estado === 'CONFIRMADO'
                      ? 'Ya confirmaste el costo de tu reparación. El taller va a avanzar con el trabajo.'
                      : reservationPriceDefined
                      ? 'El taller te confirmó el costo. Tocá «Confirmar reparación» para avanzar.'
                      : 'Recibimos tu solicitud. El taller te confirma el costo por WhatsApp.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {reservation.estado === 'PENDIENTE' && (
                      <button
                        onClick={handleCancelReservation}
                        disabled={actionBusy}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-destructive/50 text-destructive text-xs font-black uppercase tracking-widest hover:bg-destructive/5 disabled:opacity-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} /> Eliminar reserva
                      </button>
                    )}
                    {reservation.estado === 'PENDIENTE' && reservationPriceDefined && (
                      <button
                        onClick={handleConfirmReservation}
                        disabled={actionBusy}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground text-xs font-black uppercase tracking-widest hover:bg-[var(--tc-secondary-hover)] disabled:opacity-50 rounded-lg transition-colors"
                      >
                        {actionBusy ? <Loader2 size={15} className="animate-spin" /> : <BadgeCheck size={15} />}
                        Confirmar reparación
                      </button>
                    )}
                  </div>
                </div>
              )}

              {reservation.estado === 'RECHAZADO' && (
                <div className="mt-10 pt-8 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
                  <AlertTriangle size={18} className="shrink-0 text-amber-500" />
                  <span>El taller no pudo cotizar esta reparación. Escribinos por WhatsApp para ver alternativas.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4 text-sm text-muted-foreground">
              <RefreshCw size={18} className="shrink-0 text-secondary" />
              <span>
                {showPaymentStep
                  ? 'El taller te confirmó el costo. Elegí tu plan de pago y registrá la seña para confirmar.'
                  : reservation.estado === 'PENDIENTE' && !reservationPriceDefined
                  ? 'El taller te confirma el costo por WhatsApp. Cuando lo tenga listo, vas a poder verlo acá y pagar online.'
                  : 'Si el taller te confirmó el costo por WhatsApp, tocá «Confirmar reparación» para avanzar.'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Resultado reparación */}
        {repair && info && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-10"
          >
            {/* Estado actual */}
            <div className={`bg-card border rounded-2xl p-8 md:p-10 ${tone.banner}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${tone.iconBg}`}>
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Estado actual</p>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground">{info.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                  </div>
                </div>
                <div className="md:w-48">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    <span>Progreso</span>
                    <span>{info.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${tone.bar}`} style={{ width: `${info.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {!info.terminal ? (
              <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((step, i) => {
                    const Icon = resolveIcon(step.icon)
                    return (
                      <div key={step.title} className="flex items-start gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              step.status === 'done'
                                ? 'bg-secondary text-secondary-foreground'
                                : step.status === 'active'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          {i < steps.length - 1 && (
                            <div className={`w-px h-full min-h-[2rem] mt-1 ${step.status === 'done' ? 'bg-secondary' : 'bg-border'}`} />
                          )}
                        </div>
                        <div className="pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{step.label}</p>
                          <p className={`text-sm font-black uppercase tracking-widest ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-600/30 text-red-700 rounded-xl px-5 py-4 text-sm font-semibold">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>Esta reparación no continúa el flujo normal de seguimiento. Si tenés dudas, escribinos por WhatsApp.</span>
              </div>
            )}

            {/* Detalles */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
              <h3 className="text-lg font-black uppercase tracking-widest mb-8">Detalles de la reparación</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {details.map((d) => (
                  <div key={d.label}>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{d.label}</p>
                    <p className="text-sm font-semibold text-foreground">{d.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock size={16} /> ¿Tenés dudas sobre tu reparación?
                </p>
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground text-xs font-black uppercase tracking-widest hover:bg-[var(--tc-secondary-hover)] rounded-lg transition-colors"
                  >
                    <MessageCircle size={16} /> {tracking.messageButton}
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">Contactanos por teléfono o WhatsApp.</span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hint cuando no hay búsqueda todavía */}
        {!repair && !reservation && !isLoading && !error && (
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-4 text-sm text-muted-foreground max-w-2xl">
            <ShieldCheck size={18} className="shrink-0 text-secondary" />
            <span>El número de orden figura en el comprobante que recibiste al dejar tu equipo.</span>
          </div>
        )}
      </div>
    </main>
  )
}
