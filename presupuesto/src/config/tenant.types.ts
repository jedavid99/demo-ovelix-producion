export interface TenantTheme {
  /** Fill de botones/acciones principales (primary-container) */
  primaryColor: string
  /** Texto sobre primaryColor */
  onPrimary: string
  /** Texto de acento (links, precios, labels) */
  accentText: string
  /** Fill/accento claro (secondary) */
  accentFill: string
  /** Texto sobre accentFill */
  onAccentFill: string
  /** Hover de accentFill */
  accentHover: string
  /** Fill secundario profundo (secondary-container) */
  secondaryFill: string
  /** Texto sobre secondaryFill */
  onSecondaryFill: string
  /** Hover de secondaryFill */
  secondaryHover: string
}

export interface TenantContact {
  whatsapp?: string
  phone?: string
  email?: string
  address?: string
  city?: string
}

export interface TenantServiceItem {
  icon: string
  title: string
  desc: string
  price: string
}

export interface TenantBookingDevice {
  id: string
  title: string
  sub: string
  img: string
}

export interface TenantBookingSlot {
  time: string
  avail: boolean
}

export interface TenantResultsItem {
  badge: string
  title: string
  desc: string
  label: string
  price: string
  img?: string
}

export interface TenantRepairCost {
  id: string
  nombre: string
  categoria: string
  precio: number
  tiempo_estimado: string | null
  descripcion: string | null
  notas: string | null
  modelo: string | null
}

export interface TenantTrackingStep {
  label: string
  title: string
  desc: string
  status: 'done' | 'active' | 'pending'
  icon: string
}

export interface TenantTrackingComponent {
  name: string
  status: string
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
  contact: TenantContact
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
    items: TenantServiceItem[]
  }
  cta: {
    title: string
    accent: string
    description: string
    button: string
  }
  footer: {
    legalPages: { label: string; slug: string; content: string }[]
    rights: string
  }
  valuation: {
    title: string
    placeholder: string
    suggestions: string[]
    resultsTitle: string
    resultsSubtitle: string
    badgeLabel: string
    selectLabel: string
    results: TenantResultsItem[]
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
    steps: TenantTrackingStep[]
    progressTitle: string
    progressPercent: number
    progressNote: string
    labLabel: string
    labLocation: string
    image: string
    imageAlt: string
    componentsTitle: string
    components: TenantTrackingComponent[]
    completionTitle: string
    completionDate: string
    completionTime: string
    completionNote: string
  }
  booking: {
    title: string
    description: string
    devices: TenantBookingDevice[]
    days: string[]
    monthLabel: string
    slots: TenantBookingSlot[]
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
  checkout?: {
    deliveryCost: number
    cbu: string
    alias: string
    accountNumber: string
  }
}