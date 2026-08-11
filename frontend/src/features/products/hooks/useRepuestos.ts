import { useState, useMemo } from 'react'
import { Package, Filter, AlertCircle, DollarSign } from 'lucide-react'
import { toast } from '@/shared/components/ui/use-toast'
import { formatCurrency } from '@/utils/currency'
import { repuestosData } from '../services/repuestosApi'
import type { RepuestoItem, NewRepuestoForm, KpiItem, StatusBadge } from '../types/repuestos.types'

export function useRepuestos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRepuesto, setNewRepuesto] = useState<NewRepuestoForm>({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    description: '',
    compatibleWith: [],
  })
  const [compatibilityInput, setCompatibilityInput] = useState('')

  const filteredItems = useMemo(() => {
    return repuestosData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        activeCategory === 'all' || item.category.toLowerCase() === activeCategory
      const matchesStatus =
        activeStatus === 'all' ||
        (activeStatus === 'good' && item.status === 'Good') ||
        (activeStatus === 'low' && item.status === 'Low') ||
        (activeStatus === 'out' && item.status === 'Out')
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, activeCategory, activeStatus])

  const totalItems = repuestosData.length
  const totalCategories = new Set(repuestosData.map((i) => i.category)).size
  const lowStockItems = repuestosData.filter((i) => i.quantity < 5 && i.quantity > 0).length
  const totalValue = repuestosData.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const kpiData: KpiItem[] = [
    {
      label: 'Repuestos totales',
      value: totalItems,
      icon: Package,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-blue-600',
    },
    {
      label: 'Categorías',
      value: totalCategories,
      icon: Filter,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-indigo-600',
    },
    {
      label: 'Stock bajo',
      value: lowStockItems,
      icon: AlertCircle,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-amber-600',
    },
    {
      label: 'Valor total',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-emerald-600',
    },
  ]

  const getStatusBadge = (status: string, quantity: number): StatusBadge => {
    if (quantity === 0) return { variant: 'destructive', label: 'Agotado' }
    if (quantity < 5) return { variant: 'warning', label: 'Bajo stock' }
    return { variant: 'success', label: 'En stock' }
  }

  const handleNewRepuestoChange = (field: string, value: string | number) => {
    setNewRepuesto((prev) => ({ ...prev, [field]: value }))
  }

  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput
    if (newDevice && !newRepuesto.compatibleWith.includes(newDevice)) {
      setNewRepuesto((prev) => ({
        ...prev,
        compatibleWith: [...prev.compatibleWith, newDevice],
      }))
      setCompatibilityInput('')
    }
  }

  const removeCompatibility = (device: string) => {
    setNewRepuesto((prev) => ({
      ...prev,
      compatibleWith: prev.compatibleWith.filter((d) => d !== device),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCompatibility(compatibilityInput)
    }
  }

  const handleSaveRepuesto = () => {
    if (!newRepuesto.name || !newRepuesto.sku || !newRepuesto.category) {
      toast({ title: 'Error', description: 'Por favor completa los campos obligatorios: Nombre, SKU y Categoría.', variant: 'destructive' })
      return
    }
    toast({ title: 'Éxito', description: 'Repuesto guardado correctamente.' })
    setIsModalOpen(false)
    setNewRepuesto({
      name: '', sku: '', category: '', quantity: 0, price: 0, description: '', compatibleWith: [],
    })
    setCompatibilityInput('')
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setActiveStatus('all')
    setSearchTerm('')
  }

  return {
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    activeStatus, setActiveStatus,
    loading,
    isModalOpen, setIsModalOpen,
    newRepuesto,
    compatibilityInput, setCompatibilityInput,
    filteredItems,
    totalItems,
    kpiData,
    getStatusBadge,
    handleNewRepuestoChange,
    addCompatibility,
    removeCompatibility,
    handleKeyPress,
    handleSaveRepuesto,
    clearFilters,
  }
}
