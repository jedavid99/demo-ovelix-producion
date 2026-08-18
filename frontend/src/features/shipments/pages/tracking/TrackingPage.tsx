import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Filter, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { KpiCard } from '../../components/tracking/KpiCard'
import { ShipmentFilters } from '../../components/tracking/ShipmentFilters'
import { ShipmentTable } from '../../components/tracking/ShipmentTable'
import { TrackingModal } from '../../components/tracking/TrackingModal'
import { buildKpiCards } from '../../constants/tracking/tracking.constants'
import type { Shipment, KpiCardData } from '../../types/tracking/tracking.types'

export default function TrackingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.state) {
      const st = location.state as any
      if (st.shipment) setSelectedShipment(st.shipment)
      if (st.searchTerm) setSearchTerm(st.searchTerm)
      if (st.filterStatus) setFilterStatus(st.filterStatus)
    }
  }, [location.state])

  const shipments: Shipment[] = []
  const kpiCards: KpiCardData[] = buildKpiCards(shipments)

  const filteredShipments = shipments.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        s.id.toLowerCase().includes(term) ||
        s.customer.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term) ||
        s.provider.toLowerCase().includes(term)
      )
    }
    return true
  })

  const openTrackingModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowModal(true)
  }

  return (
    <div className="bg-background">
      <main>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Seguimiento de Envíos</h1>
              <p className="text-muted-foreground">Monitorea el estado de tus envíos en tiempo real</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filtros
              </Button>
              <Button className="gap-2">
                <Plus size={16} />
                Nuevo envío
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, index) => (
              <KpiCard key={index} data={kpi} />
            ))}
          </div>

          <ShipmentFilters
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onSearchChange={setSearchTerm}
            onStatusChange={setFilterStatus}
          />

          <ShipmentTable shipments={filteredShipments} onOpen={openTrackingModal} />
        </div>
      </main>
      {showModal && selectedShipment && (
        <TrackingModal shipment={selectedShipment} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
