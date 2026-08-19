import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Clock,
  Wrench,
  ArrowRight,
  CheckCircle,
  Send,
  ShieldCheck,
  Lock,
  QrCode,
  Landmark,
  Banknote,
  Truck,
  Car,
  MapPin,
  Copy,
  Percent,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from 'lucide-react'
import { useTenantPage } from './TenantProvider'
import { parseSchedule, buildBusinessSlots, businessDaysLabel, hoursLabel } from './schedule'
import { savePendingQuote, formatARS, type TenantQuoteSelection } from './tenant'
import {
  fetchRepairCosts,
  resolveTenantSlug,
  submitBudgetRequest,
  type TenantRepairCost,
} from './services'

/* =====================================================================
   PRESUPUESTO — FLUJO COMPLETO (01 EQUIPO → 07 ENVÍO + TICKET EN VIVO)
   Lógica y animaciones trasplantadas de `ValuationPage` (presupuesto),
   re-mapeadas a tokens de theme del sistema.
   Datos: consume el backend público del sistema (`/public/tenant-pages`
   y `/public/repair-costs`) con fallback a datos demo embebidos.
   ===================================================================== */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const STEPS = [
  { n: '01', label: 'EQUIPO' },
  { n: '02', label: 'REPARACIÓN' },
  { n: '03', label: 'DATOS' },
  { n: '04', label: 'PAGO' },
  { n: '05', label: 'ENTREGA' },
  { n: '06', label: 'TURNO' },
  { n: '07', label: 'ENVÍO' },
]

const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

const MONTHS_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

function toMinute(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const startOfDay = (d: Date) => {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/* ------------------------- Utilidades del flujo ------------------------- */

/* ------------------------------------------------------------------------ */

const optionCard = (active: boolean) =>
  `relative flex items-center gap-4 p-6 border rounded-xl text-left transition-colors duration-300 ${
    active
      ? 'border-primary bg-primary/10 text-primary shadow-xl shadow-primary/10'
      : 'border-border bg-card text-foreground hover:border-primary hover:bg-muted'
  }`

const smallCard = (active: boolean) =>
  `relative flex items-center gap-3 p-5 border rounded-xl text-left transition-colors duration-300 ${
    active
      ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
      : 'border-border bg-card text-foreground hover:border-primary hover:bg-muted'
  }`

const SelectedCheck = ({ layoutId, size = 18 }: { layoutId: string; size?: number }) => (
  <motion.span
    layoutId={layoutId}
    initial={{ scale: 0, rotate: -90 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 500, damping: 24 }}
    className="absolute top-3 right-3 text-primary"
  >
    <CheckCircle size={size} />
  </motion.span>
)

export default function PresupuestoFlow() {
  const tenant = useTenantPage()
  const valuation = tenant.valuation
  const contact = tenant.contact
  const checkout = tenant.checkout

  const [query, setQuery] = useState('')
  const [repairCosts, setRepairCosts] = useState<TenantRepairCost[]>([])
  const [selected, setSelected] = useState<TenantRepairCost | null>(null)
  const [equipoMarca, setEquipoMarca] = useState<string | null>(null)
  const [customRequest, setCustomRequest] = useState(false)
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', dni: '', modelo: '', mensaje: '' })
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [today] = useState(() => startOfDay(new Date()))
  const [viewMonth, setViewMonth] = useState(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }))
  const calendarDays = useMemo(() => buildCalendarDays(viewMonth.year, viewMonth.month), [viewMonth])
  const scheduleInfo = useMemo(() => parseSchedule(tenant.schedule), [tenant.schedule])
  const businessSlots = useMemo(
    () => buildBusinessSlots(scheduleInfo.openMin, scheduleInfo.closeMin),
    [scheduleInfo.openMin, scheduleInfo.closeMin],
  )
  const [payPlan, setPayPlan] = useState<'half' | 'full' | null>(null)
  const [señaMethod, setSeñaMethod] = useState<'qr' | 'transferencia' | null>(null)
  const [comprobante, setComprobante] = useState('')
  const [restoMethod, setRestoMethod] = useState<'qr' | 'transferencia' | 'efectivo' | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<'llevar' | 'retirar' | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slug = resolveTenantSlug()
    let cancelled = false
    fetchRepairCosts(slug).then(list => {
      if (!cancelled) setRepairCosts(list)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const tokens = useMemo(() => {
    const q = normalize(query).trim()
    if (q.length < 2) return []
    return q.split(/\s+/).filter(t => t.length >= 2)
  }, [query])

  const matches = useMemo(() => {
    if (tokens.length === 0) return []
    return repairCosts
      .map(c => {
        const marcas = (c.marcas ?? []).join(' ')
        const modelos = (c.modelos ?? []).map(m => `${m.nombre} ${m.marca}`).join(' ')
        const hay = normalize(
          [c.nombre, c.categoria, c.descripcion ?? '', c.modelo ?? '', c.tiempo_estimado ?? '', marcas, modelos].join(' ')
        )
        const score = tokens.filter(t => hay.includes(t)).length
        const isGeneric = (c.marcas?.length ?? 0) === 0 && (c.modelos?.length ?? 0) === 0 && !c.modelo?.trim()
        return { c, score, isGeneric, matches: score > 0 || isGeneric }
      })
      .filter(m => m.matches)
      .sort((a, b) => b.score - a.score || a.c.categoria.localeCompare(b.c.categoria))
      .map(m => m.c)
  }, [repairCosts, tokens])

  const searchActive = tokens.length > 0

  const hasQuote = !!selected || customRequest

  const stepIndex = submitted ? 6 : hasQuote ? 2 : searchActive ? 1 : 0

  const selectRepair = (c: TenantRepairCost) => {
    setSelected(c)
    setEquipoMarca(null)
    setCustomRequest(false)
    setSubmitted(false)
    setError('')
    setForm(p => ({ ...p, modelo: c.modelo ?? '' }))
    savePendingQuote({
      nombre: c.nombre,
      categoria: c.categoria,
      tipo_equipo: c.tipo_equipo,
      modelo: c.modelo,
      marcas: c.marcas,
      modelos: c.modelos,
      tiempo_estimado: c.tiempo_estimado,
      descripcion: c.descripcion,
      precio: c.precio,
    })
    setTimeout(() => {
      const el = document.getElementById('paso-datos')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const selectedMarcas = selected?.marcas ?? []
  const selectedModelos = selected?.modelos ?? []
  const hasBrandChooser = !!selected && selectedMarcas.length > 0
  const availableModels = equipoMarca ? selectedModelos.filter(m => m.marca === equipoMarca) : []

  const chooseBrand = (brand: string) => {
    setEquipoMarca(brand)
    setForm(p => ({ ...p, modelo: brand }))
  }

  const chooseModel = (marca: string, nombre: string) => {
    setEquipoMarca(marca)
    setForm(p => ({ ...p, modelo: `${marca} ${nombre}` }))
  }

  /** El modelo no está en las sugerencias: el cliente ingresa modelo + falla SIN precio y deja la reserva para que el admin cotice. */
  const selectCustomFromQuery = () => {
    const modelo = (form.modelo.trim() || query.trim() || 'Sin especificar').trim()
    setCustomRequest(true)
    setSelected(null)
    setSubmitted(false)
    setError('')
    setForm(p => ({ ...p, modelo }))
    savePendingQuote({
      nombre: 'Reparación a cotizar',
      categoria: 'Sin precio de referencia',
      tipo_equipo: null,
      modelo,
      tiempo_estimado: null,
      descripcion: form.mensaje.trim() || null,
      precio: null,
      priceLabel: 'A CONFIRMAR',
    })
    setTimeout(() => {
      const el = document.getElementById('paso-datos')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const goNext = (id: string) => () => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const buildWhatsAppUrl = (sel: TenantQuoteSelection) => {
    const precio = sel.precio ?? null
    const seña = precio != null && payPlan === 'half' ? Math.round(precio * 0.5) : precio
    const resto = precio != null && payPlan === 'half' ? precio - Math.round(precio * 0.5) : null
    const lines = [
      `Hola, quiero solicitar el presupuesto de una reparación.`,
      ``,
      `• Reparación: ${sel.nombre}`,
      ...(sel.categoria ? [`• Categoría: ${sel.categoria}`] : []),
      ...(sel.precio != null ? [`• Costo estimado: ${formatARS(sel.precio)}`] : sel.priceLabel ? [`• Costo estimado: ${sel.priceLabel}`] : []),
      ...(sel.tiempo_estimado ? [`• Tiempo estimado: ${sel.tiempo_estimado}`] : []),
      `• Modelo: ${form.modelo || '—'}`,
      ``,
      `• Nombre: ${form.name}`,
      `• DNI: ${form.dni}`,
      `• WhatsApp: ${form.whatsapp}`,
      ...(form.email ? [`• Email: ${form.email}`] : []),
      ...(form.mensaje ? [`\n${form.mensaje}`] : []),
      `\n• Plan de pago: ${payPlan === 'half' ? '50% (seña) + 50%' : payPlan === 'full' ? 'Pago completo' : 'A definir'}`,
      ...(seña != null ? [`• Seña (${payPlan === 'half' ? '50%' : '100%'}): ${señaMethod ? (señaMethod === 'qr' ? 'por QR' : 'por transferencia') : '—'} — ${formatARS(seña)}${comprobante.trim() ? ` (comprobante: ${comprobante.trim()})` : ''}`] : []),
      ...(payPlan === 'half' && resto != null
        ? [`• Resto: ${
            restoMethod === 'qr' ? 'por QR' : restoMethod === 'transferencia' ? 'por transferencia' : restoMethod === 'efectivo' ? 'en efectivo en el local' : 'a definir'
          } — ${formatARS(resto)}`]
        : []),
      ...(deliveryMethod === 'llevar'
        ? [`• Entrega: lo llevo al local${[contact.address, contact.city].filter(Boolean).join(', ') ? ` (${[contact.address, contact.city].filter(Boolean).join(', ')})` : ''}`]
        : deliveryMethod === 'retirar'
        ? [`• Entrega: retiran el equipo${deliveryAddress.trim() ? ` — ${deliveryAddress.trim()}` : ''}`, ...(checkout?.deliveryCost ? [`• Costo de envío: ${formatARS(checkout.deliveryCost)}`] : [])]
        : []),
      ...(selectedDay != null && selectedSlot
        ? [`\n• Turno solicitado: ${selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${selectedSlot}.`]
        : []),
      ...(señaMethod === 'transferencia' && (checkout?.cbu || checkout?.alias || checkout?.accountNumber)
        ? [`\nDatos para la transferencia:`, `• CBU: ${checkout?.cbu || '—'}`, `• Alias: ${checkout?.alias || '—'}`, `• Número de cuenta: ${checkout?.accountNumber || '—'}`]
        : []),
    ]
    return `${contact.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  const quote: TenantQuoteSelection | null = selected
    ? {
        nombre: selected.nombre,
        categoria: selected.categoria,
        modelo: selected.modelo,
        marcas: selected.marcas,
        modelos: selected.modelos,
        tiempo_estimado: selected.tiempo_estimado,
        descripcion: selected.descripcion,
        precio: selected.precio,
      }
    : customRequest
    ? {
        nombre: 'Reparación a cotizar',
        categoria: 'Sin precio de referencia',
        modelo: form.modelo.trim() || query.trim() || null,
        tiempo_estimado: null,
        descripcion: form.mensaje.trim() || null,
        precio: null,
        priceLabel: 'A CONFIRMAR',
      }
    : null

  const handleSubmit = async () => {
    if (!quote) return
    if (!form.name.trim() || !form.whatsapp.trim() || !form.dni.trim()) {
      setError('Completá tu nombre, tu DNI y tu WhatsApp para enviar la solicitud.')
      return
    }
    if (!customRequest) {
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
      if (deliveryMethod === 'retirar' && !deliveryAddress.trim()) {
        setError('Ingresá la dirección de retiro del equipo.')
        return
      }
    }
    setError('')
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 700))
    setLoading(false)
    setSubmitted(true)
    window.open(buildWhatsAppUrl(quote), '_blank')

    // Persistimos la solicitud en el backend para generar número de orden y seguimiento.
    const slug = resolveTenantSlug() ?? (tenant.slug && tenant.slug !== 'ovelix' ? tenant.slug : null)
    if (slug) {
      try {
        const precio = quote.precio ?? null
        const seña = precio != null && payPlan === 'half' ? Math.round(precio * 0.5) : precio
        const res = await submitBudgetRequest({
          slug,
          nombre: form.name.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim() || undefined,
          dni: form.dni.trim() || undefined,
          categoria: customRequest ? 'Sin precio de referencia' : quote.categoria ?? undefined,
          dispositivo: form.modelo.trim() || quote.nombre,
          marca: equipoMarca ?? undefined,
          modelo: form.modelo.trim() || undefined,
          problema: form.mensaje.trim() || undefined,
          descripcion: customRequest ? undefined : quote.descripcion ?? undefined,
          tiempo_estimado: customRequest ? undefined : quote.tiempo_estimado ?? undefined,
          precio_ofertado: customRequest ? undefined : precio ?? undefined,
          plan_pago: customRequest ? undefined : payPlan ?? undefined,
          sena_monto: customRequest ? undefined : seña ?? undefined,
          sena_metodo: customRequest ? undefined : señaMethod ?? undefined,
          comprobante: customRequest ? undefined : comprobante.trim() || undefined,
          resto_metodo: customRequest ? undefined : payPlan === 'half' ? (restoMethod ?? undefined) : undefined,
          delivery_metodo: customRequest ? undefined : deliveryMethod ?? undefined,
          delivery_direccion: customRequest ? undefined : deliveryMethod === 'retirar' ? deliveryAddress.trim() || undefined : undefined,
          delivery_costo: customRequest ? undefined : deliveryMethod === 'retirar' ? checkout?.deliveryCost ?? undefined : undefined,
          turno_fecha: customRequest ? undefined : selectedDay != null ? selectedDay.toISOString().slice(0, 10) : undefined,
          turno_horario: customRequest ? undefined : selectedSlot ?? undefined,
        })
        setOrderNumber(res.numero)
        setSaveFailed(false)
      } catch (err) {
        // El flujo público sigue funcionando via WhatsApp aunque falle el guardado,
        // pero avisamos para que el fallo no pase desapercibido.
        console.warn('No se pudo guardar la reserva en el backend:', err)
        setSaveFailed(true)
      }
    } else {
      // Sin empresa asociada (plantilla) el backend no puede guardar: no fallar en silencio.
      console.warn('No se pudo guardar la reserva: no hay slug de empresa asociado a esta página.')
      setSaveFailed(true)
    }
  }

  const reset = () => {
    setSelected(null)
    setEquipoMarca(null)
    setCustomRequest(false)
    setSubmitted(false)
    setError('')
    setQuery('')
    setSelectedDay(null)
    setSelectedSlot(null)
    setPayPlan(null)
    setSeñaMethod(null)
    setComprobante('')
    setRestoMethod(null)
    setDeliveryMethod(null)
    setDeliveryAddress('')
    setOrderNumber('')
    setSaveFailed(false)
    setForm({ name: '', whatsapp: '', email: '', dni: '', modelo: '', mensaje: '' })
  }

  const inputCls =
    'w-full bg-transparent border-b border-input py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors'

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-16">

        {/* Cabecera */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
              REQUISICIÓN DE PRECISIÓN
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-5">
              PRESUPUESTÁ TU <span className="text-secondary">REPARACIÓN</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Completá los pasos y recibís el presupuesto de tu equipo por WhatsApp. Todo el proceso queda reflejado en
              tu ticket de servicio.
            </p>
          </motion.div>

          {/* Raíl de proceso */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-5"
            aria-label="Progreso"
          >
            {STEPS.map((s, i) => {
              const isDone = i < stepIndex
              const isActive = i === stepIndex
              return (
                <div key={s.n} className="flex items-center gap-2" aria-current={isActive ? 'step' : undefined}>
                  <span
                    className={`flex items-center justify-center w-6 h-6 text-[10px] font-black border rounded-full ${
                      isDone
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isActive
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {isDone ? <CheckCircle size={12} /> : s.n}
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase tracking-widest ${
                      isActive ? 'text-foreground' : isDone ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </motion.div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

          {/* Columnas de pasos */}
          <div className="flex-1 min-w-0 space-y-20">

            {/* 01 EQUIPO */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">01</span>
                <h2 className="text-lg font-black text-foreground uppercase tracking-widest">QUÉ EQUIPO TENÉS</h2>
              </div>
              <div className="relative">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={valuation.placeholder}
                  className="w-full bg-transparent border-0 border-b border-border py-6 px-4 text-xl md:text-2xl font-light tracking-widest text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors duration-300"
                />
                <Search size={26} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
              </div>
            
            </section>

            {/* 02 REPARACIÓN */}
            {searchActive && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">02</span>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">ELEGÍ TU REPARACIÓN</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {matches.length > 0
                        ? `${matches.length} resultado${matches.length === 1 ? '' : 's'} para "${query.trim()}"`
                        : `No encontramos reparaciones para "${query.trim()}"`}
                    </p>
                  </div>
                </div>

                {matches.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-8 md:p-10">
                    {!customRequest ? (
                      <>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileQuestion size={22} />
                          </div>
                          <div>
                            <p className="text-base font-black text-foreground uppercase tracking-widest mb-1">
                              No encontramos <span className="text-secondary">“{query.trim()}”</span>
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Probá con el modelo de tu equipo (ej: «iPhone 10», «Samsung A54») o… si tu equipo no aparece,
                              podés reservar tu lugar y un técnico te cotiza por WhatsApp.
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <p className="text-xs font-black text-secondary uppercase tracking-widest mb-4">
                            RESERVÁ TU DIAGNÓSTICO SIN PRECIO
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="flex flex-col gap-2">
                              <label htmlFor="c-modelo" className="text-xs font-bold text-muted-foreground tracking-widest">MODELO DEL EQUIPO</label>
                              <input
                                id="c-modelo"
                                type="text"
                                placeholder="EJ: iPhone 10"
                                value={form.modelo}
                                onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))}
                                className={inputCls}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label htmlFor="c-falla" className="text-xs font-bold text-muted-foreground tracking-widest">¿QUÉ LE PASA AL EQUIPO?</label>
                              <textarea
                                id="c-falla"
                                rows={2}
                                placeholder="Describí la falla para agilizar el presupuesto…"
                                value={form.mensaje}
                                onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                                className={`${inputCls} resize-none`}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed max-w-sm flex items-center gap-2">
                              <ShieldCheck size={12} className="shrink-0 text-primary" />
                              El precio lo confirma el taller por WhatsApp. Si cambiás de opinión, podés cancelar la reserva.
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={selectCustomFromQuery}
                              className="flex items-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-8 py-4 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
                            >
                              <ArrowRight size={14} /> RESERVAR SIN PRECIO
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle size={18} className="shrink-0 text-primary" />
                        <span>
                          Vas a cotizar <strong className="text-foreground">{form.modelo}</strong> — completá tus datos abajo.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                      {matches.map((c, i) => {
                        const active = selected?.id === c.id
                        return (
                          <motion.button
                            key={c.id}
                            type="button"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.5, ease: 'easeOut' }}
                            whileHover={{ y: -3 }}
                            onClick={() => selectRepair(c)}
                            aria-pressed={active}
                            className={`text-left bg-card border rounded-xl p-7 md:p-8 transition-colors duration-300 shadow-sm ${
                              active ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Wrench size={18} className="text-primary shrink-0" />
                                <h3 className="text-lg font-black text-foreground uppercase tracking-wide">{c.nombre}</h3>
                              </div>
                              <span className="text-[10px] font-black text-secondary uppercase bg-muted px-3 py-1 border border-[color-mix(in_srgb,var(--secondary)_30%,transparent)] rounded-md">
                                {c.categoria}
                              </span>
                            </div>

                            {c.descripcion && (
                              <p className="text-sm text-muted-foreground leading-relaxed mt-4">{c.descripcion}</p>
                            )}

                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1.5">
                              {(c.marcas ?? []).map(brand => (
                                <span
                                  key={brand}
                                  className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/25 text-[10px] font-black uppercase tracking-wider text-primary"
                                >
                                  {brand}
                                </span>
                              ))}
                              {(c.modelos ?? []).slice(0, 6).map(m => (
                                <span
                                  key={`${m.marca}-${m.nombre}`}
                                  className="px-2 py-0.5 rounded-md bg-muted border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                                >
                                  {m.nombre}
                                </span>
                              ))}
                              {c.modelo && !(c.marcas?.length || c.modelos?.length) && (
                                <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
                                  Compatible: {c.modelo}
                                </span>
                              )}
                              {c.tiempo_estimado && (
                                <span className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                  <Clock size={12} /> {c.tiempo_estimado}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center border-t border-border pt-6 mt-6">
                              <div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase mb-1">ESTIMADO</p>
                                <p className="text-2xl font-black text-secondary tabular-nums">{formatARS(c.precio)}</p>
                              </div>
                              <span className={`flex items-center gap-2 text-[11px] font-black tracking-widest uppercase ${active ? 'text-primary' : 'text-primary'}`}>
                                {active ? (
                                  <><CheckCircle size={16} /> SELECCIONADA</>
                                ) : (
                                  <><ArrowRight size={16} /> ELEGIR</>
                                )}
                              </span>
                            </div>
                          </motion.button>
                        )
                      })}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-border pt-6 mt-8">
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <FileQuestion size={20} className="shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">
                            ¿NO ENCONTRÁS TU EQUIPO?
                          </p>
                          <p className="text-[13px] text-muted-foreground leading-relaxed">
                            Si tu marca o modelo no aparece publicado, reservá tu lugar sin precio y un técnico te cotiza por WhatsApp.
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={selectCustomFromQuery}
                        className="flex items-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-8 py-4 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
                      >
                        <FileQuestion size={14} /> RESERVAR SIN PRECIO
                      </motion.button>
                    </div>
                  </div>
                  </>
                )}
              </motion.section>
            )}

            {/* 03 DATOS */}
            {hasQuote && !submitted && (
              <motion.section
                id="paso-datos"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8 scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">03</span>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">TUS DATOS</h2>
                    <p className="text-sm text-muted-foreground mt-1">Te mandamos el presupuesto y el número de orden.</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-name" className="text-xs font-bold text-muted-foreground tracking-widest">NOMBRE COMPLETO *</label>
                    <input
                      id="q-name"
                      type="text"
                      placeholder="GABRIEL RODRIGUEZ"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-whatsapp" className="text-xs font-bold text-muted-foreground tracking-widest">WHATSAPP *</label>
                    <input
                      id="q-whatsapp"
                      type="tel"
                      placeholder="+54 11 0000-0000"
                      value={form.whatsapp}
                      onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-email" className="text-xs font-bold text-muted-foreground tracking-widest">CORREO (OPCIONAL)</label>
                    <input
                      id="q-email"
                      type="email"
                      placeholder="G.RODRIGUEZ@DOMINIO.COM"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-dni" className="text-xs font-bold text-muted-foreground tracking-widest">DNI / CUIL *</label>
                    <input
                      id="q-dni"
                      type="text"
                      inputMode="numeric"
                      placeholder="33.123.456"
                      value={form.dni}
                      onChange={e => setForm(p => ({ ...p, dni: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-modelo" className="text-xs font-bold text-muted-foreground tracking-widest">
                      {hasBrandChooser ? 'MARCA Y MODELO DEL EQUIPO' : 'MODELO DEL EQUIPO'}
                    </label>
                    {hasBrandChooser ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {selectedMarcas.map(brand => (
                            <button
                              key={brand}
                              type="button"
                              onClick={() => chooseBrand(brand)}
                              aria-pressed={equipoMarca === brand}
                              className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
                                equipoMarca === brand
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                              }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                        {equipoMarca && availableModels.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {availableModels.map(m => (
                              <button
                                key={`${m.marca}-${m.nombre}`}
                                type="button"
                                onClick={() => chooseModel(m.marca, m.nombre)}
                                aria-pressed={form.modelo === `${m.marca} ${m.nombre}`}
                                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
                                  form.modelo === `${m.marca} ${m.nombre}`
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                                }`}
                              >
                                {m.nombre}
                              </button>
                            ))}
                          </div>
                        )}
                        <input
                          id="q-modelo"
                          type="text"
                          placeholder="ej: Samsung Galaxy S22"
                          value={form.modelo}
                          onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))}
                          className={inputCls}
                        />
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                          {equipoMarca
                            ? `RESERVÁS PARA: ${form.modelo || equipoMarca}`
                            : 'ELEGÍ TU MARCA O ESCRIBÍ EL MODELO SI NO ESTÁ LISTADO.'}
                        </p>
                      </>
                    ) : (
                      <input
                        id="q-modelo"
                        type="text"
                        placeholder="iPhone 15 Pro Max"
                        value={form.modelo}
                        onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))}
                        className={inputCls}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="q-mensaje" className="text-xs font-bold text-muted-foreground tracking-widest">¿QUÉ LE PASA AL EQUIPO?</label>
                    <textarea
                      id="q-mensaje"
                      rows={3}
                      placeholder="Contanos el problema para agilizar el diagnóstico..."
                      value={form.mensaje}
                      onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-[12px] font-semibold text-destructive md:col-span-2">{error}</p>
                  )}

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                    <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed opacity-70 max-w-sm flex items-center gap-2">
                      <Lock size={12} className="shrink-0" />
                      Tus datos se usan solo para armar tu presupuesto.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={customRequest ? handleSubmit : goNext('paso-pago')}
                      className="flex items-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
                    >
                      {customRequest ? 'ENVIAR SOLICITUD' : 'CONTINUAR'} <ArrowRight size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* 04 PAGO */}
            {selected && !submitted && (
              <motion.section
                id="paso-pago"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8 scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">04</span>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">FORMA DE PAGO</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Elegí cómo vas a abonar tu reparación.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 md:p-12 space-y-10">
                  {/* Plan de pago */}
                  <div>
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">PLAN DE PAGO</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      El trabajo arranca con una seña por QR o transferencia: podés hacer la seña del 50% y el resto después, o pagar el total.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setPayPlan('half')}
                        aria-pressed={payPlan === 'half'}
                        className={optionCard(payPlan === 'half')}
                      >
                        {payPlan === 'half' && <SelectedCheck layoutId="payplan-check" />}
                        <Percent size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">PAGO 50% + 50%</p>
                          <p className="text-xs text-muted-foreground">Abonás la mitad como seña y el resto al retirar.</p>
                        </div>
                      </motion.button>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setPayPlan('full')}
                        aria-pressed={payPlan === 'full'}
                        className={optionCard(payPlan === 'full')}
                      >
                        {payPlan === 'full' && <SelectedCheck layoutId="payplan-check" />}
                        <CheckCircle size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">PAGO COMPLETO</p>
                          <p className="text-xs text-muted-foreground">Abonás el total del trabajo por QR o transferencia.</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Seña */}
                  <div className="border-t border-border pt-10">
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">
                      SEÑA (OBLIGATORIA) {payPlan === 'half' ? '· 50%' : payPlan === 'full' ? '· 100%' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Para iniciar el trabajo se abona una seña, solo por QR o transferencia. Ingresá el comprobante una vez realizado el pago.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.05, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSeñaMethod('qr')}
                        aria-pressed={señaMethod === 'qr'}
                        className={optionCard(señaMethod === 'qr')}
                      >
                        {señaMethod === 'qr' && <SelectedCheck layoutId="seña-check" />}
                        <QrCode size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">QR</p>
                          <p className="text-xs text-muted-foreground">Pagá escaneando el código que te mostramos al confirmar.</p>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSeñaMethod('transferencia')}
                        aria-pressed={señaMethod === 'transferencia'}
                        className={optionCard(señaMethod === 'transferencia')}
                      >
                        {señaMethod === 'transferencia' && <SelectedCheck layoutId="seña-check" />}
                        <Landmark size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">TRANSFERENCIA</p>
                          <p className="text-xs text-muted-foreground">Usá los datos de la cuenta del local.</p>
                        </div>
                      </motion.button>
                    </div>

                    {señaMethod === 'transferencia' && (checkout?.cbu || checkout?.alias || checkout?.accountNumber) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 bg-muted border border-border rounded-lg p-6 space-y-3">
                          <p className="text-[11px] font-black text-primary uppercase tracking-widest">DATOS PARA LA TRANSFERENCIA</p>
                          {checkout?.cbu && (
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">CBU</span>
                              <span className="flex items-center gap-2 font-mono text-sm text-foreground">
                                {checkout.cbu}
                                <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.cbu)} className="text-primary hover:text-primary-hover transition-colors" aria-label="Copiar CBU">
                                  <Copy size={13} />
                                </button>
                              </span>
                            </div>
                          )}
                          {checkout?.alias && (
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">ALIAS</span>
                              <span className="flex items-center gap-2 font-mono text-sm text-foreground">
                                {checkout.alias}
                                <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.alias)} className="text-primary hover:text-primary-hover transition-colors" aria-label="Copiar alias">
                                  <Copy size={13} />
                                </button>
                              </span>
                            </div>
                          )}
                          {checkout?.accountNumber && (
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">N° DE CUENTA</span>
                              <span className="flex items-center gap-2 font-mono text-sm text-foreground">
                                {checkout.accountNumber}
                                <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.accountNumber)} className="text-primary hover:text-primary-hover transition-colors" aria-label="Copiar número de cuenta">
                                  <Copy size={13} />
                                </button>
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {señaMethod && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 flex flex-col gap-2 max-w-md">
                          <label htmlFor="q-comprobante" className="text-xs font-bold text-muted-foreground tracking-widest">
                            N° DE COMPROBANTE *
                          </label>
                          <input
                            id="q-comprobante"
                            type="text"
                            placeholder="EJ: OPERACIÓN 000000123456"
                            value={comprobante}
                            onChange={e => setComprobante(e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Resto */}
                  <AnimatePresence>
                    {payPlan === 'half' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border pt-10">
                          <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">RESTO (50%)</p>
                          <p className="text-sm text-muted-foreground mb-6">
                            El saldo lo pagás al retirar el equipo. Elegí cómo: también por QR, transferencia, o en efectivo en el local.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03, y: -3 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setRestoMethod('qr')}
                              aria-pressed={restoMethod === 'qr'}
                              className={smallCard(restoMethod === 'qr')}
                            >
                              {restoMethod === 'qr' && <SelectedCheck layoutId="resto-check" size={16} />}
                              <QrCode size={20} className="shrink-0" />
                              <span className="text-sm font-black text-foreground uppercase tracking-widest">QR</span>
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03, y: -3 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setRestoMethod('transferencia')}
                              aria-pressed={restoMethod === 'transferencia'}
                              className={smallCard(restoMethod === 'transferencia')}
                            >
                              {restoMethod === 'transferencia' && <SelectedCheck layoutId="resto-check" size={16} />}
                              <Landmark size={20} className="shrink-0" />
                              <span className="text-sm font-black text-foreground uppercase tracking-widest">TRANSFERENCIA</span>
                            </motion.button>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.03, y: -3 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setRestoMethod('efectivo')}
                              aria-pressed={restoMethod === 'efectivo'}
                              className={smallCard(restoMethod === 'efectivo')}
                            >
                              {restoMethod === 'efectivo' && <SelectedCheck layoutId="resto-check" size={16} />}
                              <Banknote size={20} className="shrink-0" />
                              <span className="text-sm font-black text-foreground uppercase tracking-widest">EFECTIVO</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="border-t border-border pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    {payPlan && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <span className="text-muted-foreground">RESUMEN:</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/30 rounded-md">
                          {payPlan === 'half' ? '50% + 50%' : 'PAGO COMPLETO'}
                        </span>
                        {señaMethod && (
                          <>
                            <span className="text-muted-foreground">+</span>
                            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/30 rounded-md">
                              SEÑA · {señaMethod}
                            </span>
                          </>
                        )}
                        {payPlan === 'half' && restoMethod && (
                          <>
                            <span className="text-muted-foreground">+</span>
                            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/30 rounded-md">
                              RESTO · {restoMethod}
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={goNext('paso-entrega')}
                      className="group flex items-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
                    >
                      CONTINUAR
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight size={14} />
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* 05 ENTREGA */}
            {selected && !submitted && (
              <motion.section
                id="paso-entrega"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8 scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">05</span>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">ENTREGA DEL EQUIPO</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      ¿Cómo vas a dejar tu equipo para repararlo?
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 md:p-12 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeliveryMethod('llevar')}
                      aria-pressed={deliveryMethod === 'llevar'}
                      className={optionCard(deliveryMethod === 'llevar')}
                    >
                      <Truck size={24} className="shrink-0" />
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">LO LLEVO AL LOCAL</p>
                        <p className="text-xs text-muted-foreground">Lo dejo personalmente en el taller.</p>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeliveryMethod('retirar')}
                      aria-pressed={deliveryMethod === 'retirar'}
                      className={optionCard(deliveryMethod === 'retirar')}
                    >
                      <Car size={24} className="shrink-0" />
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">QUE LO RETIREN</p>
                        <p className="text-xs text-muted-foreground">Envían a buscar el equipo a mi domicilio{checkout?.deliveryCost ? ` (costo de envío: ${formatARS(checkout.deliveryCost)})` : ''}.</p>
                      </div>
                    </motion.button>
                  </div>

                  {deliveryMethod === 'llevar' && [contact.address, contact.city].filter(Boolean).length > 0 && (
                    <div className="bg-muted border border-border rounded-lg p-6 flex items-start gap-4">
                      <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black text-foreground mb-1 tracking-widest">DIRECCIÓN DEL LOCAL</p>
                        <p className="text-sm text-foreground">
                          {[contact.address, contact.city].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {deliveryMethod === 'retirar' && (
                    <div className="flex flex-col gap-2 max-w-md">
                      <label htmlFor="q-delivery-address" className="text-xs font-bold text-muted-foreground tracking-widest">
                        DIRECCIÓN DE RETIRO *
                      </label>
                      <input
                        id="q-delivery-address"
                        type="text"
                        placeholder="CALLE, NÚMERO, LOCALIDAD"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        className={inputCls}
                      />
                      {checkout?.deliveryCost ? (
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          COSTO DE ENVÍO: {formatARS(checkout.deliveryCost)}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div className="border-t border-border pt-10 flex justify-end">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext('paso-turno')}
                      className="flex items-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
                    >
                      CONTINUAR <ArrowRight size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* 06 TURNO */}
            {selected && !submitted && (
              <motion.section
                id="paso-turno"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8 scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">06</span>
                  <div>
                    <h2 className="text-lg font-black text-foreground uppercase tracking-widest">ELEGÍ TU TURNO</h2>
                    <p className="text-sm text-muted-foreground mt-1">Opcional — si preferís, podés elegirlo después.</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Calendario */}
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <button
                          type="button"
                          disabled={viewMonth.year === today.getFullYear() && viewMonth.month === today.getMonth()}
                          onClick={() =>
                            setViewMonth(m => {
                              const nm = (m.month - 1 + 12) % 12
                              const year = nm === 11 ? m.year - 1 : m.year
                              return { year, month: nm }
                            })
                          }
                          className={`flex items-center justify-center w-9 h-9 border rounded-md transition-colors ${
                            viewMonth.year === today.getFullYear() && viewMonth.month === today.getMonth()
                              ? 'border-border text-muted-foreground opacity-60 cursor-not-allowed'
                              : 'border-border text-foreground hover:border-primary hover:text-primary'
                          }`}
                          aria-label="Mes anterior"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <p className="text-sm font-black text-foreground uppercase tracking-widest">
                          {MONTHS_ES[viewMonth.month]} {viewMonth.year}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setViewMonth(m => {
                              const nm = (m.month + 1) % 12
                              const year = nm === 0 ? m.year + 1 : m.year
                              return { year, month: nm }
                            })
                          }
                          className="flex items-center justify-center w-9 h-9 border border-border text-foreground hover:border-primary hover:text-primary rounded-md transition-colors"
                          aria-label="Mes siguiente"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {DAYS.map(d => (
                          <span key={d} className="text-[10px] font-bold text-muted-foreground py-2 tracking-widest">{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                          if (day === null) return <div key={`e-${idx}`} />
                          const date = new Date(viewMonth.year, viewMonth.month, day)
                          const isToday = today.getTime() === date.getTime()
                          const isPast = date.getTime() < today.getTime()
                          const isWeekend = !scheduleInfo.businessDays.includes(date.getDay())
                          const notOpen = isPast || isWeekend
                          const isSelected = selectedDay != null && selectedDay.getTime() === date.getTime()
                          return (
                            <motion.button
                              key={`${viewMonth.year}-${viewMonth.month}-${day}`}
                              disabled={notOpen}
                              whileHover={!notOpen ? { scale: 1.1 } : undefined}
                              whileTap={!notOpen ? { scale: 0.92 } : undefined}
                              onClick={() => {
                                setSelectedDay(date)
                                setSelectedSlot(null)
                              }}
                              aria-pressed={isSelected}
                              aria-current={isToday ? 'date' : undefined}
                              className={`relative min-h-11 py-3 text-sm font-semibold rounded-md transition-all ${
                                notOpen
                                  ? 'text-muted-foreground opacity-50 line-through decoration-border cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-primary/20 border border-primary text-primary shadow-[inset_0_-3px_0_0_var(--primary)]'
                                  : isToday
                                  ? 'border border-primary/60 text-primary hover:bg-primary/10 hover:text-primary'
                                  : 'text-muted-foreground hover:text-primary'
                              }`}
                            >
                              {day}
                              {isToday && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>

                      <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                        {businessDaysLabel(scheduleInfo.businessDays)} · {hoursLabel(scheduleInfo.openMin, scheduleInfo.closeMin)}
                      </p>
                    </div>

                    {/* Horarios */}
                    <div className="border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-10">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                        {selectedDay
                          ? `${selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}`
                          : 'ELEGÍ UN DÍA PRIMERO'}
                      </p>

                      {selectedDay == null ? (
                        <div className="border border-dashed border-border rounded-lg p-6 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Seleccioná una fecha disponible para ver los horarios.</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{businessDaysLabel(scheduleInfo.businessDays)} · {hoursLabel(scheduleInfo.openMin, scheduleInfo.closeMin)}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {businessSlots.map((time, i) => {
                            const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
                            const isTodaySlot = selectedDay.getTime() === today.getTime()
                            const passedToday = isTodaySlot && toMinute(time) <= nowMin
                            const disabled = !scheduleInfo.businessDays.includes(selectedDay.getDay()) || passedToday
                            const active = selectedSlot === time
                            return (
                              <motion.button
                                key={time}
                                type="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
                                whileHover={!disabled ? { scale: 1.02, y: -2 } : undefined}
                                whileTap={!disabled ? { scale: 0.98 } : undefined}
                                disabled={disabled}
                                onClick={() => !disabled && setSelectedSlot(time)}
                                aria-pressed={active}
                                className={`relative p-4 border rounded-lg flex items-center justify-between transition-colors ${
                                  disabled
                                    ? 'border-border opacity-40 cursor-not-allowed'
                                    : active
                                    ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                                    : 'border-border bg-card text-foreground hover:border-primary hover:bg-muted'
                                }`}
                              >
                                <span className="text-sm font-semibold tabular-nums">{time}</span>
                                {active ? (
                                  <motion.span
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                                  >
                                    <CheckCircle size={14} />
                                  </motion.span>
                                ) : !disabled ? (
                                  <span className="w-2 h-2 bg-primary/40 rounded-full" />
                                ) : null}
                              </motion.button>
                            )
                          })}
                        </div>
                      )}

                      {selectedDay && selectedSlot && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="mt-6 bg-muted border border-border rounded-lg p-5 flex items-start gap-4"
                        >
                          <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-black text-foreground mb-1 uppercase tracking-widest">TURNO CONFIRMADO</p>
                            <p className="text-sm text-foreground capitalize">
                              {selectedDay.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} · {selectedSlot}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* 07 ENVÍO */}
            {hasQuote && submitted && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-10 md:p-14 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-2xl mb-8"
                >
                  <CheckCircle size={30} />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-widest mb-3">
                  ¡SOLICITUD ENVIADA!
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
                  Abrimos tu WhatsApp con el pedido armado. Si no se abrió, tocá el botón de abajo y te respondemos a la
                  brevedad.
                </p>
                {orderNumber && (
                  <div className="inline-flex flex-col items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-8 py-5 mb-8">
                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Tu número de orden</p>
                    <p className="text-xl md:text-2xl font-black text-primary tabular-nums tracking-tight">{orderNumber}</p>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      Guardalo para hacer el seguimiento de tu reparación.
                    </p>
                  </div>
                )}
                {!orderNumber && submitted && saveFailed && (
                  <div role="alert" className="mx-auto max-w-md bg-destructive/10 border border-destructive/30 rounded-xl px-6 py-5 mb-8 text-left">
                    <p className="text-[12px] font-black text-destructive uppercase tracking-widest mb-1">
                      No pudimos registrar tu reserva automáticamente
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Mandanos el pedido por WhatsApp (tocá el botón de abajo) y te confirmamos la reserva a la brevedad.
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {orderNumber && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={`/presupuesto/seguimiento?order=${encodeURIComponent(orderNumber)}`}
                      className="flex items-center justify-center gap-2 border border-primary text-primary text-[11px] font-black px-8 py-4 tracking-widest uppercase hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Search size={14} /> SEGUIR MI ORDEN
                    </motion.a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => quote && window.open(buildWhatsAppUrl(quote), '_blank')}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-[11px] font-black px-8 py-4 tracking-widest uppercase hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
                  >
                    <Send size={14} /> REENVIAR POR WHATSAPP
                  </motion.button>
                </div>
                <button
                  onClick={reset}
                  className="mt-8 text-xs font-black text-muted-foreground hover:text-secondary uppercase tracking-widest transition-colors"
                >
                  + Generar otro presupuesto
                </button>
              </motion.section>
            )}
          </div>

          {/* Ticket en vivo */}
          <aside className="w-full lg:w-[380px] xl:w-[420px]">
            <div className="sticky top-28 space-y-6" ref={ticketRef}>
              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="bg-card border border-border rounded-xl"
              >
                <div className="border-b border-border px-7 py-5 flex items-center justify-between">
                  <p className="text-[11px] font-black text-foreground uppercase tracking-widest">TICKET DE SERVICIO</p>
                  {quote && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest tabular-nums">
                      {quote.precio != null ? `EST: ${formatARS(quote.precio)}` : 'EST: A CONFIRMAR'}
                    </span>
                  )}
                </div>

                {quote ? (
                  <div className="px-7 py-7">
                    <div className="flex items-center gap-3 mb-5">
                      <Wrench size={16} className="text-primary shrink-0" />
                      <h3 className="text-base font-black text-foreground uppercase tracking-wide">{quote.nombre}</h3>
                    </div>
                    <div className="space-y-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {quote.categoria && (
                        <p className="flex justify-between gap-4"><span>Categoría</span><span className="text-foreground text-right">{quote.categoria}</span></p>
                      )}
{form.modelo.trim() && (
  <p className="flex justify-between gap-4"><span>Equipo</span><span className="text-foreground text-right">{form.modelo}</span></p>
)}
                      {quote.tiempo_estimado && (
                        <p className="flex justify-between gap-4"><span>Tiempo</span><span className="text-foreground text-right">{quote.tiempo_estimado}</span></p>
                      )}
                      {selectedDay != null && selectedSlot && (
                        <p className="flex justify-between gap-4"><span>Turno</span><span className="text-foreground text-right">{(selectedDay as Date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} · {selectedSlot}</span></p>
                      )}
                      {payPlan && (
                        <p className="flex justify-between gap-4"><span>Plan de pago</span><span className="text-foreground text-right">{payPlan === 'half' ? '50% + 50%' : 'Pago completo'}</span></p>
                      )}
                      {señaMethod && (
                        <p className="flex justify-between gap-4"><span>Seña</span><span className="text-foreground text-right">{señaMethod === 'qr' ? 'QR' : 'Transferencia'}</span></p>
                      )}
                      {comprobante.trim() && (
                        <p className="flex justify-between gap-4"><span>Comprobante</span><span className="text-foreground text-right break-all">{comprobante.trim().toUpperCase()}</span></p>
                      )}
                      {payPlan === 'half' && restoMethod && (
                        <p className="flex justify-between gap-4"><span>Resto</span><span className="text-foreground text-right">{restoMethod === 'qr' ? 'QR' : restoMethod === 'transferencia' ? 'Transferencia' : 'Efectivo en el local'}</span></p>
                      )}
                      {deliveryMethod === 'llevar' && (
                        <p className="flex justify-between gap-4"><span>Entrega</span><span className="text-foreground text-right">Lo llevo al local</span></p>
                      )}
                      {deliveryMethod === 'retirar' && (
                        <p className="flex justify-between gap-4"><span>Entrega</span><span className="text-foreground text-right break-all">Retiran — {deliveryAddress.trim() || 'dirección pendiente'}</span></p>
                      )}
                      {deliveryMethod === 'retirar' && checkout?.deliveryCost ? (
                        <p className="flex justify-between gap-4"><span>Envío</span><span className="text-foreground text-right">{formatARS(checkout.deliveryCost)}</span></p>
                      ) : null}
                    </div>
                    <div className="mt-6 pt-6 border-t border-border flex items-end justify-between">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Costo estimado</span>
                      <span className="text-2xl font-black text-primary tabular-nums">
                        {quote.precio != null ? formatARS(quote.precio) : quote.priceLabel ?? '—'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-7 py-10 text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      TODAVÍA NO ELEGISTE
                    </p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed opacity-80">
                      Buscá tu equipo y seleccioná una reparación para armar tu ticket.
                    </p>
                  </div>
                )}

                <div className="border-t border-border px-7 py-5">
                  {quote && !submitted ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-[11px] font-black py-5 tracking-[0.25em] uppercase hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
                    >
                      <Send size={14} /> {loading ? 'SOLICITANDO...' : 'SOLICITAR PRESUPUESTO'}
                    </motion.button>
                  ) : (
                    <p className="text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                      {submitted ? 'Pedido confirmado' : 'Completá el proceso para continuar'}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
                className="bg-card border border-border rounded-xl p-7 flex items-start gap-4"
              >
                <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-black text-foreground mb-1 tracking-widest">PRESUPUESTO SIN CARGO</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    El valor final se confirma tras la inspección técnica del equipo.
                  </p>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
