import type { VerificationCategory } from './types'

/**
 * Botones de verificación rápida agrupados por categoría.
 * Todas las acciones copian el dato al portapapeles y abren la página en una pestaña nueva,
 * salvo `needsData === false` (abre la página y no copia nada).
 * No requiere claves API ni scraping: solo navegación + clipboard.
 */
export const QUICK_VERIFICATION_CATEGORIES: VerificationCategory[] = [
  {
    id: 'equipo',
    title: 'Verificación de equipo',
    hint: 'Estado del IMEI en bases públicas',
    tint: 'red',
    actions: [
      {
        id: 'enacom',
        label: 'ENACOM',
        url: 'https://www.enacom.gob.ar/imei',
        dataKind: 'imei',
        needsData: true,
        variant: 'danger',
        tint: 'bg-red-600 hover:bg-red-500 text-white',
      },
      {
        id: 'imeicheck',
        label: 'imeicheck',
        url: 'https://imeicheck.com/es/verificador-imei#google_vignette',
        dataKind: 'imei',
        needsData: true,
        variant: 'success',
        tint: 'bg-sky-600 hover:bg-sky-500 text-white',
      },
      {
        id: 'imei.info',
        label: 'imei.info IMEI',
        url: 'https://www.imei.info/es/',
        dataKind: 'imei',
        needsData: true,
        variant: 'success',
        tint: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      },
    ],
  },
  {
    id: 'apple',
    title: 'IMEI Apple',
    hint: 'Estado del IMEI en bases públicas',
    tint: 'neutral',
    actions: [
      {
        id: 'apple-coverage',
        label: 'IMEI Apple',
        url: 'https://www.imeipro.info/check_imei_iphone.html',
        dataKind: 'serial',
        needsData: true,
        variant: 'primary',
        tint: 'bg-zinc-800 hover:bg-zinc-700 text-white',
      },
    ],
  },
  {
    id: 'samsung',
    title: 'Verificación Samsung',
    hint: 'Soporte oficial (no usa IMEI)',
    tint: 'brand',
    actions: [
      {
        id: 'samsung-ar',
        label: 'Soporte Samsung',
        url: 'https://www.samsung.com/ar/support/',
        dataKind: 'none',
        needsData: false,
        variant: 'primary',
        tint: 'bg-blue-600 hover:bg-blue-500 text-white',
      },
    ],
  },
  {
    id: 'cliente',
    title: 'Verificación de cliente',
    hint: 'Situación crediticia por CUIT/CUIL',
    tint: 'success',
    actions: [
      {
        id: 'bcra',
        label: 'BCRA - Deudores',
        url: 'https://www.bcra.gob.ar/situacion-crediticia/',
        dataKind: 'cuit',
        needsData: true,
        variant: 'success',
        tint: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      },
    ],
  },
  {
    id: 'consolas',
    title: 'Verificación de consolas',
    hint: 'Garantía y soporte PlayStation',
    tint: 'console',
    actions: [
      {
        id: 'playstation',
        label: 'PlayStation',
        url: 'https://www.playstation.com/support/',
        dataKind: 'serial',
        needsData: true,
        variant: 'primary',
        tint: 'bg-indigo-900 hover:bg-indigo-800 text-white',
      },
    ],
  },
]

export const CATEGORY_TINT_ACCENT: Record<string, string> = {
  red: 'bg-red-500',
  neutral: 'bg-zinc-500',
  brand: 'bg-blue-500',
  success: 'bg-emerald-500',
  console: 'bg-indigo-700',
}

/** Icono/burbuja y clases de cada categoría para las tarjetas animadas. */
export const CATEGORY_TINT_STYLE: Record<string, { chip: string; dot: string }> = {
  red: {
    chip: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20',
    dot: 'bg-red-500',
  },
  neutral: {
    chip: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 ring-zinc-500/20',
    dot: 'bg-zinc-500',
  },
  brand: {
    chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
    dot: 'bg-blue-500',
  },
  success: {
    chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  console: {
    chip: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20',
    dot: 'bg-indigo-500',
  },
}

/** Ícono representativo por categoría (para el panel). */
export const CATEGORY_ICON: Record<string, 'smartphone' | 'cpu' | 'user' | 'gamepad'> = {
  equipo: 'smartphone',
  apple: 'smartphone',
  samsung: 'cpu',
  cliente: 'user',
  consolas: 'gamepad',
}