import { z } from 'zod';

const colorSchema = z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Color inválido, usá formato #RRGGBB');

export const tenantThemeSchema = z.object({
  primaryColor: colorSchema,
  onPrimary: colorSchema,
  accentText: colorSchema,
  accentFill: colorSchema,
  onAccentFill: colorSchema,
  accentHover: colorSchema,
  secondaryFill: colorSchema,
  onSecondaryFill: colorSchema,
  secondaryHover: colorSchema,
});

export const tenantContactSchema = z.object({
  whatsapp: z.string().url().optional(),
  phone: z.string().max(50).optional(),
  email: z.string().email().optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(200).optional(),
  mapEmbed: z.string().max(3000).optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
});

export const tenantNavItemSchema = z.object({
  label: z.string().min(1).max(40),
  to: z.string().min(1).max(60),
});

export const tenantHeroSchema = z.object({
  eyebrow: z.string().max(160),
  headline1: z.string().max(120),
  headlineAccent: z.string().max(120),
  description: z.string().max(500),
  cta1: z.string().max(80),
  cta2: z.string().max(80),
  image: z.string().url(),
});

export const tenantAboutSchema = z.object({
  title: z.string().max(120),
  description: z.string().max(800),
  features: z.array(
    z.object({
      title: z.string().max(120),
      desc: z.string().max(400),
    }),
  ).max(4),
  badgeTitle: z.string().max(120),
  badgeText: z.string().max(200),
  image: z.string().url(),
});

export const tenantServiceItemSchema = z.object({
  icon: z.string().max(40),
  title: z.string().max(120),
  desc: z.string().max(400),
  price: z.string().max(60),
});

export const tenantServicesSchema = z.object({
  eyebrow: z.string().max(120),
  title: z.string().max(120),
  description: z.string().max(400),
  items: z.array(tenantServiceItemSchema).max(12),
});

export const tenantCtaSchema = z.object({
  title: z.string().max(120),
  accent: z.string().max(120),
  description: z.string().max(500),
  button: z.string().max(80),
});

export const tenantScheduleRowSchema = z.object({
  day: z.string().min(1).max(40),
  hours: z.string().max(60),
  closed: z.boolean().optional(),
});

export const tenantLegalPageSchema = z.object({
  label: z.string().min(1).max(60),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, 'Slug inválido: solo minúsculas, números y guiones'),
  content: z.string().max(10000),
});

export const tenantFooterSchema = z.object({
  legalPages: z.array(tenantLegalPageSchema).max(10).default([]),
  rights: z.string().max(200),
});

export const tenantResultsItemSchema = z.object({
  badge: z.string().max(80),
  title: z.string().max(120),
  desc: z.string().max(500),
  label: z.string().max(80),
  price: z.string().max(60),
  img: z.string().url().optional(),
});

export const tenantValuationSchema = z.object({
  title: z.string().max(120),
  placeholder: z.string().max(120),
  suggestions: z.array(z.string().max(80)).max(10),
  resultsTitle: z.string().max(120),
  resultsSubtitle: z.string().max(200),
  badgeLabel: z.string().max(120),
  selectLabel: z.string().max(60),
  results: z.array(tenantResultsItemSchema).max(12),
  helpTitle: z.string().max(160),
  helpDescription: z.string().max(500),
  helpButtons: z.array(z.string().max(80)).max(4),
});

export const tenantTrackingStepSchema = z.object({
  label: z.string().max(80),
  title: z.string().max(120),
  desc: z.string().max(400),
  status: z.enum(['done', 'active', 'pending']),
  icon: z.string().max(40),
});

export const tenantTrackingComponentSchema = z.object({
  name: z.string().max(120),
  status: z.string().max(80),
});

export const tenantTrackingSchema = z.object({
  statusLabel: z.string().max(120),
  orderCode: z.string().max(40),
  deviceName: z.string().max(120),
  clientName: z.string().max(120),
  messageButton: z.string().max(80),
  reportButton: z.string().max(80),
  steps: z.array(tenantTrackingStepSchema).max(10),
  progressTitle: z.string().max(120),
  progressPercent: z.number().min(0).max(100),
  progressNote: z.string().max(400),
  labLabel: z.string().max(120),
  labLocation: z.string().max(160),
  image: z.string().url(),
  imageAlt: z.string().max(160),
  componentsTitle: z.string().max(120),
  components: z.array(tenantTrackingComponentSchema).max(20),
  completionTitle: z.string().max(120),
  completionDate: z.string().max(60),
  completionTime: z.string().max(60),
  completionNote: z.string().max(500),
});

export const tenantBookingDeviceSchema = z.object({
  id: z.string().max(40),
  title: z.string().max(120),
  sub: z.string().max(160),
  img: z.string().url(),
});

export const tenantBookingSlotSchema = z.object({
  time: z.string().max(20),
  avail: z.boolean(),
});

export const tenantBookingSchema = z.object({
  title: z.string().max(160),
  description: z.string().max(500),
  devices: z.array(tenantBookingDeviceSchema).max(10),
  days: z.array(z.string().max(10)).max(10),
  monthLabel: z.string().max(60),
  slots: z.array(tenantBookingSlotSchema).max(12),
  serviceMap: z.record(z.string(), z.string().max(160)),
  priceMap: z.record(z.string(), z.string().max(80)),
  step1Title: z.string().max(120),
  step2Title: z.string().max(120),
  step3Title: z.string().max(120),
  formLabels: z
    .array(
      z.object({
        label: z.string().max(120),
        key: z.string().max(40),
        type: z.string().max(20),
        ph: z.string().max(120),
      }),
    )
    .max(10),
  slotsLabel: z.string().max(120),
  summaryLabel: z.string().max(120),
  summaryRows: z.array(z.object({ label: z.string().max(120), value: z.string().max(200) })).max(10),
  quoteLabel: z.string().max(120),
  summerTime: z.string().max(60),
  disclaimer: z.string().max(400),
  errorInvalid: z.string().max(200),
  submit: z.string().max(80),
  submitting: z.string().max(80),
  confirmed: z.string().max(120),
  guaranteeTitle: z.string().max(120),
  guaranteeText: z.string().max(300),
});

export const tenantCheckoutSchema = z.object({
  deliveryCost: z.number().min(0).max(99999999),
  cbu: z.string().max(60),
  alias: z.string().max(120),
  accountNumber: z.string().max(60),
});

export const tenantWarrantySchema = z.object({
  enabled: z.boolean(),
  duration: z.number().int().min(1).max(120),
  unit: z.enum(['DIAS', 'MESES']),
});

export const tenantPageConfigSchema = z.object({
  slug: z.string().max(80),
  enabled: z.boolean(),
  brand: z.object({
    name: z.string().max(120),
    logoText: z.string().max(60),
    tagline: z.string().max(200),
    logo: z.string().max(300000).optional(),
  }),
  theme: tenantThemeSchema,
  contact: tenantContactSchema,
  schedule: z.array(tenantScheduleRowSchema).max(20).default([]),
  nav: z.array(tenantNavItemSchema).max(10),
  hero: tenantHeroSchema,
  about: tenantAboutSchema,
  services: tenantServicesSchema,
  cta: tenantCtaSchema,
  footer: tenantFooterSchema,
  valuation: tenantValuationSchema,
  tracking: tenantTrackingSchema,
  booking: tenantBookingSchema,
  checkout: tenantCheckoutSchema,
  warranty: tenantWarrantySchema.optional(),
});

export const updateTenantPageSchema = z.object({
  config: tenantPageConfigSchema,
  enabled: z.boolean().optional(),
});

export type TenantPageConfigDto = z.infer<typeof tenantPageConfigSchema>;
export type UpdateTenantPageDto = z.infer<typeof updateTenantPageSchema>;
