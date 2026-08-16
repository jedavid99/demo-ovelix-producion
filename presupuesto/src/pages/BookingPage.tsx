import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenant } from '../context/TenantContext'

// Construcción estática del calendario del mes (20 de inicio ficticio)
const CAL = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
]

export default function BookingPage() {
  const { booking } = useTenant()
  const [device, setDevice] = useState(booking.devices[0]!.id)
  const [selectedDay, setSelectedDay] = useState(7)
  const [selectedSlot, setSelectedSlot] = useState(
    booking.slots.find(s => s.avail)?.time ?? booking.slots[0]?.time ?? '',
  )
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', serial: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError(booking.errorInvalid)
      return
    }
    setError('')
    setLoading(true)
    // Simulate booking submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

        {/* Left steps */}
        <div className="flex-1 space-y-20">

          {/* Header */}
          <section>
            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-3xl md:text-6xl font-black text-on-surface tracking-tight mb-4"
            >
              {booking.title}
            </motion.h1>
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {booking.description}
            </p>
          </section>

          {/* Step 01 – Device */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">01</span>
              <h2 className="text-lg font-black uppercase tracking-widest">{booking.step1Title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {booking.devices.map(d => (
                <motion.div
                  key={d.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDevice(d.id)}
                  className={`group relative bg-surface-container border p-6 md:p-8 cursor-pointer transition-colors duration-300 ${device === d.id ? 'border-primary-container bg-primary-container/5' : 'border-outline-variant hover:border-primary'}`}
                >
                  <div className="aspect-square mb-6 overflow-hidden bg-black">
                    <img src={d.img} alt={d.title} className={`w-full h-full object-cover transition-opacity duration-500 ${device === d.id ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'}`} />
                  </div>
                  <h3 className="text-lg font-black mb-1">{d.title}</h3>
                  <p className="text-[11px] font-semibold text-on-surface-variant tracking-widest">{d.sub}</p>
                  <AnimatePresence>
                    {device === d.id && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="absolute top-4 right-4 text-primary"
                      >
                        <CheckCircle size={22} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Step 02 – Contact */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">02</span>
              <h2 className="text-lg font-black uppercase tracking-widest">{booking.step2Title}</h2>
            </div>
            <div className="bg-surface-container border border-outline-variant p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
              {booking.formLabels.map(f => (
                <div key={f.key} className="flex flex-col gap-2">
                  <label htmlFor={f.key} className="text-xs font-bold text-on-surface-variant tracking-widest">{f.label}</label>
                  <input
                    id={f.key}
                    type={f.type}
                    placeholder={f.ph}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="bg-transparent border-b border-outline py-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container transition-colors"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Step 03 – Schedule */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 border border-primary-container text-primary flex items-center justify-center text-[11px] font-black">03</span>
              <h2 className="text-lg font-black uppercase tracking-widest">{booking.step3Title}</h2>
            </div>
            <div className="bg-surface-container border border-outline-variant p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">

                {/* Calendar */}
                <div className="lg:col-span-4">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-black">{booking.monthLabel}</h4>
                    <div className="flex gap-3">
                      <button className="text-on-surface-variant hover:text-secondary transition-colors"><ChevronLeft size={18} /></button>
                      <button className="text-on-surface-variant hover:text-secondary transition-colors"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {booking.days.map(d => (
                      <span key={d} className="text-[10px] font-bold text-outline py-2 tracking-widest">{d}</span>
                    ))}
                    {CAL.map((day, idx) => (
                      day === null
                        ? <div key={`e-${idx}`} className="py-3" />
                        : (
                          <motion.button
                            key={day}
                            whileHover={{ scale: 1.12 }}
                            onClick={() => setSelectedDay(day)}
                            className={`min-h-11 py-3 text-sm font-semibold rounded-sm transition-all ${
                              selectedDay === day
                                ? 'bg-primary-container/20 border border-primary-container text-primary'
                                : 'text-on-surface-variant hover:text-secondary'
                            }`}
                          >
                            {day}
                          </motion.button>
                        )
                    ))}
                  </div>
                </div>

                {/* Slots */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-outline-variant pt-8 lg:pt-0 lg:pl-10">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">{booking.slotsLabel}</p>
                  <div className="space-y-3">
                    {booking.slots.map(s => (
                      <motion.button
                        key={s.time}
                        whileHover={s.avail ? { scale: 1.02 } : {}}
                        whileTap={s.avail ? { scale: 0.98 } : {}}
                        disabled={!s.avail}
                        onClick={() => s.avail && setSelectedSlot(s.time)}
                        className={`w-full p-4 border flex justify-between items-center text-left transition-all ${
                          !s.avail
                            ? 'border-outline opacity-50 cursor-not-allowed text-on-surface'
                            : selectedSlot === s.time
                            ? 'border-primary-container bg-primary-container/10 text-primary'
                            : 'border-outline text-on-surface hover:border-primary-container'
                        }`}
                      >
                        <span className="text-sm font-semibold">{s.time}</span>
                        {!s.avail
                          ? <span className="text-[11px] font-bold">OCUPADO</span>
                          : selectedSlot === s.time
                          ? <CheckCircle size={15} className="text-primary" />
                          : <span className="w-2 h-2 bg-secondary-fixed-dim rounded-full" />
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
              className="bg-surface-container border border-primary-container p-8 md:p-10"
            >
              <h3 className="text-xl font-black border-b border-outline-variant pb-6 mb-8">{booking.summaryLabel}</h3>
              <div className="space-y-5 mb-8">
                {booking.summaryRows.map(row => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span className="text-[11px] font-bold text-on-surface-variant tracking-widest">{row.label}</span>
                    <span className="text-sm text-on-surface text-right">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-5 border-t border-outline-variant">
                  <span className="text-[11px] font-bold text-primary tracking-widest">{booking.quoteLabel}</span>
                  <span className="text-xl font-black text-primary">{booking.priceMap[device]}</span>
                </div>
              </div>

              <p className="text-[10px] font-semibold text-on-surface-variant leading-relaxed opacity-70 mb-6">
                {booking.disclaimer}
              </p>

              {error && (
                <p role="alert" className="text-[12px] font-semibold text-red-400 mb-4">{error}</p>
              )}

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-secondary text-on-secondary-fixed text-center py-5 text-[11px] font-black tracking-widest uppercase flex items-center justify-center gap-2"
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
                    className="w-full bg-primary-container text-on-primary-container text-[11px] font-black py-5 tracking-[0.25em] uppercase hover:bg-secondary-container transition-colors disabled:opacity-60"
                  >
                    {loading ? booking.submitting : booking.submit}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              className="bg-surface-container-lowest border border-outline-variant p-8 flex items-start gap-4"
            >
              <ShieldCheck size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-on-surface mb-1 tracking-widest">{booking.guaranteeTitle}</h4>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">
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