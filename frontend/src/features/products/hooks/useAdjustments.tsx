import { useState, useMemo } from 'react'
import { Package, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from '@/shared/components/ui/use-toast'
import { adjustmentsData } from '../services/adjustmentsApi'
import { typeLabels, typeColors, statusColors, statusLabels } from '../constants/adjustments.constants'
import type { AdjustmentItem, NewAdjustmentForm, KpiItem, AdjustmentType, AdjustmentStatus } from '../types/adjustments.types'

export function useAdjustments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeType, setActiveType] = useState<string>('all')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAdjustment, setNewAdjustment] = useState<NewAdjustmentForm>({
    productName: '',
    productSku: '',
    type: 'entry',
    quantity: 0,
    reason: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    user: 'Usuario actual',
  })

  const filteredItems = useMemo(() => {
    return adjustmentsData.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = activeType === 'all' || item.type === activeType
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, activeType, activeStatus])

  const totalAdjustments = adjustmentsData.length
  const totalEntries = adjustmentsData.filter((i) => i.type === 'entry').length
  const totalExits = adjustmentsData.filter((i) => i.type === 'exit').length
  const totalProductsAffected = new Set(adjustmentsData.map((i) => i.productName)).size
  const netQuantity = adjustmentsData.reduce((sum, i) => {
    if (i.type === 'entry' || i.type === 'return') return sum + i.quantity
    if (i.type === 'exit') return sum - i.quantity
    return sum
  }, 0)

  const kpiData: KpiItem[] = [
    { label: 'Total ajustes', value: totalAdjustments, icon: Package, trend: 'Sin datos', trendUp: false, color: 'text-primary' },
    { label: 'Entradas', value: totalEntries, icon: TrendingUp, trend: 'Sin datos', trendUp: true, color: 'text-emerald-600' },
    { label: 'Salidas', value: totalExits, icon: TrendingDown, trend: 'Sin datos', trendUp: false, color: 'text-destructive' },
    { label: 'Productos afectados', value: totalProductsAffected, icon: Package, trend: 'Sin datos', trendUp: false, color: 'text-indigo-600' },
  ]

  const getTypeBadge = (type: string) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeColors[type]}`}>
      {typeLabels[type] || type}
    </span>
  )

  const getStatusBadge = (status: string) => (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[status]}`}>
      {statusLabels[status] || status}
    </span>
  )

  const handleNewAdjustmentChange = (field: string, value: string | number) => {
    setNewAdjustment((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveAdjustment = () => {
    if (!newAdjustment.productName || !newAdjustment.type || newAdjustment.quantity === 0) {
      toast({ title: 'Error', description: 'Por favor completa los campos obligatorios: Producto, Tipo y Cantidad.', variant: 'destructive' })
      return
    }
    toast({ title: 'Éxito', description: 'Ajuste guardado correctamente.' })
    setIsModalOpen(false)
    setNewAdjustment({
      productName: '', productSku: '', type: 'entry', quantity: 0,
      reason: '', notes: '', date: new Date().toISOString().split('T')[0], user: 'Usuario actual',
    })
  }

  const clearFilters = () => {
    setActiveType('all')
    setActiveStatus('all')
    setSearchTerm('')
  }

  return {
    searchTerm, setSearchTerm,
    activeType, setActiveType,
    activeStatus, setActiveStatus,
    loading,
    isModalOpen, setIsModalOpen,
    newAdjustment,
    filteredItems,
    totalAdjustments,
    kpiData,
    getTypeBadge,
    getStatusBadge,
    handleNewAdjustmentChange,
    handleSaveAdjustment,
    clearFilters,
  }
}
