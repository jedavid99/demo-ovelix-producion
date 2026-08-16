import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTenantPage, tenantHref } from './tenantConfig'

export default function Header() {
  const { brand, nav } = useTenantPage()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const toHome = tenantHref('/presupuesto')
  const toAtelier = tenantHref('/presupuesto/valuacion')

  return (
    <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-20 md:h-24">

        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate(toHome)}
          className="text-2xl md:text-3xl font-black tracking-tighter text-secondary"
        >
          {brand.logoText}
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {nav.map(l => (
            <NavLink
              key={l.to}
              to={tenantHref(l.to)}
              end={l.to === '/presupuesto'}
              className={({ isActive }) =>
                `text-xs font-bold uppercase tracking-widest transition-colors duration-200 pb-1 ${
                  isActive
                    ? 'text-secondary border-b-2 border-secondary'
                    : 'text-muted-foreground hover:text-secondary'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(toAtelier)}
          className="hidden md:block bg-secondary text-secondary-foreground text-xs font-black px-8 py-3.5 tracking-widest uppercase hover:bg-[var(--tc-secondary-hover)] rounded-md transition-colors"
        >
          RESERVAR TURNO
        </motion.button>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden text-muted-foreground hover:text-secondary transition-colors"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="px-5 py-6 space-y-5">
              {nav.map(l => (
                <NavLink
                  key={l.to}
                  to={tenantHref(l.to)}
                  end={l.to === '/presupuesto'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block text-xs font-bold uppercase tracking-widest ${
                      isActive ? 'text-secondary' : 'text-muted-foreground'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={() => { navigate(toAtelier); setOpen(false) }}
                className="w-full mt-2 bg-secondary text-secondary-foreground text-xs font-black py-3.5 tracking-widest uppercase rounded-md"
              >
                RESERVAR TURNO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
