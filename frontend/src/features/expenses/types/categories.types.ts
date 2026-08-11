import type { LucideIcon } from 'lucide-react'

export interface Category {
  id: string
  name: string
  description: string
  type: 'income' | 'expense'
  status: 'active' | 'inactive'
  icon: string
  expenseCount: number
  totalAmount: number
}

export interface KpiItem {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  bgColor: string
}