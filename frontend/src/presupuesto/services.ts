/* =====================================================================
   CATÁLOGO DE SERVICIOS DE LA PÁGINA PÚBLICA DE PRESUPUESTO
   Fuente primaria: GET /public/repair-costs/:slug (backend Overlix).
   Fallback: tarifario demo embebido (mismos defaults que el seed).
   ===================================================================== */

import { resolveTenantSlug } from './tenantConfig'

export interface TenantRepairCost {
  id: string
  nombre: string
  categoria: string
  tipo_equipo?: string | null
  precio: number
  tiempo_estimado?: string | null
  descripcion?: string | null
  modelo?: string | null
  marcas?: string[]
  modelos?: { marca: string; nombre: string }[]
}

export const DEMO_REPAIR_COSTS: TenantRepairCost[] = [
  {
    id: 'r1',
    nombre: 'Reemplazo de pantalla',
    categoria: 'Pantallas',
    tipo_equipo: 'celular',
    precio: 425000,
    tiempo_estimado: '3-4 horas',
    descripcion: 'Reemplazo del panel y calibración de color con componentes originales.',
    modelo: 'iPhone 11, 12, 13, 14',
  },
  {
    id: 'r2',
    nombre: 'Cambio de batería',
    categoria: 'Baterías',
    tipo_equipo: 'celular',
    precio: 95000,
    tiempo_estimado: '1-2 horas',
    descripcion: 'Reemplazo de batería con diagnóstico de consumo y ciclo de carga.',
    modelo: 'iPhone 8+ y posteriores',
  },
  {
    id: 'r3',
    nombre: 'Restauración de placa madre',
    categoria: 'Placas',
    tipo_equipo: 'celular',
    precio: 185000,
    tiempo_estimado: '2-4 días',
    descripcion: 'Microsoldadura para fallas de circuitos de energía y daño por líquidos.',
    modelo: 'Todas las marcas',
  },
  {
    id: 'r4',
    nombre: 'Pin de carga',
    categoria: 'Puertos',
    tipo_equipo: 'celular',
    precio: 65000,
    tiempo_estimado: '2-3 horas',
    descripcion: 'Reemplazo del conector de carga y limpieza de microsoldadura.',
    modelo: 'Todas las marcas',
  },
  {
    id: 'r5',
    nombre: 'Cambio de módulo de cámara',
    categoria: 'Cámaras',
    tipo_equipo: 'celular',
    precio: 145000,
    tiempo_estimado: '3-4 horas',
    descripcion: 'Reemplazo del módulo fotográfico con calibración de enfoque.',
    modelo: 'iPhone 12 Pro, 13 Pro',
  },
  {
    id: 'r6',
    nombre: 'Mantenimiento y limpieza interna',
    categoria: 'Mantenimiento',
    tipo_equipo: 'notebook',
    precio: 85000,
    tiempo_estimado: '1-2 horas',
    descripcion: 'Limpieza de ventilación, cambio de pasta térmica y diagnóstico térmico.',
    modelo: 'Todas las marcas',
  },
  {
    id: 'r7',
    nombre: 'Reparación de motherboard',
    categoria: 'Placas',
    tipo_equipo: 'pc',
    precio: 165000,
    tiempo_estimado: '2-4 días',
    descripcion: 'Diagnóstico y microsoldadura de fallas de energía en placa madre.',
    modelo: 'Escritorios y todo en uno',
  },
  {
    id: 'r8',
    nombre: 'Cambio de fuente de alimentación',
    categoria: 'Hardware',
    tipo_equipo: 'pc',
    precio: 55000,
    tiempo_estimado: '1-2 horas',
    descripcion: 'Reemplazo de fuente certificada y prueba de estabilidad de tensión.',
    modelo: 'Gabinete estándar',
  },
  {
    id: 'r9',
    nombre: 'Limpieza y mantenimiento de consola',
    categoria: 'Mantenimiento',
    tipo_equipo: 'consola',
    precio: 75000,
    tiempo_estimado: '2-3 horas',
    descripcion: 'Apertura, limpieza de ventiladores y cambio de pasta térmica.',
    modelo: 'PS4, PS5, Xbox One, Switch',
  },
  {
    id: 'r10',
    nombre: 'Reparación de lector / HDMI',
    categoria: 'Puertos',
    tipo_equipo: 'consola',
    precio: 98000,
    tiempo_estimado: '2-4 horas',
    descripcion: 'Cambio de puerto HDMI o lector con prueba de salida en 4K.',
    modelo: 'PS4, PS5, Xbox One, Switch',
  },
  {
    id: 'r11',
    nombre: 'Cambio de conector de carga',
    categoria: 'Puertos',
    tipo_equipo: 'tablet',
    precio: 72000,
    tiempo_estimado: '2-3 horas',
    descripcion: 'Reemplazo del conector y calibración de carga en modo tablet.',
    modelo: 'iPad, Android',
  },
  {
    id: 'r12',
    nombre: 'Cambio de batería',
    categoria: 'Baterías',
    tipo_equipo: 'smartwatch',
    precio: 48000,
    tiempo_estimado: '1-2 horas',
    descripcion: 'Reemplazo de batería con sellado y prueba de resistencia al agua.',
    modelo: 'Apple Watch, Galaxy Watch',
  },
  {
    id: 'r13',
    nombre: 'Actualización de almacenamiento',
    categoria: 'Hardware',
    tipo_equipo: 'notebook',
    precio: 135000,
    tiempo_estimado: '3-4 horas',
    descripcion: 'Instalación de SSD NVMe con clonado y optimización del sistema.',
    modelo: 'Todas las marcas',
  },
  {
    id: 'r14',
    nombre: 'Instalación y optimización de software',
    categoria: 'Software',
    tipo_equipo: 'pc',
    precio: 32000,
    tiempo_estimado: '2-3 horas',
    descripcion: 'Instalación de sistema, drivers y configuración de seguridad.',
    modelo: 'Escritorio y notebook',
  },
  {
    id: 'r15',
    nombre: 'Reparación de placa y microsoldadura',
    categoria: 'Placas',
    tipo_equipo: 'consola',
    precio: 145000,
    tiempo_estimado: '2-4 días',
    descripcion: 'Microsoldadura para fallas de chips de video y alimentación.',
    modelo: 'PS5, Xbox Series',
  },
]

export interface BudgetRequestPayload {
  slug: string
  nombre: string
  whatsapp: string
  email?: string
  dni?: string
  categoria?: string
  dispositivo: string
  marca?: string
  modelo?: string
  problema?: string
  descripcion?: string
  tiempo_estimado?: string
  precio_ofertado?: number
  plan_pago?: 'half' | 'full'
  sena_monto?: number
  sena_metodo?: 'qr' | 'transferencia'
  comprobante?: string
  resto_metodo?: 'qr' | 'transferencia' | 'efectivo'
  delivery_metodo?: 'llevar' | 'retirar'
  delivery_direccion?: string
  delivery_costo?: number
  turno_fecha?: string
  turno_horario?: string
}

export interface BudgetRequestResponse {
  id: string
  numero: string
  estado: string
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

/** Tarifario publicado por la empresa (backend Overlix).
 *  Con slug real: devuelve SOLO lo publicado (nunca datos demo).
 *  Sin slug (dev localhost): fallback al catálogo demo. */
export async function fetchRepairCosts(slug: string | null): Promise<TenantRepairCost[]> {
  if (!slug) return DEMO_REPAIR_COSTS
  try {
    const res = await fetch(`${API_BASE}/public/repair-costs/${encodeURIComponent(slug)}`)
    if (!res.ok) return []
    const json = await res.json()
    const payload = json?.data ?? json
    const list = Array.isArray(payload) ? payload : []
    return list.map(
      (c: {
        id?: string
        nombre?: string
        categoria?: string
        tipo_equipo?: string | null
        precio?: number
        tiempo_estimado?: string | null
        descripcion?: string | null
        modelo?: string | null
        marcas?: string[]
        modelos?: { marca: string; nombre: string }[]
      }) => ({
        id: c.id ?? '',
        nombre: c.nombre ?? '',
        categoria: c.categoria ?? '',
        tipo_equipo: c.tipo_equipo ?? null,
        precio: Number(c.precio) || 0,
        tiempo_estimado: c.tiempo_estimado ?? null,
        descripcion: c.descripcion ?? null,
        modelo: c.modelo ?? null,
        marcas: Array.isArray(c.marcas) ? c.marcas : [],
        modelos: Array.isArray(c.modelos) ? c.modelos : [],
      })
    )
  } catch {
    return []
  }
}

export { resolveTenantSlug }

/** Guarda la solicitud de presupuesto en el backend (número de orden + seguimiento). */
export async function submitBudgetRequest(payload: BudgetRequestPayload): Promise<BudgetRequestResponse> {
  const res = await fetch(`${API_BASE}/public/budget-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.message ?? json?.error ?? 'No se pudo guardar la solicitud')
  }
  return (json?.data ?? json) as BudgetRequestResponse
}

export interface PublicBudgetRequest {
  numero: string
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'CONVERTIDO' | 'RECHAZADO'
  nombre?: string | null
  whatsapp?: string | null
  categoria?: string | null
  dispositivo?: string | null
  marca?: string | null
  modelo?: string | null
  problema?: string | null
  descripcion?: string | null
  tiempo_estimado?: string | null
  precio_ofertado?: string | number | null
  precio_ajustado?: string | number | null
  plan_pago?: string | null
  sena_monto?: string | number | null
  sena_metodo?: string | null
  comprobante?: string | null
  resto_metodo?: string | null
  delivery_metodo?: string | null
  delivery_direccion?: string | null
  delivery_costo?: string | number | null
  turno_fecha?: string | null
  turno_horario?: string | null
  created_at?: string | null
  repair?: { numero_reparacion?: string | null; estado?: string | null } | null
}

export interface PayBudgetRequestPayload {
  plan_pago?: 'half' | 'full'
  sena_metodo?: 'qr' | 'transferencia'
  comprobante?: string
  resto_metodo?: 'qr' | 'transferencia' | 'efectivo'
  delivery_metodo?: 'llevar' | 'retirar'
  delivery_direccion?: string
  turno_fecha?: string
  turno_horario?: string
}

/** Consulta pública de una reserva por número de orden (REQ-…). */
export async function fetchPublicBudgetRequest(numero: string): Promise<PublicBudgetRequest | null> {
  const res = await fetch(`${API_BASE}/public/budget-requests/${encodeURIComponent(numero)}`)
  if (!res.ok) return null
  const json = await res.json().catch(() => ({}))
  const payload = json?.data ?? json
  return (Array.isArray(payload) ? payload[0] : payload) as PublicBudgetRequest | null
}

/** El cliente confirma la reparación con el costo enviado por el admin. */
export async function confirmPublicBudgetRequest(numero: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/public/budget-requests/${encodeURIComponent(numero)}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  return res.ok
}

/** El cliente registra la forma de pago cuando el admin ya confirmó el precio. */
export async function payPublicBudgetRequest(
  numero: string,
  payload: PayBudgetRequestPayload,
): Promise<PublicBudgetRequest | null> {
  const res = await fetch(`${API_BASE}/public/budget-requests/${encodeURIComponent(numero)}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.message ?? json?.error ?? 'No se pudo registrar el pago')
  }
  const json = await res.json().catch(() => ({}))
  return (json?.data ?? json) as PublicBudgetRequest | null
}

/** El cliente cancela/elimina su reserva (cambió de opinión). */
export async function cancelPublicBudgetRequest(numero: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/public/budget-requests/${encodeURIComponent(numero)}`, {
    method: 'DELETE',
  })
  return res.ok
}
