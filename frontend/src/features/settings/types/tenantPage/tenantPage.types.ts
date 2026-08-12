export interface TenantTheme {
  primaryColor: string;
  onPrimary: string;
  accentText: string;
  accentFill: string;
  onAccentFill: string;
  accentHover: string;
  secondaryFill: string;
  onSecondaryFill: string;
  secondaryHover: string;
}

export interface TenantContact {
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
}

export interface TenantServiceItem {
  icon: string;
  title: string;
  desc: string;
  price: string;
}

export interface TenantPageConfig {
  slug: string;
  enabled: boolean;
  brand: {
    name: string;
    logoText: string;
    tagline: string;
  };
  theme: TenantTheme;
  contact: TenantContact;
  nav: { label: string; to: string }[];
  hero: {
    eyebrow: string;
    headline1: string;
    headlineAccent: string;
    description: string;
    cta1: string;
    cta2: string;
    image: string;
  };
  about: {
    title: string;
    description: string;
    features: { title: string; desc: string }[];
    badgeTitle: string;
    badgeText: string;
    image: string;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: TenantServiceItem[];
  };
  cta: {
    title: string;
    accent: string;
    description: string;
    button: string;
  };
  footer: {
    legal: string[];
    rights: string;
  };
  valuation: {
    title: string;
    placeholder: string;
    suggestions: string[];
    resultsTitle: string;
    resultsSubtitle: string;
    badgeLabel: string;
    selectLabel: string;
    results: { badge: string; title: string; desc: string; label: string; price: string; img: string }[];
    helpTitle: string;
    helpDescription: string;
    helpButtons: string[];
  };
  tracking: {
    statusLabel: string;
    orderCode: string;
    deviceName: string;
    clientName: string;
    messageButton: string;
    reportButton: string;
    steps: { label: string; title: string; desc: string; status: 'done' | 'active' | 'pending'; icon: string }[];
    progressTitle: string;
    progressPercent: number;
    progressNote: string;
    labLabel: string;
    labLocation: string;
    image: string;
    imageAlt: string;
    componentsTitle: string;
    components: { name: string; status: string }[];
    completionTitle: string;
    completionDate: string;
    completionTime: string;
    completionNote: string;
  };
  booking: {
    title: string;
    description: string;
    devices: { id: string; title: string; sub: string; img: string }[];
    days: string[];
    monthLabel: string;
    slots: { time: string; avail: boolean }[];
    serviceMap: Record<string, string>;
    priceMap: Record<string, string>;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    formLabels: { label: string; key: string; type: string; ph: string }[];
    slotsLabel: string;
    summaryLabel: string;
    summaryRows: { label: string; value: string }[];
    quoteLabel: string;
    summerTime: string;
    disclaimer: string;
    errorInvalid: string;
    submit: string;
    submitting: string;
    confirmed: string;
    guaranteeTitle: string;
    guaranteeText: string;
  };
}

export interface TenantPageResponse {
  company: {
    id: string;
    slug: string;
    razon_social: string;
  };
  enabled: boolean;
  updated_at: string | null;
  config: TenantPageConfig;
}