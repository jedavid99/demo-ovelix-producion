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
import { adjustmentTypes, typeLabels } from '../constants/adjustments.constants'
import type { NewAdjustmentForm } from '../types/adjustments.types'

interface AdjustmentsFormProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
  newAdjustment: NewAdjustmentForm
  handleNewAdjustmentChange: (field: string, value: string | number) => void
  handleSaveAdjustment: () => void
}

export const AdjustmentsForm: React.FC<AdjustmentsFormProps> = ({
  isModalOpen, setIsModalOpen, newAdjustment, handleNewAdjustmentChange, handleSaveAdjustment,
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            Nuevo ajuste de stock
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-semibold">Producto <span className="text-destructive">*</span></Label>
            <Input id="productName" value={newAdjustment.productName} onChange={(e) => handleNewAdjustmentChange('productName', e.target.value)} placeholder="Ej. Pantalla iPhone 14 Pro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productSku" className="text-sm font-semibold">SKU</Label>
            <Input id="productSku" value={newAdjustment.productSku} onChange={(e) => handleNewAdjustmentChange('productSku', e.target.value)} placeholder="Ej. SCR-IP14P-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-semibold">Tipo de ajuste <span className="text-destructive">*</span></Label>
            <select
              id="type"
              value={newAdjustment.type}
              onChange={(e) => handleNewAdjustmentChange('type', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {adjustmentTypes.slice(1).map((type) => (
                <option key={type} value={type}>{typeLabels[type]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-semibold">Cantidad <span className="text-destructive">*</span></Label>
            <Input id="quantity" type="number" value={newAdjustment.quantity} onChange={(e) => handleNewAdjustmentChange('quantity', parseInt(e.target.value) || 0)} placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold">Motivo <span className="text-destructive">*</span></Label>
            <Input id="reason" value={newAdjustment.reason} onChange={(e) => handleNewAdjustmentChange('reason', e.target.value)} placeholder="Ej. Ajuste por inventario físico" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold">Fecha</Label>
            <Input id="date" type="date" value={newAdjustment.date} onChange={(e) => handleNewAdjustmentChange('date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold">Notas (opcional)</Label>
            <textarea
              id="notes"
              value={newAdjustment.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleNewAdjustmentChange('notes', e.target.value)}
              placeholder="Detalles adicionales..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveAdjustment}><Save size={16} className="mr-2" />Guardar ajuste</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default AdjustmentsForm
