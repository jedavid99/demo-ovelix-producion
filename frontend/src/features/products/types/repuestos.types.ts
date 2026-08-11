import type { ElementType } from 'react'

export interface RepuestoItem {
  id: number
  name: string
  description: string
  sku: string
  category: string
  quantity: number
  status: string
  price: number
  compatibleWith: string[]
  icon: ElementType
  color: string
}

export interface NewRepuestoForm {
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  description: string
  compatibleWith: string[]
}

export interface StatusBadge {
  variant: 'success' | 'warning' | 'destructive'
  label: string
}

export interface KpiItem {
  label: string
  value: string | number
  icon: ElementType
  trend: string
  trendUp: boolean
  color: string
}
