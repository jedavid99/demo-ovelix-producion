import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_CONFIG,
  fetchTenantPage,
  resolveTenantSlug,
  type TenantPageConfig,
} from './tenantConfig'

/* =====================================================================
   PROVIDER DE CONFIG POR EMPRESA
   - `/presupuesto` (plantilla): siempre usa DEFAULT_CONFIG, sin esperas.
   - `/presupuesto.<empresa>`: NO muestra la plantilla mientras carga;
     renderiza un loader hasta tener la config de la empresa, y la cachea
     para que la navegación entre páginas del sitio sea instantánea.
   - Aplica el theme (CSS vars) y el título una sola vez.
   ===================================================================== */

const configCache = new Map<string, TenantPageConfig>()

const TenantContext = createContext<TenantPageConfig | null>(null)

function TenantLoading() {
  return (
    <div className="presupuesto-root min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cargando…</p>
      </div>
    </div>
  )
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const slug = useMemo(() => resolveTenantSlug(), [])
  const [fetched, setFetched] = useState<{ slug: string; config: TenantPageConfig } | null>(null)

  const config = useMemo<TenantPageConfig | null>(() => {
    if (!slug) return DEFAULT_CONFIG
    if (fetched && fetched.slug === slug) return fetched.config
    return configCache.get(slug) ?? null
  }, [slug, fetched])

  useEffect(() => {
    if (!slug) return
    if (configCache.has(slug)) return
    let cancelled = false
    fetchTenantPage(slug).then(c => {
      if (!cancelled) {
        configCache.set(slug, c)
        setFetched({ slug, config: c })
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!config) return
    const root = document.documentElement
    const t = config.theme
    const vars: Record<string, string> = {
      '--tc-primary': t.primaryColor,
      '--tc-on-primary': t.onPrimary,
      '--tc-accent': t.accentText,
      '--tc-accent-fill': t.accentFill,
      '--tc-on-accent-fill': t.onAccentFill,
      '--tc-accent-hover': t.accentHover,
      '--tc-secondary-fill': t.secondaryFill,
      '--tc-on-secondary-fill': t.onSecondaryFill,
      '--tc-secondary-hover': t.secondaryHover,
    }
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    root.lang = 'es-AR'
    document.title = `${config.brand.name} | Presupuesto`
  }, [config])

  if (!config) {
    return <TenantLoading />
  }

  return <TenantContext.Provider value={config}>{children}</TenantContext.Provider>
}

export function useTenantPage(): TenantPageConfig {
  const config = useContext(TenantContext)
  if (!config) {
    throw new Error('useTenantPage debe usarse dentro de <TenantProvider>')
  }
  return config
}