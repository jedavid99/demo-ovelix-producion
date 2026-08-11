import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, CheckCircle, Navigation, Wrench, AlertCircle } from 'lucide-react'
import { initialRemises } from '../services/shipmentsApi'
import { STATUS_BADGES, ITEMS_PER_PAGE } from '../constants/shipments.constants'
import { toast } from '@/shared/components/ui/use-toast'
import type { Remise, NewRemiseForm, KpiItem, StatusBadge, RemiseStatus } from '../types/shipments.types'

import React from 'react'

export function getStatusIcon(status: RemiseStatus) {
  const icons: Record<RemiseStatus, React.ReactNode> = {
    disponible: <CheckCircle size={14} className="text-success" />,
    en_ruta: <Navigation size={14} className="text-primary" />,
    mantenimiento: <Wrench size={14} className="text-amber-600" />,
    inactivo: <AlertCircle size={14} className="text-destructive" />,
  }
  return icons[status]
}

export function useRemises() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selectedRemise, setSelectedRemise] = useState<Remise | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [remises, setRemises] = useState<Remise[]>(initialRemises)
  const [newRemise, setNewRemise] = useState<NewRemiseForm>({
    plate: '',
    driver: '',
    driverPhone: '',
    vehicle: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'disponible',
    location: '',
    fuelLevel: 80,
    mileage: 0,
    assignedTo: '',
    notes: '',
  })

  const filteredRemises = remises.filter((r) => {
    const matchesSearch =
      r.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedRemises = filteredRemises.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredRemises.length / ITEMS_PER_PAGE)

  const totalRemises = remises.length
  const disponibles = remises.filter((r) => r.status === 'disponible').length
  const enRuta = remises.filter((r) => r.status === 'en_ruta').length
  const mantenimiento = remises.filter((r) => r.status === 'mantenimiento').length

  const kpiData: KpiItem[] = [
    { label: 'Total Remises', value: totalRemises, icon: Truck, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Disponibles', value: disponibles, icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    { label: 'En Ruta', value: enRuta, icon: Navigation, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Mantenimiento', value: mantenimiento, icon: Wrench, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ]

  const getStatusBadge = (status: RemiseStatus): StatusBadge => STATUS_BADGES[status]

  const openDetails = (remise: Remise) => {
    setSelectedRemise(remise)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRemise(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setNewRemise((prev) => ({
      ...prev,
      [name]: (e.target as HTMLInputElement).type === 'number' ? Number(value) : value,
    }))
  }

  const handleSaveRemise = () => {
    if (!newRemise.plate.trim() || !newRemise.driver.trim() || !newRemise.vehicle.trim()) {
      toast({ title: 'Campos obligatorios', description: 'Completa Placa, Conductor y Vehículo.', variant: 'destructive' })
      return
    }
    const newId = `REM-${String(remises.length + 1).padStart(4, '0')}`
    const now = new Date().toLocaleString()
    const remiseToAdd: Remise = { ...newRemise, id: newId, lastUpdate: now }
    setRemises((prev) => [...prev, remiseToAdd])
    setShowAddModal(false)
    setNewRemise({
      plate: '', driver: '', driverPhone: '', vehicle: '', brand: '', model: '',
      year: new Date().getFullYear(), status: 'disponible', location: '',
      fuelLevel: 80, mileage: 0, assignedTo: '', notes: '',
    })
    toast({ title: 'Éxito', description: `Remise ${newId} agregado correctamente.` })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const handleEdit = (id: string) => {
    toast({ title: 'Edición no disponible', description: 'La edición de remises estará disponible próximamente.' })
  }

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [remiseIdToDelete, setRemiseIdToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setRemiseIdToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (remiseIdToDelete) {
      setRemises((prev) => prev.filter((r) => r.id !== remiseIdToDelete))
    }
    setDeleteConfirmOpen(false)
    setRemiseIdToDelete(null)
  }

  return {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    loading,
    selectedRemise,
    showDetailsModal, setShowDetailsModal,
    showAddModal, setShowAddModal,
    currentPage, setCurrentPage,
    remises,
    newRemise,
    filteredRemises,
    paginatedRemises,
    totalPages,
    kpiData,
    getStatusBadge,
    openDetails,
    closeDetailsModal,
    handleInputChange,
    handleSaveRemise,
    clearFilters,
    handleEdit,
    handleDelete,
    confirmDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
  }
}
