import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTenant } from '../context/TenantContext'

export default function Header() {
  const { brand, nav, hero } = useTenant()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || open
          ? 'bg-surface/95 backdrop-blur-md border-outline-variant shadow-lg shadow-black/20'
          : 'bg-surface/80 backdrop-blur-md border-outline-variant'
      }`}
    >
      <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop flex items-center justify-between h-20 md:h-24">

        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          aria-label={`${brand.name} — ir al inicio`}
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src={brand.logo || '/favicon.png'}
            alt={brand.name}
            width={48}
            height={48}
            className="h-10 md:h-12 w-auto object-contain"
          />
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-secondary hidden sm:block">
            {brand.logoText}
          </span>
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10" aria-label="Navegación principal">
          {nav.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className="relative text-xs font-bold uppercase tracking-widest transition-colors duration-200 pb-1"
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary transition-colors duration-200'}>
                    {l.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-secondary"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/Taller')}
          className="hidden md:block bg-secondary-container text-on-secondary-container text-xs font-black px-8 py-3.5 tracking-widest uppercase hover:bg-secondary-fixed transition-colors"
        >
          {hero.cta1}
        </motion.button>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden text-on-surface-variant hover:text-secondary transition-colors"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-surface-container-low border-t border-outline-variant"
          >
            <nav className="px-5 py-6 space-y-5" aria-label="Navegación móvil">
              {nav.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-bold uppercase tracking-widest py-1 border-l-2 pl-4 transition-colors ${
                      isActive
                        ? 'text-secondary border-secondary'
                        : 'text-on-surface-variant border-transparent hover:text-secondary'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={() => { navigate('/Taller'); setOpen(false) }}
                className="w-full mt-4 bg-secondary-container text-on-secondary-container text-xs font-black py-4 tracking-widest uppercase"
              >
                {hero.cta1}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}