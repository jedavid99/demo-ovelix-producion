import React from 'react'
import { Plus, Save } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import type { NewRemiseForm } from '../types/shipments.types'

interface RemisesFormProps {
  showAddModal: boolean
  setShowAddModal: (v: boolean) => void
  newRemise: NewRemiseForm
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSaveRemise: () => void
}

export const RemisesForm: React.FC<RemisesFormProps> = ({
  showAddModal, setShowAddModal, newRemise, handleInputChange, handleSaveRemise,
}) => {
  return (
    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Plus size={20} className="text-white" />
            </div>
            Nuevo Remise
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate" className="text-sm font-medium">Placa *</Label>
              <Input id="plate" name="plate" value={newRemise.plate} onChange={handleInputChange} placeholder="ABC-1234" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver" className="text-sm font-medium">Conductor *</Label>
              <Input id="driver" name="driver" value={newRemise.driver} onChange={handleInputChange} placeholder="Nombre completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverPhone" className="text-sm font-medium">Teléfono del conductor</Label>
              <Input id="driverPhone" name="driverPhone" value={newRemise.driverPhone} onChange={handleInputChange} placeholder="+34 600 000 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-sm font-medium">Vehículo *</Label>
              <Input id="vehicle" name="vehicle" value={newRemise.vehicle} onChange={handleInputChange} placeholder="Furgoneta, Camión, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">Marca</Label>
              <Input id="brand" name="brand" value={newRemise.brand} onChange={handleInputChange} placeholder="Mercedes, Ford, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm font-medium">Modelo</Label>
              <Input id="model" name="model" value={newRemise.model} onChange={handleInputChange} placeholder="Sprinter, Transit, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">Año</Label>
              <Input id="year" name="year" type="number" value={newRemise.year} onChange={handleInputChange} placeholder="2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
              <select id="status" name="status" value={newRemise.status} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground">
                <option value="disponible">Disponible</option>
                <option value="en_ruta">En Ruta</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Ubicación</Label>
              <Input id="location" name="location" value={newRemise.location} onChange={handleInputChange} placeholder="Ciudad, dirección" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelLevel" className="text-sm font-medium">Nivel de combustible (%)</Label>
              <Input id="fuelLevel" name="fuelLevel" type="number" min="0" max="100" value={newRemise.fuelLevel} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm font-medium">Kilometraje</Label>
              <Input id="mileage" name="mileage" type="number" value={newRemise.mileage} onChange={handleInputChange} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo" className="text-sm font-medium">Asignado a</Label>
              <Input id="assignedTo" name="assignedTo" value={newRemise.assignedTo} onChange={handleInputChange} placeholder="Cliente o proyecto" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
              <textarea id="notes" name="notes" value={newRemise.notes} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground" placeholder="Observaciones adicionales" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
          <Button onClick={handleSaveRemise} className="gap-2"><Save size={16} />Guardar remise</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default RemisesForm
