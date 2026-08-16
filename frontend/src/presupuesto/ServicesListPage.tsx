import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTenantPage, tenantHref } from './tenantConfig'
import { savePendingQuote, formatARS } from './tenant'
import { fetchRepairCosts, type TenantRepairCost } from './services'
import { resolveCategoryIcon, resolveEquipmentIcon } from './icons'
import { EQUIPMENT_TYPES, equipmentLabel } from '@/shared/lib/equipmentTypes'

const PER_PAGE = 6

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function ServicesListPage() {
  const tenant = useTenantPage()
  const { services, hero, cta } = tenant
  const navigate = useNavigate()

  const [repairCosts, setRepairCosts] = useState<TenantRepairCost[]>([])
  const [equipoFilter, setEquipoFilter] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let alive = true
    fetchRepairCosts(tenant.slug ?? null).then(costs => {
      if (alive) {
        setRepairCosts(costs)
        setPage(1)
      }
    })
    return () => {
      alive = false
    }
  }, [tenant.slug])

  /** Tipos de equipo presentes en el tarifario, en el orden del vocabulario. */
  const availableTypes = useMemo(() => {
    const set = new Set((repairCosts.map(c => c.tipo_equipo).filter(Boolean) as string[]))
    return EQUIPMENT_TYPES.filter(t => set.has(t.value))
  }, [repairCosts])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    return repairCosts.filter(c => {
      if (equipoFilter !== 'all' && (c.tipo_equipo ?? '') !== equipoFilter) return false
      if (!q) return true
      const haystack = normalize(
        [c.nombre, c.categoria, c.modelo ?? '', c.descripcion ?? '', equipmentLabel(c.tipo_equipo)].join(' ')
      )
      return haystack.includes(q)
    })
  }, [repairCosts, equipoFilter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, safePage])

  const setFilter = (tipo: string) => {
    setEquipoFilter(tipo)
    setPage(1)
  }

  const elegir = (c: TenantRepairCost) => {
    savePendingQuote({
      nombre: c.nombre,
      categoria: c.categoria,
      tipo_equipo: c.tipo_equipo,
      modelo: c.modelo,
      tiempo_estimado: c.tiempo_estimado,
      descripcion: c.descripcion,
      precio: c.precio,
    })
    navigate(tenantHref('/presupuesto/atelier'))
  }

  return (
    <main>
      {/* ── Encabezado ─────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,102,255,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-8">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="text-[11px] font-bold text-secondary tracking-[0.22em] uppercase block mb-6"
          >
            {services.eyebrow}
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tight max-w-2xl"
            >
              {services.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-sm md:text-base text-muted-foreground max-w-xs leading-relaxed"
            >
              {services.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Filtros ────────────────────────────── */}
      <section className="pb-16 max-w-6xl mx-auto px-5 md:px-8">
        <div className="border border-border bg-card rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
            <div className="flex-1 min-w-[220px]">
              <span className="text-[11px] font-bold text-muted-foreground tracking-[0.2em] uppercase block mb-3">
                BUSCAR EN EL CATÁLOGO
              </span>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Buscá por servicio, modelo o equipo…"
                  className="w-full bg-muted border border-transparent focus:border-primary rounded-lg pl-12 pr-4 py-4 text-base text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-muted-foreground tracking-[0.2em] uppercase block mb-3">
                TIPO DE EQUIPO
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border transition-colors duration-200 ${
                    equipoFilter === 'all'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  Todos
                </button>
                {availableTypes.map(t => {
                  const Icon = resolveEquipmentIcon(t.value)
                  const active = equipoFilter === t.value
                  return (
                    <button
                      key={t.value}
                      onClick={() => setFilter(t.value)}
                      className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg border transition-colors duration-200 ${
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      <Icon size={14} />
                      {t.label.replace(' de videojuegos', '').replace(' de escritorio', '')}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              {filtered.length === 0
                ? 'Sin resultados'
                : `Mostrando ${pageItems.length} de ${filtered.length} ${
                    filtered.length === 1 ? 'servicio' : 'servicios'
                  }`}
            </p>
            {filtered.length > 0 && (
              <span className="text-2xl font-black text-primary tabular-nums">
                {String(filtered.length).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Catálogo ───────────────────────────── */}
      <section className="pb-16 max-w-6xl mx-auto px-5 md:px-8">
        {repairCosts.length === 0 && (
          <p className="text-sm text-muted-foreground py-16 text-center">Cargando el tarifario…</p>
        )}

        {repairCosts.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-16 text-center">
            No encontramos servicios que coincidan con tu búsqueda.
          </p>
        )}

        <AnimatePresence mode="popLayout">
          <div key={`${equipoFilter}-${query}-${safePage}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageItems.map((c, i) => {
              const EquipoIcon = resolveEquipmentIcon(c.tipo_equipo)
              const CategoryIcon = resolveCategoryIcon(c.categoria)
              return (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                  whileHover={{ y: -5 }}
                  onClick={() => elegir(c)}
                  className="group bg-card border border-border rounded-xl p-8 flex flex-col text-left transition-colors duration-300 hover:border-primary shadow-sm cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 border border-primary/30 text-secondary flex items-center justify-center rounded-lg">
                        <EquipoIcon size={18} />
                      </span>
                      <h3 className="text-base font-black text-foreground uppercase tracking-widest">
                        {c.nombre}
                      </h3>
                    </div>
                    <ArrowRight size={18} className="text-primary flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground tracking-[0.18em] uppercase">
                      <CategoryIcon size={12} /> {c.categoria}
                    </span>
                    {c.tipo_equipo && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-[10px] font-bold text-secondary tracking-[0.18em] uppercase">
                          {equipmentLabel(c.tipo_equipo)}
                        </span>
                      </>
                    )}
                  </div>

                  {c.modelo && (
                    <p className="text-[11px] font-semibold text-muted-foreground tracking-wide mb-4">{c.modelo}</p>
                  )}

                  {c.descripcion && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">{c.descripcion}</p>
                  )}

                  <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                    <span className="text-[15px] font-black text-secondary tabular-nums">{formatARS(c.precio)}</span>
                    {c.tiempo_estimado && (
                      <span className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                        <Clock size={12} /> {c.tiempo_estimado}
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </AnimatePresence>

        {/* Paginación */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-14" aria-label="Paginación del catálogo">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Página anterior"
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-current={n === safePage ? 'page' : undefined}
                className={`w-11 h-11 text-xs font-black rounded-lg border transition-colors ${
                  n === safePage
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {String(n).padStart(2, '0')}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Página siguiente"
              className="w-11 h-11 flex items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative z-10 max-w-6xl mx-auto px-5 md:px-8"
        >
          <div className="border border-border bg-card rounded-2xl px-8 md:px-16 py-20 text-center shadow-xl">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
              {cta.title} <span className="text-primary">{cta.accent}</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {cta.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(tenantHref('/presupuesto/valuacion'))}
              className="bg-primary text-primary-foreground px-16 py-5 text-xs font-black uppercase tracking-widest hover:bg-primary-hover rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              {hero.cta1}
            </motion.button>
          </div>
        </motion.div>
      </section>
    </main>
  )
}