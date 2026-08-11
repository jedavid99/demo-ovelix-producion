import type { ReactNode } from 'react'

export type VerificationVariant = 'primary' | 'outline' | 'danger' | 'success'

export type DataKind = 'imei' | 'serial' | 'cuit' | 'none'

export interface VerificationAction {
  id: string
  label: string
  url: string
  dataKind: DataKind
  needsData: boolean
  variant: VerificationVariant
  /** Tailwind color classes used when `variant` resolves to a brand tint. */
  tint: string
}

export interface VerificationCategory {
  id: string
  title: string
  hint: string
  tint: string
  actions: VerificationAction[]
}

export interface VerificationButtonProps {
  label: string
  icon?: ReactNode
  data: string
  url: string
  copyData?: boolean
  /** Solo copia el dato, sin abrir la URL (para pegar manualmente). */
  copyOnly?: boolean
  variant?: VerificationVariant
  tint?: string
  className?: string
  disabled?: boolean
  onCopied?: (ok: boolean) => void
}

export interface QuickVerificationPanelProps {
  categories?: VerificationCategory[]
  disabled?: boolean
  className?: string
}