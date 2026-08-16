import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, Wrench, ArrowRight, CheckCircle, Send, ShieldCheck, LockKeyhole, QrCode, Landmark, Banknote, Truck, Car, MapPin, Copy, Percent, Check } from 'lucide-react'
import { useTenant } from '../context/TenantContext'
import { resolveTenantSlug, fetchRepairCosts, savePendingQuote, type TenantQuoteSelection } from '../lib/tenant'
import type { TenantRepairCost } from '../config/tenant.types'

function formatARS(n: number): string {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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
const SLOTS = [
  { time: '09:00', avail: true },
  { time: '10:30', avail: true },
  { time: '12:00', avail: true },
  { time: '14:00', avail: false },
  { time: '15:30', avail: true },
  { time: '17:00', avail: true },
]
const CAL_DAYS: (number | null)[] = [
  null, null, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18,
]

export default function ValuationPage() {
  const tenant = useTenant()
  const { valuation, contact, checkout } = tenant
  const [query, setQuery] = useState('')
  const [repairCosts, setRepairCosts] = useState<TenantRepairCost[]>([])
  const [selected, setSelected] = useState<TenantRepairCost | null>(null)
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', modelo: '', mensaje: '' })
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [payPlan, setPayPlan] = useState<'half' | 'full' | null>(null)
  const [señaMethod, setSeñaMethod] = useState<'qr' | 'transferencia' | null>(null)
  const [comprobante, setComprobante] = useState('')
  const [restoMethod, setRestoMethod] = useState<'qr' | 'transferencia' | 'efectivo' | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<'llevar' | 'retirar' | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slug = resolveTenantSlug()
    if (!slug) return
    let cancelled = false
    fetchRepairCosts(slug)
      .then(list => {
        if (!cancelled) setRepairCosts(list)
      })
      .catch(() => {})
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
        const hay = normalize(
          [c.nombre, c.categoria, c.descripcion ?? '', c.modelo ?? '', c.tiempo_estimado ?? ''].join(' '),
        )
        const score = tokens.filter(t => hay.includes(t)).length
        const isGeneric = !c.modelo?.trim()
        return { c, score, isGeneric, matches: score > 0 || isGeneric }
      })
      .filter(m => m.matches)
      .sort((a, b) => b.score - a.score || a.c.categoria.localeCompare(b.c.categoria))
      .map(m => m.c)
  }, [repairCosts, tokens])

  const searchActive = tokens.length > 0

  const stepIndex = submitted ? 6 : selected ? 2 : searchActive ? 1 : 0

  const selectRepair = (c: TenantRepairCost) => {
    setSelected(c)
    setSubmitted(false)
    setError('')
    setForm(p => ({ ...p, modelo: c.modelo ?? '' }))
    savePendingQuote({
      nombre: c.nombre,
      categoria: c.categoria,
      modelo: c.modelo,
      tiempo_estimado: c.tiempo_estimado,
      descripcion: c.descripcion,
      precio: c.precio,
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
      ...(selectedDay != null && selectedSlot ? [`\n• Turno solicitado: día ${selectedDay} a las ${selectedSlot}.`] : []),
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
        tiempo_estimado: selected.tiempo_estimado,
        descripcion: selected.descripcion,
        precio: selected.precio,
      }
    : null

  const handleSubmit = async () => {
    if (!quote) return
    if (!form.name.trim() || !form.whatsapp.trim()) {
      setError('Completá tu nombre y tu WhatsApp para enviar la solicitud.')
      return
    }
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
    setError('')
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 700))
    setLoading(false)
    setSubmitted(true)
    window.open(buildWhatsAppUrl(quote), '_blank')
  }

  const reset = () => {
    setSelected(null)
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
    setForm({ name: '', whatsapp: '', email: '', modelo: '', mensaje: '' })
  }

  const inputCls =
    'w-full bg-transparent border-b border-outline py-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container transition-colors'

  return (
    <main className="cyber-grid min-h-screen">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16">

        {/* Cabecera */}
        <section className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
              REQUISICIÓN DE PRECISIÓN
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tight mb-5">
              PRESUPUESTÁ TU <span className="text-secondary">REPARACIÓN</span>
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Completá los pasos y recibís el presupuesto de tu equipo por WhatsApp. Todo el proceso queda reflejado en
              tu ticket de servicio.
            </p>
          </motion.div>

          {/* Raíl de proceso */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-outline-variant pb-5"
            aria-label="Progreso"
          >
            {STEPS.map((s, i) => {
              const isDone = i < stepIndex
              const isActive = i === stepIndex
              return (
                <div key={s.n} className="flex items-center gap-2" aria-current={isActive ? 'step' : undefined}>
                  <span
                    className={`flex items-center justify-center w-6 h-6 text-[10px] font-black border ${
                      isDone
                        ? 'bg-primary-container border-primary-container text-on-primary-container'
                        : isActive
                        ? 'border-primary-container text-primary'
                        : 'border-outline text-on-surface-variant/50'
                    }`}
                  >
                    {isDone ? <CheckCircle size={12} /> : s.n}
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase tracking-widest ${
                      isActive ? 'text-on-surface' : isDone ? 'text-primary' : 'text-on-surface-variant/50'
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
                <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">01</span>
                <h2 className="text-lg font-black uppercase tracking-widest">QUÉ EQUIPO TENÉS</h2>
              </div>
              <div className="relative">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={valuation.placeholder}
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-6 px-4 text-xl md:text-2xl font-light tracking-widest text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary-container transition-colors duration-300"
                />
                <Search size={26} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
              </div>
              {valuation.suggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">SUGERENCIAS:</span>
                  {valuation.suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="text-xs font-bold text-on-surface hover:text-primary transition-colors uppercase tracking-wider border border-outline-variant px-3 py-1.5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* 02 REPARACIÓN */}
            {searchActive && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">02</span>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest">ELEGÍ TU REPARACIÓN</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {matches.length > 0
                        ? `${matches.length} resultado${matches.length === 1 ? '' : 's'} para "${query.trim()}"`
                        : `No encontramos reparaciones para "${query.trim()}"`}
                    </p>
                  </div>
                </div>

                {matches.length === 0 ? (
                  <div className="bg-surface-container border border-outline-variant p-8 md:p-10">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Probá con el modelo de tu equipo (ej: “iPhone 10”, “Samsung A54”) o con el nombre de la reparación
                      (ej: “cambio de pantalla”, “pin de carga”).
                    </p>
                  </div>
                ) : (
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
                            className={`text-left bg-surface-container-lowest border p-7 md:p-8 transition-colors duration-300 shadow-2xl ${
                              active ? 'border-primary-container shadow-primary-container/20' : 'border-outline-variant hover:border-primary'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Wrench size={18} className="text-primary shrink-0" />
                                <h3 className="text-lg font-black text-on-surface uppercase tracking-wide">{c.nombre}</h3>
                              </div>
                              <span className="text-[10px] font-black text-secondary uppercase bg-surface/70 px-3 py-1 border border-secondary/30">
                                {c.categoria}
                              </span>
                            </div>

                            {c.descripcion && (
                              <p className="text-sm text-on-surface-variant leading-relaxed mt-4">{c.descripcion}</p>
                            )}

                            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1.5">
                              {c.modelo && (
                                <span className="text-[11px] font-semibold text-on-surface uppercase tracking-wide">
                                  Compatible: {c.modelo}
                                </span>
                              )}
                              {c.tiempo_estimado && (
                                <span className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                                  <Clock size={12} /> {c.tiempo_estimado}
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center border-t border-outline-variant pt-6 mt-6">
                              <div>
                                <p className="text-[11px] font-bold text-on-surface-variant uppercase mb-1">ESTIMADO</p>
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
                )}
              </motion.section>
            )}

            {/* 03 DATOS */}
            {selected && !submitted && (
              <motion.section
                id="paso-datos"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8 scroll-mt-28"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">03</span>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest">TUS DATOS</h2>
                    <p className="text-sm text-on-surface-variant mt-1">Te mandamos el presupuesto y el número de orden.</p>
                  </div>
                </div>

                <div className="bg-surface-container border border-outline-variant p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="q-name" className="text-xs font-bold text-on-surface-variant tracking-widest">NOMBRE COMPLETO *</label>
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
                    <label htmlFor="q-whatsapp" className="text-xs font-bold text-on-surface-variant tracking-widest">WHATSAPP *</label>
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
                    <label htmlFor="q-email" className="text-xs font-bold text-on-surface-variant tracking-widest">CORREO (OPCIONAL)</label>
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
                    <label htmlFor="q-modelo" className="text-xs font-bold text-on-surface-variant tracking-widest">MODELO DEL EQUIPO</label>
                    <input
                      id="q-modelo"
                      type="text"
                      placeholder="iPhone 15 Pro Max"
                      value={form.modelo}
                      onChange={e => setForm(p => ({ ...p, modelo: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="q-mensaje" className="text-xs font-bold text-on-surface-variant tracking-widest">¿QUÉ LE PASA AL EQUIPO?</label>
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
                    <p role="alert" className="text-[12px] font-semibold text-red-400 md:col-span-2">{error}</p>
                  )}

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                    <p className="text-[10px] font-semibold text-on-surface-variant leading-relaxed opacity-70 max-w-sm flex items-center gap-2">
                      <LockKeyhole size={12} className="shrink-0" />
                      Tus datos se usan solo para armar tu presupuesto.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext('paso-pago')}
                      className="flex items-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-secondary-container transition-colors"
                    >
                      CONTINUAR <ArrowRight size={14} />
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
                  <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">04</span>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest">FORMA DE PAGO</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Elegí cómo vas a abonar tu reparación.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container border border-outline-variant p-8 md:p-12 space-y-10">
                  {/* Plan de pago */}
                  <div>
                    <p className="text-[11px] font-black text-secondary uppercase tracking-widest mb-1">PLAN DE PAGO</p>
                    <p className="text-sm text-on-surface-variant mb-6">
                      El trabajo arranca con una seña por QR o transferencia: podés hacer la seña del 50% y el resto después, o pagar el total.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPayPlan('half')}
                        aria-pressed={payPlan === 'half'}
                        className={`flex items-center gap-4 p-6 border text-left transition-all ${
                          payPlan === 'half'
                            ? 'border-primary-container bg-primary-container/10 text-primary'
                            : 'border-outline-variant text-on-surface hover:border-primary'
                        }`}
                      >
                        <Percent size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest mb-1">PAGO 50% + 50%</p>
                          <p className="text-xs text-on-surface-variant">Abonás la mitad como seña y el resto al retirar.</p>
                        </div>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPayPlan('full')}
                        aria-pressed={payPlan === 'full'}
                        className={`flex items-center gap-4 p-6 border text-left transition-all ${
                          payPlan === 'full'
                            ? 'border-primary-container bg-primary-container/10 text-primary'
                            : 'border-outline-variant text-on-surface hover:border-primary'
                        }`}
                      >
                        <CheckCircle size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest mb-1">PAGO COMPLETO</p>
                          <p className="text-xs text-on-surface-variant">Abonás el total del trabajo por QR o transferencia.</p>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Seña */}
                  <div className="border-t border-outline-variant pt-10">
                    <p className="text-[11px] font-black text-secondary uppercase tracking-widest mb-1">
                      SEÑA (OBLIGATORIA) {payPlan === 'half' ? '· 50%' : payPlan === 'full' ? '· 100%' : ''}
                    </p>
                    <p className="text-sm text-on-surface-variant mb-6">
                      Para iniciar el trabajo se abona una seña, solo por QR o transferencia. Ingresá el comprobante una vez realizado el pago.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSeñaMethod('qr')}
                        aria-pressed={señaMethod === 'qr'}
                        className={`flex items-center gap-4 p-6 border text-left transition-all ${
                          señaMethod === 'qr'
                            ? 'border-primary-container bg-primary-container/10 text-primary'
                            : 'border-outline-variant text-on-surface hover:border-primary'
                        }`}
                      >
                        <QrCode size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest mb-1">QR</p>
                          <p className="text-xs text-on-surface-variant">Pagá escaneando el código que te mostramos al confirmar.</p>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSeñaMethod('transferencia')}
                        aria-pressed={señaMethod === 'transferencia'}
                        className={`flex items-center gap-4 p-6 border text-left transition-all ${
                          señaMethod === 'transferencia'
                            ? 'border-primary-container bg-primary-container/10 text-primary'
                            : 'border-outline-variant text-on-surface hover:border-primary'
                        }`}
                      >
                        <Landmark size={24} className="shrink-0" />
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest mb-1">TRANSFERENCIA</p>
                          <p className="text-xs text-on-surface-variant">Usá los datos de la cuenta del local.</p>
                        </div>
                      </motion.button>
                    </div>

                    {señaMethod === 'transferencia' && (checkout?.cbu || checkout?.alias || checkout?.accountNumber) && (
                      <div className="mt-6 bg-surface-container-lowest border border-outline-variant p-6 space-y-3">
                        <p className="text-[11px] font-black text-secondary uppercase tracking-widest">DATOS PARA LA TRANSFERENCIA</p>
                        {checkout?.cbu && (
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">CBU</span>
                            <span className="flex items-center gap-2 font-mono text-sm text-on-surface">
                              {checkout.cbu}
                              <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.cbu)} className="text-primary hover:text-secondary transition-colors" aria-label="Copiar CBU">
                                <Copy size={13} />
                              </button>
                            </span>
                          </div>
                        )}
                        {checkout?.alias && (
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">ALIAS</span>
                            <span className="flex items-center gap-2 font-mono text-sm text-on-surface">
                              {checkout.alias}
                              <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.alias)} className="text-primary hover:text-secondary transition-colors" aria-label="Copiar alias">
                                <Copy size={13} />
                              </button>
                            </span>
                          </div>
                        )}
                        {checkout?.accountNumber && (
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">N° DE CUENTA</span>
                            <span className="flex items-center gap-2 font-mono text-sm text-on-surface">
                              {checkout.accountNumber}
                              <button type="button" onClick={() => navigator.clipboard?.writeText(checkout.accountNumber)} className="text-primary hover:text-secondary transition-colors" aria-label="Copiar número de cuenta">
                                <Copy size={13} />
                              </button>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {señaMethod && (
                      <div className="mt-6 flex flex-col gap-2 max-w-md">
                        <label htmlFor="q-comprobante" className="text-xs font-bold text-on-surface-variant tracking-widest">
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
                    )}
                  </div>

                  {/* Resto */}
                  {payPlan === 'half' && (
                    <div className="border-t border-outline-variant pt-10">
                      <p className="text-[11px] font-black text-secondary uppercase tracking-widest mb-1">RESTO (50%)</p>
                      <p className="text-sm text-on-surface-variant mb-6">
                        El saldo lo pagás al retirar el equipo. Elegí cómo: también por QR, transferencia, o en efectivo en el local.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRestoMethod('qr')}
                          aria-pressed={restoMethod === 'qr'}
                          className={`flex items-center gap-3 p-5 border text-left transition-all ${
                            restoMethod === 'qr'
                              ? 'border-primary-container bg-primary-container/10 text-primary'
                              : 'border-outline-variant text-on-surface hover:border-primary'
                          }`}
                        >
                          <QrCode size={20} className="shrink-0" />
                          <span className="text-sm font-black uppercase tracking-widest">QR</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRestoMethod('transferencia')}
                          aria-pressed={restoMethod === 'transferencia'}
                          className={`flex items-center gap-3 p-5 border text-left transition-all ${
                            restoMethod === 'transferencia'
                              ? 'border-primary-container bg-primary-container/10 text-primary'
                              : 'border-outline-variant text-on-surface hover:border-primary'
                          }`}
                        >
                          <Landmark size={20} className="shrink-0" />
                          <span className="text-sm font-black uppercase tracking-widest">TRANSFERENCIA</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRestoMethod('efectivo')}
                          aria-pressed={restoMethod === 'efectivo'}
                          className={`flex items-center gap-3 p-5 border text-left transition-all ${
                            restoMethod === 'efectivo'
                              ? 'border-primary-container bg-primary-container/10 text-primary'
                              : 'border-outline-variant text-on-surface hover:border-primary'
                          }`}
                        >
                          <Banknote size={20} className="shrink-0" />
                          <span className="text-sm font-black uppercase tracking-widest">EFECTIVO</span>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-outline-variant pt-10 flex justify-end">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext('paso-entrega')}
                      className="flex items-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-secondary-container transition-colors"
                    >
                      CONTINUAR <ArrowRight size={14} />
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
                  <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">05</span>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest">ENTREGA DEL EQUIPO</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      ¿Cómo vas a dejar tu equipo para repararlo?
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container border border-outline-variant p-8 md:p-12 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeliveryMethod('llevar')}
                      aria-pressed={deliveryMethod === 'llevar'}
                      className={`flex items-center gap-4 p-6 border text-left transition-all ${
                        deliveryMethod === 'llevar'
                          ? 'border-primary-container bg-primary-container/10 text-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary'
                      }`}
                    >
                      <Truck size={24} className="shrink-0" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest mb-1">LO LLEVO AL LOCAL</p>
                        <p className="text-xs text-on-surface-variant">Lo dejo personalmente en el taller.</p>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeliveryMethod('retirar')}
                      aria-pressed={deliveryMethod === 'retirar'}
                      className={`flex items-center gap-4 p-6 border text-left transition-all ${
                        deliveryMethod === 'retirar'
                          ? 'border-primary-container bg-primary-container/10 text-primary'
                          : 'border-outline-variant text-on-surface hover:border-primary'
                      }`}
                    >
                      <Car size={24} className="shrink-0" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest mb-1">QUE LO RETIREN</p>
                        <p className="text-xs text-on-surface-variant">Envían a buscar el equipo a mi domicilio{checkout?.deliveryCost ? ` (costo de envío: ${formatARS(checkout.deliveryCost)})` : ''}.</p>
                      </div>
                    </motion.button>
                  </div>

                  {deliveryMethod === 'llevar' && [contact.address, contact.city].filter(Boolean).length > 0 && (
                    <div className="bg-surface-container-lowest border border-outline-variant p-6 flex items-start gap-4">
                      <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black text-on-surface mb-1 tracking-widest">DIRECCIÓN DEL LOCAL</p>
                        <p className="text-sm text-on-surface">
                          {[contact.address, contact.city].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {deliveryMethod === 'retirar' && (
                    <div className="flex flex-col gap-2 max-w-md">
                      <label htmlFor="q-delivery-address" className="text-xs font-bold text-on-surface-variant tracking-widest">
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
                        <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                          COSTO DE ENVÍO: {formatARS(checkout.deliveryCost)}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div className="border-t border-outline-variant pt-10 flex justify-end">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goNext('paso-turno')}
                      className="flex items-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-black px-10 py-5 tracking-[0.25em] uppercase hover:bg-secondary-container transition-colors"
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
                  <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">06</span>
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-widest">ELEGÍ TU TURNO</h2>
                    <p className="text-sm text-on-surface-variant mt-1">Opcional — si preferís, podés elegirlo después.</p>
                  </div>
                </div>

                <div className="bg-surface-container border border-outline-variant p-8 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Calendario */}
                    <div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {DAYS.map(d => (
                          <span key={d} className="text-[10px] font-bold text-outline py-2 tracking-widest">{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {CAL_DAYS.map((day, idx) =>
                          day === null ? (
                            <div key={`e-${idx}`} />
                          ) : (
                            <motion.button
                              key={day}
                              whileHover={{ scale: 1.1 }}
                              onClick={() => setSelectedDay(day)}
                              className={`min-h-11 py-3 text-sm font-semibold rounded-sm transition-all ${
                                selectedDay === day
                                  ? 'bg-primary-container/20 border border-primary-container text-primary'
                                  : 'text-on-surface-variant hover:text-secondary'
                              }`}
                            >
                              {day}
                            </motion.button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Horarios */}
                    <div className="border-t lg:border-t-0 lg:border-l border-outline-variant pt-6 lg:pt-0 lg:pl-10">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                        {selectedDay ? `DÍA ${selectedDay} — DISPONIBLES` : 'ELEGÍ UN DÍA PRIMERO'}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {SLOTS.map(s => {
                          const disabled = !s.avail || selectedDay == null
                          const active = selectedSlot === s.time
                          return (
                            <motion.button
                              key={s.time}
                              type="button"
                              whileHover={!disabled ? { scale: 1.02 } : undefined}
                              whileTap={!disabled ? { scale: 0.98 } : undefined}
                              disabled={disabled}
                              onClick={() => !disabled && setSelectedSlot(s.time)}
                              className={`p-4 border flex items-center justify-between transition-all ${
                                disabled
                                  ? 'border-outline opacity-40 cursor-not-allowed'
                                  : active
                                  ? 'border-primary-container bg-primary-container/10 text-primary'
                                  : 'border-outline text-on-surface hover:border-primary-container'
                              }`}
                            >
                              <span className="text-sm font-semibold tabular-nums">{s.time}</span>
                              {!s.avail ? (
                                <span className="text-[10px] font-bold">OCUPADO</span>
                              ) : active ? (
                                <CheckCircle size={14} />
                              ) : (
                                <span className="w-2 h-2 bg-secondary-fixed-dim rounded-full" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* 07 ENVÍO */}
            {selected && submitted && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-surface-container border border-primary-container p-10 md:p-14 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-56 h-56 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary-container text-on-primary-container mb-8"
                >
                  <CheckCircle size={30} />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-black text-on-surface uppercase tracking-widest mb-3">
                  ¡SOLICITUD ENVIADA!
                </h2>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed mb-8">
                  Abrimos tu WhatsApp con el pedido armado. Si no se abrió, tocá el botón de abajo y te respondemos a la
                  brevedad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => quote && window.open(buildWhatsAppUrl(quote), '_blank')}
                    className="flex items-center justify-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-black px-8 py-4 tracking-widest uppercase hover:bg-secondary-container transition-colors"
                  >
                    <Send size={14} /> REENVIAR POR WHATSAPP
                  </motion.button>
                </div>
                <button
                  onClick={reset}
                  className="mt-8 text-xs font-black text-on-surface-variant hover:text-secondary uppercase tracking-widest transition-colors"
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
                className="bg-surface-container border border-outline-variant"
              >
                <div className="border-b border-outline-variant px-7 py-5 flex items-center justify-between">
                  <p className="text-[11px] font-black text-on-surface uppercase tracking-widest">TICKET DE SERVICIO</p>
                  {quote && (
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest tabular-nums">
                      EST: {formatARS(quote.precio ?? 0)}
                    </span>
                  )}
                </div>

                {quote ? (
                  <div className="px-7 py-7">
                    <div className="flex items-center gap-3 mb-5">
                      <Wrench size={16} className="text-primary shrink-0" />
                      <h3 className="text-base font-black text-on-surface uppercase tracking-wide">{quote.nombre}</h3>
                    </div>
                    <div className="space-y-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {quote.categoria && (
                        <p className="flex justify-between gap-4"><span>Categoría</span><span className="text-on-surface text-right">{quote.categoria}</span></p>
                      )}
                      {quote.modelo && (
                        <p className="flex justify-between gap-4"><span>Modelo</span><span className="text-on-surface text-right">{quote.modelo}</span></p>
                      )}
                      {quote.tiempo_estimado && (
                        <p className="flex justify-between gap-4"><span>Tiempo</span><span className="text-on-surface text-right">{quote.tiempo_estimado}</span></p>
                      )}
                      {selectedDay != null && selectedSlot && (
                        <p className="flex justify-between gap-4"><span>Turno</span><span className="text-on-surface text-right">Día {selectedDay} · {selectedSlot}</span></p>
                      )}
                      {payPlan && (
                        <p className="flex justify-between gap-4"><span>Plan de pago</span><span className="text-on-surface text-right">{payPlan === 'half' ? '50% + 50%' : 'Pago completo'}</span></p>
                      )}
                      {señaMethod && (
                        <p className="flex justify-between gap-4"><span>Seña</span><span className="text-on-surface text-right">{señaMethod === 'qr' ? 'QR' : 'Transferencia'}</span></p>
                      )}
                      {comprobante.trim() && (
                        <p className="flex justify-between gap-4"><span>Comprobante</span><span className="text-on-surface text-right break-all">{comprobante.trim().toUpperCase()}</span></p>
                      )}
                      {payPlan === 'half' && restoMethod && (
                        <p className="flex justify-between gap-4"><span>Resto</span><span className="text-on-surface text-right">{restoMethod === 'qr' ? 'QR' : restoMethod === 'transferencia' ? 'Transferencia' : 'Efectivo en el local'}</span></p>
                      )}
                      {deliveryMethod === 'llevar' && (
                        <p className="flex justify-between gap-4"><span>Entrega</span><span className="text-on-surface text-right">Lo llevo al local</span></p>
                      )}
                      {deliveryMethod === 'retirar' && (
                        <p className="flex justify-between gap-4"><span>Entrega</span><span className="text-on-surface text-right break-all">Retiran — {deliveryAddress.trim() || 'dirección pendiente'}</span></p>
                      )}
                      {deliveryMethod === 'retirar' && checkout?.deliveryCost ? (
                        <p className="flex justify-between gap-4"><span>Envío</span><span className="text-on-surface text-right">{formatARS(checkout.deliveryCost)}</span></p>
                      ) : null}
                    </div>
                    <div className="mt-6 pt-6 border-t border-outline-variant flex items-end justify-between">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Costo estimado</span>
                      <span className="text-2xl font-black text-primary tabular-nums">
                        {quote.precio != null ? formatARS(quote.precio) : quote.priceLabel ?? '—'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="px-7 py-10 text-center">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      TODAVÍA NO ELEGISTE
                    </p>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed opacity-80">
                      Buscá tu equipo y seleccioná una reparación para armar tu ticket.
                    </p>
                  </div>
                )}

                <div className="border-t border-outline-variant px-7 py-5">
                  {quote && !submitted ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-black py-5 tracking-[0.25em] uppercase hover:bg-secondary-container transition-colors disabled:opacity-60"
                    >
                      <Send size={14} /> {loading ? 'SOLICITANDO...' : 'SOLICITAR PRESUPUESTO'}
                    </motion.button>
                  ) : (
                    <p className="text-center text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {submitted ? 'Pedido confirmado' : 'Completá el proceso para continuar'}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
                className="bg-surface-container-lowest border border-outline-variant p-7 flex items-start gap-4"
              >
                <ShieldCheck size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-black text-on-surface mb-1 tracking-widest">PRESUPUESTO SIN CARGO</h4>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
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