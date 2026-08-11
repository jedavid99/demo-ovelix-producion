import { useState, useEffect, useMemo } from 'react'
import { format, subDays, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { exportToCSV } from '@/shared/lib/export'
import type { Sale, PeriodType, EvolutionData, CategoryData, TopProduct } from '../types/salesReport.types'
import { ITEMS_PER_PAGE } from '../constants/salesReport.constants'

export function useSalesReport() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState<PeriodType>('30 días')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [sales, setSales] = useState<Sale[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      if (period === 'Personalizado' && customRange.start && customRange.end) {
        const saleDate = new Date(sale.date)
        const start = new Date(customRange.start)
        const end = new Date(customRange.end)
        return saleDate >= start && saleDate <= end
      }
      const now = new Date()
      switch (period) {
        case 'Hoy':
          return sale.date.toDateString() === now.toDateString()
        case '7 días':
          return sale.date >= subDays(now, 7)
        case '30 días':
          return sale.date >= subDays(now, 30)
        case 'Este año':
          return sale.date >= startOfYear(now)
        default:
          return true
      }
    })
  }, [sales, period, customRange])

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalSales = filteredSales.length
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0

  const productSales = filteredSales.reduce((acc, sale) => {
    if (sale.status === 'Completada') {
      acc[sale.product] = (acc[sale.product] || 0) + sale.quantity
    }
    return acc
  }, {} as Record<string, number>)

  const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]

  const evolutionData: EvolutionData[] = useMemo(() => {
    return filteredSales
      .filter(s => s.status === 'Completada')
      .reduce((acc, sale) => {
        const dateStr = format(sale.date, 'dd/MM', { locale: es })
        const existing = acc.find(d => d.date === dateStr)
        if (existing) {
          existing.amount += sale.total
        } else {
          acc.push({ date: dateStr, amount: sale.total })
        }
        return acc
      }, [] as EvolutionData[])
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [filteredSales])

  const categoryData: CategoryData[] = useMemo(() => {
    return filteredSales
      .filter(s => s.status === 'Completada')
      .reduce((acc, sale) => {
        const existing = acc.find(c => c.name === sale.category)
        if (existing) {
          existing.value += sale.total
          existing.count += sale.quantity
        } else {
          acc.push({ name: sale.category, value: sale.total, count: sale.quantity })
        }
        return acc
      }, [] as CategoryData[])
  }, [filteredSales])

  const topProducts: TopProduct[] = useMemo(() => {
    return Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity], index) => ({ name, quantity, position: index + 1 }))
  }, [productSales])

  const maxQuantity = Math.max(...topProducts.map(p => p.quantity), 1)

  const paginatedSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE)

  const handleExport = () => {
    const csvData = filteredSales.map(sale => ({
      Fecha: format(sale.date, 'dd/MM/yyyy', { locale: es }),
      Cliente: sale.client,
      Producto: sale.product,
      Cantidad: sale.quantity,
      Total: sale.total,
      Estado: sale.status,
      Categoría: sale.category,
    }))
    exportToCSV(csvData, 'reporte-ventas')
  }

  const handleRetry = () => {
    setError(false)
    setLoading(true)
    setLoading(false)
  }

  return {
    loading,
    error,
    period,
    setPeriod,
    customRange,
    setCustomRange,
    currentPage,
    setCurrentPage,
    filteredSales,
    paginatedSales,
    totalPages,
    totalRevenue,
    totalSales,
    avgTicket,
    topProduct,
    evolutionData,
    categoryData,
    topProducts,
    maxQuantity,
    handleExport,
    handleRetry,
    itemsPerPage: ITEMS_PER_PAGE,
  }
}
