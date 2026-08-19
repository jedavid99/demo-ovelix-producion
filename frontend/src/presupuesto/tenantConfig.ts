/* =====================================================================
   CONFIG PÚBLICA DE LA PÁGINA DE PRESUPUESTO
   Fuente primaria: GET /public/tenant-pages/:slug (backend Overlix).
   Fallback: config demo embebida (mismos defaults que el backend)
   para que el flujo funcione sin slug (dev en localhost).
   ===================================================================== */

export interface TenantTheme {
  primaryColor: string
  onPrimary: string
  accentText: string
  accentFill: string
  onAccentFill: string
  accentHover: string
  secondaryFill: string
  onSecondaryFill: string
  secondaryHover: string
}

export interface TenantPageConfig {
  slug: string
  enabled: boolean
  brand: {
    name: string
    logoText: string
    tagline: string
    logo?: string
  }
  theme: TenantTheme
  contact: {
    whatsapp?: string
    phone?: string
    email?: string
    address?: string
    city?: string
    mapEmbed?: string
    instagram?: string
    facebook?: string
  }
  schedule: { day: string; hours: string; closed?: boolean }[]
  nav: { label: string; to: string }[]
  hero: {
    eyebrow: string
    headline1: string
    headlineAccent: string
    description: string
    cta1: string
    cta2: string
    image: string
  }
  about: {
    title: string
    description: string
    features: { title: string; desc: string }[]
    badgeTitle: string
    badgeText: string
    image: string
  }
  services: {
    eyebrow: string
    title: string
    description: string
    items: { icon: string; title: string; desc: string; price: string }[]
  }
  cta: { title: string; accent: string; description: string; button: string }
  footer: { legalPages: { label: string; slug: string; content: string }[]; rights: string }
  valuation: {
    title: string
    placeholder: string
    suggestions: string[]
    resultsTitle: string
    resultsSubtitle: string
    badgeLabel: string
    selectLabel: string
    results: { badge: string; title: string; desc: string; label: string; price: string; img?: string }[]
    helpTitle: string
    helpDescription: string
    helpButtons: string[]
  }
  tracking: {
    statusLabel: string
    orderCode: string
    deviceName: string
    clientName: string
    messageButton: string
    reportButton: string
    steps: { label: string; title: string; desc: string; status: 'done' | 'active' | 'pending'; icon: string }[]
    progressTitle: string
    progressPercent: number
    progressNote: string
    labLabel: string
    labLocation: string
    image: string
    imageAlt: string
    componentsTitle: string
    components: { name: string; status: string }[]
    completionTitle: string
    completionDate: string
    completionTime: string
    completionNote: string
  }
  checkout?: {
    deliveryCost: number
    cbu: string
    alias: string
    accountNumber: string
  }
  booking: {
    title: string
    description: string
    devices: { id: string; title: string; sub: string; img: string }[]
    days: string[]
    monthLabel: string
    slots: { time: string; avail: boolean }[]
    serviceMap: Record<string, string>
    priceMap: Record<string, string>
    step1Title: string
    step2Title: string
    step3Title: string
    formLabels: { label: string; key: string; type: string; ph: string }[]
    slotsLabel: string
    summaryLabel: string
    summaryRows: { label: string; value: string }[]
    quoteLabel: string
    summerTime: string
    disclaimer: string
    errorInvalid: string
    submit: string
    submitting: string
    confirmed: string
    guaranteeTitle: string
    guaranteeText: string
  }
  warranty?: {
    enabled: boolean
    duration: number
    unit: 'DIAS' | 'MESES'
  }
}

const PLACEHOLDER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBhqgrFbPNZs2zFtmho7lZ4fcJwHn1we56cCRq9lxJaxws7Wi_CvhbT62c9OD2I1aPkT_6sQWwxC7fHktSGU5fej1TiiwE95l9ekWnmGhNpmb--7nAGSNihSOZY8TWjmmVMGEw_jpPaVf5L411xLyFwUNRXoGeeAmaVIGdxFj_k6_1pKpet1t4nTzAFN-phOUnnUa22zEmOa3_Gi3-jyrVDpnsCG-xTht9kyGyP5ieWrn7SndCSdZAapfuYQV2adUBCe61Hj7MSz3GS'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '')

/** Config demo embebida (mismos defaults que buildDefaultConfig del backend). */
export const DEFAULT_CONFIG: TenantPageConfig = {
  slug: 'ovelix',
  enabled: true,
  brand: {
    name: 'Mi negocio',
    logoText: 'mi negocio',
    tagline: 'Reparación técnica profesional',
  },
  theme: {
    primaryColor: '#0066ff',
    onPrimary: '#ffffff',
    accentText: '#8db8f5',
    accentFill: '#7fc4e0',
    onAccentFill: '#0a2530',
    accentHover: '#5fa0be',
    secondaryFill: '#1e3f57',
    onSecondaryFill: '#cfe4f3',
    secondaryHover: '#3c517d',
  },
  contact: {
    whatsapp: 'https://wa.me/541100000000',
    phone: '+54 11 0000-0000',
    email: 'hola@ovelix.com',
    address: 'Av. del Atelier 1234',
    city: 'Recoleta, Buenos Aires',
  },
  schedule: [
    { day: 'Lunes', hours: '10:00 - 19:00' },
    { day: 'Martes', hours: '10:00 - 19:00' },
    { day: 'Miércoles', hours: '10:00 - 19:00' },
    { day: 'Jueves', hours: '10:00 - 19:00' },
    { day: 'Viernes', hours: '10:00 - 19:00' },
    { day: 'Sábado', hours: '10:00 - 14:00' },
    { day: 'Domingo', hours: '—', closed: true },
  ],
  nav: [
    { label: 'Inicio', to: '/presupuesto' },
    { label: 'Reservación', to: '/presupuesto/valuacion' },
    { label: 'Seguimiento', to: '/presupuesto/seguimiento' },
    { label: 'Servicios', to: '/presupuesto/servicios' },
  ],
  hero: {
    eyebrow: 'SERVICIO TÉCNICO ESPECIALIZADO',
    headline1: 'TU EQUIPO,',
    headlineAccent: 'COMO NUEVO',
    description:
      'Reparaciones rápidas y garantizadas con repuestos originales. Presupuesto gratis y diagnóstico en el momento.',
    cta1: 'RESERVAR AHORA',
    cta2: 'VER SERVICIOS',
    image: PLACEHOLDER_IMG,
  },
  about: {
    title: 'NUESTRO SELLO',
    description:
      'Cada equipo que recibimos pasa por un riguroso protocolo de diagnóstico y verificación antes de cualquier intervención.',
    features: [
      { title: 'Diagnóstico honesto', desc: 'Te contamos el problema real y el costo exacto antes de empezar.' },
      { title: 'Repuestos originales', desc: 'Solo trabajamos con componentes certificados de fábrica.' },
    ],
    badgeTitle: 'SERVICIO CERTIFICADO',
    badgeText: 'TÉCNICOS ESPECIALIZADOS CON GARANTÍA POR ESCRITO',
    image: PLACEHOLDER_IMG,
  },
  services: {
    eyebrow: 'CATÁLOGO',
    title: 'NUESTROS SERVICIOS',
    description: 'Precios claros, repuestos originales y garantía por escrito en cada trabajo.',
    items: [
      { icon: 'smartphone', title: 'REPARACIÓN DE CELULARES', desc: 'Pantallas, baterías y módulos reemplazados en el día.', price: 'DESDE $80' },
      { icon: 'laptop', title: 'SERVICIO DE NOTEBOOKS', desc: 'Limpieza interna, teclados y reparación de puertos.', price: 'DESDE $120' },
      { icon: 'settings', title: 'SOPORTE Y SOFTWARE', desc: 'Actualizaciones, respaldo de datos y desbloqueos.', price: 'DESDE $40' },
    ],
  },
  cta: {
    title: 'PRESUPUESTO SIN',
    accent: 'CARGO',
    description: 'Traé tu equipo, lo revisamos al instante y te pasamos el costo exacto antes de empezar.',
    button: 'PEDIR PRESUPUESTO',
  },
  footer: {
    legalPages: [
      { label: 'LEGAL', slug: 'legal', content: 'Contenido legal.' },
      { label: 'PRIVACIDAD', slug: 'privacidad', content: 'Contenido de privacidad.' },
      { label: 'GARANTÍA', slug: 'garantia', content: 'Contenido de garantía.' },
    ],
    rights: `© ${new Date().getFullYear()} Mi negocio. BUENOS AIRES, ARGENTINA.`,
  },
  valuation: {
    title: 'BUSCÁ TU SERVICIO',
    placeholder: 'INGRESÁ EL MODELO DE TU EQUIPO...',
    suggestions: ['iPhone 15 Pro', 'S24 Ultra', 'iPad Pro M4', 'MacBook Pro M3'],
    resultsTitle: 'Soluciones técnicas',
    resultsSubtitle: 'Servicios especializados encontrados',
    badgeLabel: 'Componentes originales',
    selectLabel: 'SELECCIONAR',
    results: [
      {
        badge: 'Prioridad inmediata',
        title: 'Reemplazo de pantalla',
        desc: 'Reemplazo del panel y calibración de color con componentes originales.',
        label: 'Costo estimado',
        price: 'ARS 425.000',
        img: PLACEHOLDER_IMG,
      },
      {
        badge: 'Especialista maestro',
        title: 'Restauración de placa madre',
        desc: 'Microsoldadura para fallas de circuitos de energía y daño por líquidos.',
        label: 'Desde',
        price: 'ARS 185.000',
        img: PLACEHOLDER_IMG,
      },
    ],
    helpTitle: '¿No encontrás tu problema?',
    helpDescription:
      'Ofrecemos evaluaciones de diagnóstico personalizadas para fallas poco comunes y equipos únicos.',
    helpButtons: ['CONSULTAR POR WHATSAPP', 'RESERVAR DIAGNÓSTICO'],
  },
  tracking: {
    statusLabel: 'Estado de reparación activo',
    orderCode: '#OV-1001',
    deviceName: 'Dispositivo',
    clientName: 'Cliente',
    messageButton: 'ESCRIBIR AL TALLER',
    reportButton: 'VER INFORME COMPLETO',
    steps: [
      { label: 'Paso 01', title: 'Recibido', desc: 'Registro y diagnóstico iniciados.', status: 'done', icon: 'check' },
      { label: 'En progreso', title: 'En reparación', desc: '', status: 'active', icon: 'settings' },
      { label: 'Paso 03', title: 'Control de calidad', desc: 'Pruebas de esfuerzo y verificación.', status: 'pending', icon: 'shield' },
      { label: 'Paso 04', title: 'Listo para retirar', desc: 'Embalaje final en ambiente controlado.', status: 'pending', icon: 'package' },
    ],
    progressTitle: 'Reconstrucción de circuito',
    progressPercent: 60,
    progressNote: 'Intervención en curso bajo control.',
    labLabel: 'Laboratorio principal',
    labLocation: 'Buenos Aires',
    image: PLACEHOLDER_IMG,
    imageAlt: 'Equipo en laboratorio',
    componentsTitle: 'Integridad de componentes',
    components: [
      { name: 'Pantalla', status: 'Nominal' },
      { name: 'Batería', status: 'Optimizada' },
      { name: 'Placa madre', status: 'Probada' },
    ],
    completionTitle: 'Entrega estimada',
    completionDate: 'En curso',
    completionTime: '—',
    completionNote: 'El equipo pasa una validación final antes de la entrega.',
  },
  checkout: {
    deliveryCost: 5000,
    cbu: '0000003100000000000001',
    alias: 'tu.alias.cbu',
    accountNumber: '0000000000001',
  },
  booking: {
    title: 'RESERVÁ TU REPARACIÓN',
    description:
      'Elegí tu equipo, contanos qué le pasa y te asignamos el turno. Llegás, entregás y en el momento te pasamos el presupuesto.',
    devices: [
      { id: 'iphone', title: 'IPHONE SERIES', sub: 'SERVICIO DE MICROCOMPONENTES', img: PLACEHOLDER_IMG },
      { id: 'laptop', title: 'NOTEBOOK', sub: 'ESPECIALISTA EN PLACAS', img: PLACEHOLDER_IMG },
    ],
    days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
    monthLabel: 'MES ACTUAL',
    slots: [
      { time: '09:00', avail: true },
      { time: '11:30', avail: true },
      { time: '14:00', avail: true },
      { time: '16:30', avail: false },
    ],
    serviceMap: { iphone: 'Reemplazo de pantalla', laptop: 'Restauración de placa madre' },
    priceMap: { iphone: '$45.000 ARS', laptop: '$185.000 ARS' },
    step1Title: '¿Qué equipo traés?',
    step2Title: 'Datos del cliente',
    step3Title: 'Programá la entrega',
    formLabels: [
      { label: 'NOMBRE COMPLETO', key: 'name', type: 'text', ph: 'NOMBRE Y APELLIDO' },
      { label: 'CORREO ELECTRÓNICO', key: 'email', type: 'email', ph: 'EMAIL@DOMINIO.COM' },
      { label: 'WHATSAPP', key: 'whatsapp', type: 'tel', ph: '+54 11 0000-0000' },
    ],
    slotsLabel: 'Turnos disponibles',
    summaryLabel: 'RESUMEN',
    summaryRows: [
      { label: 'EQUIPO', value: 'iPhone' },
      { label: 'SERVICIO', value: 'Reemplazo de pantalla' },
      { label: 'TIEMPO EST.', value: '3-4 horas' },
    ],
    quoteLabel: 'PRESUPUESTO',
    summerTime: '3-4 horas',
    disclaimer:
      '* El presupuesto final puede variar tras la inspección técnica. Precio con componentes certificados y garantía escrita.',
    errorInvalid: 'Completá tu nombre y tu correo electrónico.',
    submit: 'RESERVAR TURNO',
    submitting: 'PROCESANDO...',
    confirmed: '¡RESERVA CONFIRMADA!',
    guaranteeTitle: 'GARANTÍA',
    guaranteeText: 'Todos los trabajos incluyen garantía por escrito con repuestos originales.',
  },
  warranty: {
    enabled: true,
    duration: 6,
    unit: 'MESES',
  },
}

/** Devuelve el slug de empresa. Prioriza la ruta por empresa (/presupuesto.<empresa>)
 *  y el subdominio. La plantilla /presupuesto* SIEMPRE es la plantilla: nunca
 *  hereda el slug persistido en la sesión para no mezclar datos entre sitios. */
export function resolveTenantSlug(): string | null {
  const envSlug = (import.meta.env.VITE_PAGE_SLUG as string | undefined)?.trim()
  if (envSlug) return envSlug.toLowerCase()
  if (typeof window === 'undefined') return null

  // Dev en localhost: la empresa va en la URL, /presupuesto.<empresa>[/...]
  const tenantPath = /^\/presupuesto\.([^/]+)/.exec(window.location.pathname)
  if (tenantPath) return tenantPath[1].toLowerCase()

  const host = window.location.hostname || ''
  const parts = host.split('.')
  const sub = parts[0]?.toLowerCase()
  if (sub && sub !== 'www' && sub !== 'localhost') return sub

  // Ruta plantilla: aislamiento total, no se aplica ?slug= ni el slug de sesión.
  if (/^\/presupuesto\/?/.test(window.location.pathname)) return null

  // Dev en localhost (rutas no-plantilla): ?slug=EMP001 persistido en la sesión.
  const urlSlug = new URLSearchParams(window.location.search).get('slug')
  if (urlSlug?.trim()) {
    try {
      sessionStorage.setItem('ovelix_tc_slug', urlSlug.trim())
    } catch {
      /* noop */
    }
    return urlSlug.trim().toLowerCase()
  }
  try {
    const stored = sessionStorage.getItem('ovelix_tc_slug')
    if (stored?.trim()) return stored.trim().toLowerCase()
  } catch {
    /* noop */
  }
  return null
}

/** Devuelve una URL del sitio público teniendo en cuenta el slug activo.
 *  En dev: /presupuesto.<empresa>/valuacion. Sin slug: mantiene la ruta base. */
export function tenantHref(to: string): string {
  const slug = resolveTenantSlug()
  if (!slug) return to
  return to.replace('/presupuesto', `/presupuesto.${slug}`)
}

/** Trae la config pública publicada por la empresa; fallback a demo. */
export async function fetchTenantPage(slug: string | null): Promise<TenantPageConfig> {
  if (!slug) return DEFAULT_CONFIG
  try {
    const res = await fetch(`${API_BASE}/public/tenant-pages/${encodeURIComponent(slug)}`)
    if (!res.ok) return DEFAULT_CONFIG
    const json = await res.json()
    // Respuesta con envelope global del backend ({ data: { slug, config }, statusCode, ... })
    const config = json?.data?.config ?? json?.config
    if (!config) return DEFAULT_CONFIG
    return {
      ...DEFAULT_CONFIG,
      ...config,
      // El nav siempre es el de este SPA (las rutas del backend no existen acá)
      nav: DEFAULT_CONFIG.nav,
      contact: { ...DEFAULT_CONFIG.contact, ...(config.contact ?? {}) },
      booking: { ...DEFAULT_CONFIG.booking, ...(config.booking ?? {}) },
      checkout: config.checkout ?? DEFAULT_CONFIG.checkout,
      warranty: { ...DEFAULT_CONFIG.warranty, ...(config.warranty ?? {}) },
    }
  } catch {
    return DEFAULT_CONFIG
  }
}
