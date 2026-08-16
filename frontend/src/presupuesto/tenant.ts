/* =====================================================================
   UTILIDADES COMPARTIDAS DE LA PÁGINA DE PRESUPUESTO
   - Selección de reparación persistida (para el RESUMEN de reserva)
   ===================================================================== */

export interface TenantQuoteSelection {
  nombre: string
  categoria?: string | null
  tipo_equipo?: string | null
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

export function formatARS(n: number): string {
  return '$ ' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
