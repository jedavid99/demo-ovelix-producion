import { useState, useEffect, useMemo } from 'react'
import { format, subDays, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { MdBuild, MdCheckCircle, MdPending, MdAttachMoney, MdSchedule, MdTrendingUp } from 'react-icons/md'
import { fetchRepairsData } from '../services/repairsReportApi'
import { STATUS_COLORS, DEVICE_COLORS, ITEMS_PER_PAGE, formatCurrency } from '../constants/repairsReport.constants'
import type { Repair, RepairByStatus, RepairByDevice, RepairTimeline, PeriodType, KpiItem } from '../types/repairsReport.types'

export function useRepairsReport() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState<PeriodType>('30 días')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(false)
      const { repairs: mappedRepairs } = await fetchRepairsData()
      setRepairs(mappedRepairs)
    } catch (err) {
      console.error('Error fetching repairs:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filteredRepairs = useMemo(() => {
    const now = new Date()
    return repairs.filter((repair) => {
      let matchesPeriod = true
      if (period === 'Hoy') matchesPeriod = repair.date.toDateString() === now.toDateString()
      else if (period === '7 días') matchesPeriod = repair.date >= subDays(now, 7)
      else if (period === '30 días') matchesPeriod = repair.date >= subDays(now, 30)
      else if (period === 'Este año') matchesPeriod = repair.date >= startOfYear(now)
      else if (period === 'Personalizado' && customRange.start && customRange.end)
        matchesPeriod = repair.date >= new Date(customRange.start) && repair.date <= new Date(customRange.end)
      return matchesPeriod
    })
  }, [repairs, period, customRange])

  const totalRepairs = filteredRepairs.length
  const completedRepairs = filteredRepairs.filter(r => r.status === 'Completado').length
  const pendingRepairs = filteredRepairs.filter(r => r.status === 'Pendiente' || r.status === 'En Progreso').length
  const totalRevenue = filteredRepairs.reduce((sum, r) => sum + r.cost, 0)
  const averageRepairCost = totalRepairs > 0 ? totalRevenue / totalRepairs : 0
  const completedWithDate = filteredRepairs.filter(r => r.status === 'Completado' && r.completedDate)
  const averageRepairTime = completedWithDate.length > 0
    ? completedWithDate.reduce((sum, r) => sum + (r.completedDate!.getTime() - r.date.getTime()), 0) / completedWithDate.length / (1000 * 60 * 60 * 24)
    : 0

  const repairsByStatus: RepairByStatus[] = [
    { name: 'Pendiente', value: filteredRepairs.filter(r => r.status === 'Pendiente').length, color: STATUS_COLORS['Pendiente'] },
    { name: 'En Progreso', value: filteredRepairs.filter(r => r.status === 'En Progreso').length, color: STATUS_COLORS['En Progreso'] },
    { name: 'Completado', value: filteredRepairs.filter(r => r.status === 'Completado').length, color: STATUS_COLORS['Completado'] },
    { name: 'Cancelado', value: filteredRepairs.filter(r => r.status === 'Cancelado').length, color: STATUS_COLORS['Cancelado'] },
  ]

  const deviceCounts = filteredRepairs.reduce((acc, r) => {
    acc[r.deviceType] = (acc[r.deviceType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const repairsByDevice: RepairByDevice[] = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }))

  const timelineData = useMemo((): RepairTimeline[] => {
    const days = 7
    const now = new Date()
    const timeline: Record<string, { repairs: number; revenue: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i)
      timeline[format(date, 'yyyy-MM-dd')] = { repairs: 0, revenue: 0 }
    }
    filteredRepairs.forEach(repair => {
      const key = format(repair.date, 'yyyy-MM-dd')
      if (timeline[key]) {
        timeline[key].repairs += 1
        if (repair.status === 'Completado') timeline[key].revenue += repair.cost
      }
    })
    return Object.entries(timeline).map(([date, data]) => ({
      date: format(new Date(date), 'dd/MM'),
      repairs: data.repairs,
      revenue: data.revenue,
    }))
  }, [filteredRepairs])

  const paginatedRepairs = filteredRepairs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(filteredRepairs.length / ITEMS_PER_PAGE)

  const primaryKpis: KpiItem[] = [
    { label: 'Total de reparaciones', value: totalRepairs, icon: MdBuild, iconBg: 'bg-primary/10', iconColor: 'text-primary', badge: filteredRepairs.length > 0 ? { text: '+5%', variant: 'success' } : undefined },
    { label: 'Reparaciones completadas', value: completedRepairs, icon: MdCheckCircle, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600', badge: filteredRepairs.length > 0 ? { text: '+12%', variant: 'success' } : undefined },
    { label: 'Reparaciones pendientes', value: pendingRepairs, icon: MdPending, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
    { label: 'Ingresos por reparaciones', value: formatCurrency(totalRevenue), icon: MdAttachMoney, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
  ]

  const secondaryKpis: KpiItem[] = [
    { label: 'Tiempo promedio de reparación', value: `${averageRepairTime.toFixed(1)} días`, icon: MdSchedule, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600' },
    { label: 'Costo promedio por reparación', value: formatCurrency(averageRepairCost), icon: MdAttachMoney, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-600' },
  ]

  return {
    loading, error, period, setPeriod, customRange, setCustomRange,
    currentPage, setCurrentPage,
    filteredRepairs, paginatedRepairs, totalPages,
    totalRepairs, completedRepairs, pendingRepairs, totalRevenue,
    repairsByStatus, repairsByDevice, timelineData,
    primaryKpis, secondaryKpis,
    handleRetry: fetchData,
  }
}
