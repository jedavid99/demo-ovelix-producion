import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_TENANT } from '../config/tenants'
import type { TenantPageConfig, TenantTheme } from '../config/tenant.types'
import { getTenant, fetchRemoteConfig, resolveTenantSlug, hexToRgb } from '../lib/tenant'

const THEME_PROP_MAP: Record<keyof TenantTheme, string> = {
  primaryColor: '--tc-primary',
  onPrimary: '--tc-on-primary',
  accentText: '--tc-accent',
  accentFill: '--tc-accent-fill',
  onAccentFill: '--tc-on-accent-fill',
  accentHover: '--tc-accent-hover',
  secondaryFill: '--tc-secondary-fill',
  onSecondaryFill: '--tc-on-secondary-fill',
  secondaryHover: '--tc-secondary-hover',
}

const TenantContext = createContext<TenantPageConfig>(DEFAULT_TENANT)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantPageConfig>(() => getTenant())

  useEffect(() => {
    const slug = resolveTenantSlug()
    if (!slug) return
    let cancelled = false
    fetchRemoteConfig(slug)
      .then(remote => {
        if (!cancelled && remote) setTenant(remote)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const theme = tenant.theme
    ;(Object.keys(THEME_PROP_MAP) as (keyof TenantTheme)[]).forEach(key => {
      const rgb = hexToRgb(theme[key])
      if (rgb) root.style.setProperty(THEME_PROP_MAP[key], rgb)
    })
    root.lang = 'es-AR'
    document.title = `${tenant.brand.name} | Presupuesto`
  }, [tenant])

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>
}

export function useTenant(): TenantPageConfig {
  return useContext(TenantContext)
}
