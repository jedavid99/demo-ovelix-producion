import { motion } from 'framer-motion'
import { Smartphone, User } from 'lucide-react'
import { useTenant } from '../context/TenantContext'
import { resolveIcon } from '../lib/icons'

export default function TrackingPage() {
  const { tracking } = useTenant()

  return (
    <main className="bg-surface-container-lowest min-h-screen">
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-16">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-2 h-2 bg-secondary rounded-full"
              />
              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">{tracking.statusLabel}</p>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-black text-on-surface tracking-tighter"
            >
              {tracking.orderCode}
            </motion.h2>
            <div className="flex flex-wrap items-center gap-5 text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Smartphone size={17} />
                <span className="text-sm uppercase tracking-widest">{tracking.deviceName}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-outline-variant" />
              <div className="flex items-center gap-2">
                <User size={17} />
                <span className="text-sm uppercase tracking-widest">{tracking.clientName}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <motion.button
              whileHover={{ backgroundColor: 'rgba(185,241,255,0.08)' }}
              className="flex-1 md:flex-none border border-secondary text-secondary text-[11px] font-black px-6 md:px-8 py-4 uppercase tracking-widest transition-colors"
            >
              {tracking.messageButton}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 md:flex-none bg-secondary text-on-secondary-fixed text-[11px] font-black px-6 md:px-8 py-4 uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors"
            >
              {tracking.reportButton}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Timeline */}
          <aside className="lg:col-span-5 relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-outline-variant" />
            <div className="space-y-14">
              {tracking.steps.map((step, i) => {
                const Icon = resolveIcon(step.icon)
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.14, duration: 0.65, ease: 'easeOut' }}
                    className={`relative pl-12 ${step.status === 'pending' ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        step.status === 'done'
                          ? 'bg-surface-container-high border border-outline'
                          : step.status === 'active'
                          ? 'bg-secondary border border-secondary shadow-[0_0_18px_rgb(var(--tc-accent-fill))]'
                          : 'bg-surface-container-lowest border border-outline-variant'
                      }`}
                    >
                      <Icon
                        size={15}
                        className={
                          step.status === 'active'
                            ? 'text-on-secondary-fixed'
                            : step.status === 'done'
                            ? 'text-secondary'
                            : 'text-on-surface-variant'
                        }
                      />
                    </div>

                    <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${step.status === 'active' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {step.label}
                    </p>
                    <h4 className="text-xl font-bold text-on-surface mb-3">{step.title}</h4>

                    {step.status === 'active' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-surface-container p-6 border border-outline-variant"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[11px] font-bold text-on-surface uppercase tracking-tight">{tracking.progressTitle}</span>
                          <span className="text-[11px] font-bold text-secondary">{tracking.progressPercent}%</span>
                        </div>
                        <div className="w-full h-[3px] bg-surface-container-highest">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tracking.progressPercent}%` }}
                            transition={{ duration: 1.3, delay: 0.6, ease: 'easeOut' }}
                            className="h-full bg-secondary"
                          />
                        </div>
                        <p className="mt-4 text-[13px] text-on-surface-variant italic leading-relaxed">
                          {tracking.progressNote}
                        </p>
                      </motion.div>
                    ) : step.desc ? (
                      <p className="text-sm text-on-surface-variant opacity-70 leading-relaxed">{step.desc}</p>
                    ) : null}
                  </motion.div>
                )
              })}
            </div>
          </aside>

          {/* Visual + Info panels */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="relative aspect-video bg-surface-container-low overflow-hidden border border-outline-variant group"
            >
              <div className="absolute inset-0 circuit-pattern" />
              <img
                src={tracking.image}
                alt={tracking.imageAlt}
                className="w-full h-full object-cover mix-blend-luminosity opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 right-6 text-right bg-surface/40 backdrop-blur-md p-4 border border-outline-variant/30">
                <p className="text-[11px] font-bold text-secondary uppercase">{tracking.labLabel}</p>
                <p className="text-sm text-on-surface-variant">{tracking.labLocation}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.65, ease: 'easeOut' }}
                className="bg-surface-container p-8 border border-outline-variant"
              >
                <h5 className="text-[11px] font-black text-secondary uppercase tracking-widest mb-6">{tracking.componentsTitle}</h5>
                <div className="space-y-4">
                  {tracking.components.map((c, i) => (
                    <div key={c.name} className={`flex justify-between items-center ${i < tracking.components.length - 1 ? 'pb-4 border-b border-outline-variant' : ''}`}>
                      <span className="text-sm text-on-surface">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span className="text-[11px] font-bold text-secondary uppercase">{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.65, ease: 'easeOut' }}
                className="bg-surface-container p-8 border border-outline-variant"
              >
                <h5 className="text-[11px] font-black text-secondary uppercase tracking-widest mb-6">{tracking.completionTitle}</h5>
                <p className="text-4xl font-black text-on-surface tracking-tight">{tracking.completionDate}</p>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{tracking.completionTime}</p>
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                    {tracking.completionNote}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}