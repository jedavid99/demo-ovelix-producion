import { useState, useEffect, useCallback } from 'react'
import { FolderOpen, Tag, TrendingUp, DollarSign } from 'lucide-react'
import { expenseService } from '@/services/expenseService'
import { formatCurrency } from '@/utils/currency'
import type { Category, KpiItem } from '../types/categories.types'
import { ITEMS_PER_PAGE } from '../constants/categories.constants'

interface UseCategoriesResult {
  categories: Category[]
  categoryTotals: Record<string, number>
  totalExpenses: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  searchTerm: string
  setSearchTerm: (val: string) => void
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  filteredCategories: Category[]
  paginatedCategories: Category[]
  totalPages: number
  kpiData: KpiItem[]
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({})
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [catRes, sumRes] = await Promise.all([
        expenseService.getCategories(),
        expenseService.getSummary(),
      ])

      const catWrapper = catRes as unknown as Record<string, unknown>
      const names = Array.isArray(catRes)
        ? (catRes as string[])
        : Array.isArray(catWrapper?.data)
          ? (catWrapper.data as string[])
          : []

      const sumWrapper = sumRes as unknown as Record<string, unknown>
      const summary = (sumWrapper?.data ?? sumRes) as {
        totalSpent?: number
        categoryTotals?: Record<string, number>
      }
      const totals = summary?.categoryTotals ?? {}
      const spent = Number(summary?.totalSpent) || 0

      setCategoryTotals(totals)
      setTotalExpenses(spent)

      const list: Category[] = names
        .map((name) => ({
          id: name,
          name,
          description: '',
          type: 'expense' as const,
          status: 'active' as const,
          icon: 'Tag',
          expenseCount: 0,
          totalAmount: totals[name] ?? 0,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)

      setCategories(list)
      setCurrentPage(1)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string }
      setError(e?.response?.data?.message || e?.message || 'Error al cargar las categorías')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE))

  const kpiData: KpiItem[] = [
    { label: 'Total Categorías', value: categories.length, icon: FolderOpen, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Con Gastos', value: categories.filter((c) => c.totalAmount > 0).length, icon: Tag, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Categoría Principal', value: categories[0]?.name ?? '—', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { label: 'Total Gastado', value: formatCurrency(totalExpenses), icon: DollarSign, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ]

  const clearFilters = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm !== ''

  return {
    categories,
    categoryTotals,
    totalExpenses,
    loading,
    error,
    refetch: fetch,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    filteredCategories,
    paginatedCategories,
    totalPages,
    kpiData,
    clearFilters,
    hasActiveFilters,
  }
}
