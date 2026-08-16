import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTenant } from '../context/TenantContext'
import { resolveIcon } from '../lib/icons'

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.65, ease: 'easeOut' as const },
  }),
}

export default function ServicesPage() {
  const tenant = useTenant()
  const { hero, about, services, cta } = tenant
  const navigate = useNavigate()

  return (
    <main>
      {/* ── Hero ────────────────────────────────── */}
      <section className="relative h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image}
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop w-full">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="text-[11px] font-bold text-secondary tracking-[0.22em] uppercase block mb-6"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-on-surface leading-tight tracking-tight mb-8"
          >
            {hero.headline1}<br />
            <span className="text-primary italic">{hero.headlineAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="text-base md:text-lg text-on-surface-variant mb-12 max-w-lg leading-relaxed"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/Taller')}
              className="bg-primary-container text-on-primary-container px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-secondary-container transition-colors"
            >
              {hero.cta1}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/valuation')}
              className="border border-outline-variant px-10 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              {hero.cta2}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Sello Taller ───────────────────────── */}
      <section className="py-24 max-w-container-max mx-auto px-5 md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <motion.h2
              variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tight mb-8"
            >
              {about.title}
            </motion.h2>
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-base md:text-lg text-on-surface-variant mb-12 leading-relaxed"
            >
              {about.description}
            </motion.p>
            {about.features.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp} custom={i + 2} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="flex items-start gap-5 group mb-8"
              >
                <span className="w-2 h-2 mt-1.5 bg-primary flex-shrink-0 group-hover:scale-150 transition-transform" />
                <div>
                  <h4 className="text-lg font-bold text-on-surface mb-1">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-6 lg:col-start-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="relative border border-outline-variant aspect-[4/5] overflow-hidden"
            >
              <img
                src={about.image}
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                alt={tenant.brand.name}
              />
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 bg-surface-container border border-outline-variant p-8 max-w-[240px]">
                <span className="text-[10px] font-bold text-secondary tracking-[0.3em] uppercase block mb-2">{about.badgeTitle}</span>
                <p className="text-[11px] font-semibold text-on-surface uppercase tracking-wide leading-snug">{about.badgeText}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ───────────────────────── */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
            <div>
              <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase block mb-3">{services.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl font-black text-on-surface uppercase">{services.title}</h2>
            </div>
            <p className="text-sm text-on-surface-variant max-w-xs">
              {services.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.items.map((svc, i) => {
              const Icon = resolveIcon(svc.icon)
              return (
                <motion.div
                  key={svc.title}
                  variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}
                  whileHover={{ borderColor: 'rgb(var(--tc-primary))', backgroundColor: '#1f2b38' }}
                  onClick={() => navigate('/valuation')}
                  className="bg-surface-container border border-outline-variant p-10 flex flex-col cursor-pointer transition-colors duration-300"
                >
                  <Icon size={36} className="text-secondary-container mb-12" />
                  <h3 className="text-base font-black text-on-surface uppercase tracking-widest mb-5">{svc.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed flex-1 mb-10">{svc.desc}</p>
                  <div className="pt-6 border-t border-outline-variant flex justify-between items-center">
                    <span className="text-[13px] font-semibold text-primary">{svc.price}</span>
                    <ArrowRight size={18} className="text-primary" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative z-10 max-w-container-max mx-auto px-5 md:px-margin-desktop"
        >
          <div className="border border-outline-variant bg-surface-container-low px-8 md:px-16 py-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-on-surface tracking-tight mb-6">
              {cta.title} <span className="text-primary">{cta.accent}</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
              {cta.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/Taller')}
              className="bg-primary-container text-on-primary-container px-16 py-5 text-xs font-black uppercase tracking-widest hover:bg-secondary-container transition-colors"
            >
              {cta.button}
            </motion.button>
          </div>
        </motion.div>
      </section>
    </main>
  )
}