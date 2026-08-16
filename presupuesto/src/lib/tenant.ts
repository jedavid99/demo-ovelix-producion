import { TENANTS, DEFAULT_TENANT } from '../config/tenants'
import type { TenantPageConfig, TenantRepairCost } from '../config/tenant.types'

/** Devuelve el slug de tenant según el subdominio del hostname.
 *  Ej: `geeksmart.presupuesto.com` → `geeksmart`.
 *  En dev se puede fijar con `VITE_PAGE_SLUG` (ej: `EMP001`). */
export function resolveTenantSlug(): string | null {
  const envSlug = (import.meta.env.VITE_PAGE_SLUG as string | undefined)?.trim()
  if (envSlug) return envSlug.toLowerCase()
  if (typeof window === 'undefined') return null
  const host = window.location.hostname || ''
  const parts = host.split('.')
  const sub = parts[0]?.toLowerCase()
  if (!sub || sub === 'www' || sub === 'localhost') return null
  return sub
}

export function getTenant(): TenantPageConfig {
  const slug = resolveTenantSlug()
  if (!slug) return DEFAULT_TENANT
  return TENANTS.find(t => t.slug === slug && t.enabled) || DEFAULT_TENANT
}

/** Selección persistente para llevar la reparación elegida al booking (RESUMEN). */
export interface TenantQuoteSelection {
  nombre: string
  categoria?: string | null
  modelo?: string | null
  tiempo_estimado?: string | null
  descripcion?: string | null
  precio?: number | null
  priceLabel?: string | null
}

const PENDING_QUOTE_KEY = 'ovelix:pending-quote'

export function savePendingQuote(sel: TenantQuoteSelection) {
  try {
    sessionStorage.setItem(PENDING_QUOTE_KEY, JSON.stringify(sel))
  } catch {
    /* noop */
  }
}

export function getPendingQuote(): TenantQuoteSelection | null {
  try {
    const raw = sessionStorage.getItem(PENDING_QUOTE_KEY)
    return raw ? (JSON.parse(raw) as TenantQuoteSelection) : null
  } catch {
    return null
  }
}

/** Trae la config publicada en el sistema Overlix. Devuelve null si el backend
 *  no responde o el tenant no está publicado (fallback a config local). */
export async function fetchRemoteConfig(slug: string): Promise<TenantPageConfig | null> {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api'
  try {
    const res = await fetch(`${baseUrl}/public/tenant-pages/${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const json = await res.json()
    const payload = json?.data ?? json
    return payload?.config ?? null
  } catch {
    return null
  }
}

/** Trae el tarifario de reparaciones publicado por el técnico (backend Overlix). */
export async function fetchRepairCosts(slug: string): Promise<TenantRepairCost[]> {
  const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api'
  try {
    const res = await fetch(`${baseUrl}/public/repair-costs/${encodeURIComponent(slug)}`)
    if (!res.ok) return []
    const json = await res.json()
    const payload = json?.data ?? json
    const list = Array.isArray(payload) ? payload : []
    return list.map(c => ({
      id: c.id,
      nombre: c.nombre ?? '',
      categoria: c.categoria ?? '',
      precio: Number(c.precio) || 0,
      tiempo_estimado: c.tiempo_estimado ?? null,
      descripcion: c.descripcion ?? null,
      modelo: c.modelo ?? null,
      notas: c.notas ?? null,
    }))
  } catch {
    return []
  }
}

export function hexToRgb(
  hex: string,
): string | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return null
  const r = parseInt(m[1], 16)
  const g = parseInt(m[2], 16)
  const b = parseInt(m[3], 16)
  return `${r} ${g} ${b}`
}