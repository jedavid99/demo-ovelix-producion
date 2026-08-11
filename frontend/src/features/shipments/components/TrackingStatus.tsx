import React from 'react'
import { X, Truck, MapPin, User, Phone, Fuel, Gauge, Calendar, Edit } from 'lucide-react'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import type { Remise } from '../types/shipments.types'
import { getStatusIcon } from '../hooks/useRemises'
import { STATUS_BADGES } from '../constants/shipments.constants'

interface TrackingStatusProps {
  selectedRemise: Remise | null
  closeDetailsModal: () => void
}

export const TrackingStatus: React.FC<TrackingStatusProps> = ({ selectedRemise, closeDetailsModal }) => {
  if (!selectedRemise) return null
  const statusBadge = STATUS_BADGES[selectedRemise.status]
  return (
    <Dialog open onOpenChange={(open) => { if (!open) closeDetailsModal(); }}>
      <DialogContent hideClose className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{selectedRemise.plate}</h2>
              <p className="text-sm text-muted-foreground">{selectedRemise.vehicle}</p>
            </div>
          </div>
          <button onClick={closeDetailsModal} className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Cerrar">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium">Estado</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(selectedRemise.status)}
                <span className="font-semibold">{statusBadge.label}</span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium">Ubicación</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={16} className="text-muted-foreground" />
                <span className="font-medium">{selectedRemise.location}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <User size={14} /> Conductor
              </p>
              <p className="font-semibold mt-1">{selectedRemise.driver}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>{selectedRemise.driverPhone}</span>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Truck size={14} /> Vehículo
              </p>
              <p className="font-semibold mt-1">{selectedRemise.vehicle}</p>
              <p className="text-sm text-muted-foreground">
                {selectedRemise.brand} {selectedRemise.model} • {selectedRemise.year}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Fuel size={20} className="mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-semibold">{selectedRemise.fuelLevel}%</p>
              <p className="text-xs text-muted-foreground">Combustible</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Gauge size={20} className="mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-semibold">{selectedRemise.mileage.toLocaleString()} km</p>
              <p className="text-xs text-muted-foreground">Kilometraje</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <Calendar size={20} className="mx-auto text-muted-foreground mb-1" />
              <p className="text-sm font-semibold">{selectedRemise.lastUpdate}</p>
              <p className="text-xs text-muted-foreground">Última actualización</p>
            </div>
          </div>
          {selectedRemise.assignedTo && (
            <div className="bg-primary/5 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium">Asignado a</p>
              <p className="font-medium">{selectedRemise.assignedTo}</p>
            </div>
          )}
          {selectedRemise.notes && (
            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-medium">Notas</p>
              <p className="text-sm mt-1">{selectedRemise.notes}</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              <Phone size={16} />
              Contactar conductor
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <Edit size={16} className="text-foreground" />
              Editar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default TrackingStatus
