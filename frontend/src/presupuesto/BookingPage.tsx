import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenantPage } from './tenantConfig'
import { getPendingQuote, type TenantQuoteSelection } from './tenant'

// Construcción estática del calendario del mes (20 de inicio ficticio)
const CAL = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
]

function formatARS(n: number): string {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function BookingPage() {
  const { booking } = useTenantPage()
  const location = useLocation()
  const repair: TenantQuoteSelection | null =
    (location.state as { repair?: TenantQuoteSelection } | null)?.repair ?? getPendingQuote()

  const [selectedDay, setSelectedDay] = useState(7)
  const [selectedSlot, setSelectedSlot] = useState(
    booking.slots.find(s => s.avail)?.time ?? booking.slots[0]?.time ?? '',
  )
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', serial: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const summaryRows = repair
    ? [
        { label: 'REPARACIÓN', value: repair.nombre },
        ...(repair.categoria ? [{ label: 'CATEGORÍA', value: repair.categoria }] : []),
        ...(repair.modelo ? [{ label: 'MODELO', value: repair.modelo }] : []),
        ...(repair.tiempo_estimado ? [{ label: 'TIEMPO EST.', value: repair.tiempo_estimado }] : []),
      ]
    : booking.summaryRows

  const quoteValue = repair
    ? repair.priceLabel ?? (repair.precio != null ? formatARS(repair.precio) : '')
    : booking.priceMap[booking.devices[0]?.id ?? 'iphone']

  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

  const handleConfirm = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError(booking.errorInvalid)
      return
    }
    setError('')
    setLoading(true)
    try {
      const [h, m] = selectedSlot.split(':').map(Number)
      const now = new Date()
      const fecha = new Date(now.getFullYear(), now.getMonth(), selectedDay, h || 9, m || 0)
      const device = booking.devices[0]
      const res = await fetch(`${API_BASE}/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: booking.slug,
          nombre: form.name.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim() || undefined,
          dispositivo: repair?.modelo || repair?.nombre || device?.title,
          servicio: repair?.categoria || repair?.nombre || booking.serviceMap[device?.id ?? 'iphone'],
          fecha: fecha.toISOString(),
          horario: selectedSlot,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json?.message ?? json?.error ?? 'No se pudo registrar la reserva')
      }
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrar la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

        {/* Left steps */}
        <div className="flex-1 space-y-20">

          {/* Header */}
          <section>
            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-3xl md:text-6xl font-black text-foreground tracking-tight mb-4"
            >
              {booking.title}
            </motion.h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {booking.description}
            </p>
          </section>

          {/* Step 01 – Device */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">01</span>
              <h2 className="text-lg font-black text-foreground uppercase tracking-widest">{booking.step1Title}</h2>
            </div>
            {repair ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-primary rounded-xl p-8 md:p-10 shadow-lg shadow-primary/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={20} className="text-primary shrink-0" />
                  <h3 className="text-lg font-black text-foreground uppercase tracking-wide">{repair.nombre}</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  {repair.categoria && (
                    <p>Categoría: <span className="text-foreground">{repair.categoria}</span></p>
                  )}
                  {repair.modelo && (
                    <p>Modelo: <span className="text-foreground">{repair.modelo}</span></p>
                  )}
                  {repair.tiempo_estimado && (
                    <p>Tiempo estimado: <span className="text-foreground">{repair.tiempo_estimado}</span></p>
                  )}
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Seleccioná tu reparación en la sección de valuación para continuar.
              </p>
            )}
          </section>

          {/* Step 02 – Contact */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">02</span>
              <h2 className="text-lg font-black text-foreground uppercase tracking-widest">{booking.step2Title}</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
              {booking.formLabels.map(f => (
                <div key={f.key} className="flex flex-col gap-2">
                  <label htmlFor={f.key} className="text-xs font-bold text-muted-foreground tracking-widest">{f.label}</label>
                  <input
                    id={f.key}
                    type={f.type}
                    placeholder={f.ph}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="bg-transparent border-b border-input py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Step 03 – Schedule */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary/40 text-primary flex items-center justify-center text-[11px] font-black rounded-md">03</span>
              <h2 className="text-lg font-black text-foreground uppercase tracking-widest">{booking.step3Title}</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">

                {/* Calendar */}
                <div className="lg:col-span-4">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-black text-foreground">{booking.monthLabel}</h4>
                    <div className="flex gap-3">
                      <button className="text-muted-foreground hover:text-secondary transition-colors"><ChevronLeft size={18} /></button>
                      <button className="text-muted-foreground hover:text-secondary transition-colors"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {booking.days.map(d => (
                      <span key={d} className="text-[10px] font-bold text-muted-foreground py-2 tracking-widest">{d}</span>
                    ))}
                    {CAL.map((day, idx) => (
                      day === null
                        ? <div key={`e-${idx}`} className="py-3" />
                        : (
                          <motion.button
                            key={day}
                            whileHover={{ scale: 1.12 }}
                            onClick={() => setSelectedDay(day)}
                            className={`min-h-11 py-3 text-sm font-semibold rounded-md transition-all ${
                              selectedDay === day
                                ? 'bg-primary/20 border border-primary text-primary'
                                : 'text-muted-foreground hover:text-secondary'
                            }`}
                          >
                            {day}
                          </motion.button>
                        )
                    ))}
                  </div>
                </div>

                {/* Slots */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-10">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{booking.slotsLabel}</p>
                  <div className="space-y-3">
                    {booking.slots.map(s => (
                      <motion.button
                        key={s.time}
                        whileHover={s.avail ? { scale: 1.02 } : {}}
                        whileTap={s.avail ? { scale: 0.98 } : {}}
                        disabled={!s.avail}
                        onClick={() => s.avail && setSelectedSlot(s.time)}
                        className={`w-full p-4 border rounded-lg flex justify-between items-center text-left transition-all ${
                          !s.avail
                            ? 'border-border opacity-50 cursor-not-allowed text-foreground'
                            : selectedSlot === s.time
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-foreground hover:border-primary'
                        }`}
                      >
                        <span className="text-sm font-semibold">{s.time}</span>
                        {!s.avail
                          ? <span className="text-[11px] font-bold">OCUPADO</span>
                          : selectedSlot === s.time
                          ? <CheckCircle size={15} className="text-primary" />
                          : <span className="w-2 h-2 bg-[color-mix(in_srgb,var(--secondary)_40%,transparent)] rounded-full" />
                        }
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right – Summary */}
        <aside className="w-full lg:w-[380px] xl:w-[420px]">
          <div className="sticky top-28 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="bg-card border border-border rounded-xl p-8 md:p-10 shadow-lg"
            >
              <h3 className="text-xl font-black border-b border-border pb-6 mb-8">{booking.summaryLabel}</h3>
              <div className="space-y-5 mb-8">
                {summaryRows.map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span className="text-[11px] font-bold text-muted-foreground tracking-widest">{row.label}</span>
                    <span className="text-sm text-foreground text-right">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-5 border-t border-border">
                  <span className="text-[11px] font-bold text-primary tracking-widest">{booking.quoteLabel}</span>
                  <span className="text-xl font-black text-primary">{quoteValue}</span>
                </div>
              </div>

              <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed opacity-70 mb-6">
                {booking.disclaimer}
              </p>

              {error && (
                <p role="alert" className="text-[12px] font-semibold text-destructive mb-4">{error}</p>
              )}

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-secondary text-secondary-foreground rounded-lg text-center py-5 text-[11px] font-black tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    {booking.confirmed}
                  </motion.div>
                ) : (
                  <motion.button
                    key="cta"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground rounded-lg text-[11px] font-black py-5 tracking-[0.25em] uppercase hover:bg-primary-hover transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
                  >
                    {loading ? booking.submitting : booking.submit}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              className="bg-card border border-border rounded-xl p-8 flex items-start gap-4"
            >
              <ShieldCheck size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-foreground mb-1 tracking-widest">{booking.guaranteeTitle}</h4>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {booking.guaranteeText}
                </p>
              </div>
            </motion.div>
          </div>
        </aside>
      </div>
    </main>
  )
}
