import React from 'react'
import { Plus, Save, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { categories } from '../constants/repuestos.constants'
import type { NewRepuestoForm } from '../types/repuestos.types'

interface RepuestosFormProps {
  isModalOpen: boolean
  setIsModalOpen: (v: boolean) => void
  newRepuesto: NewRepuestoForm
  compatibilityInput: string
  setCompatibilityInput: (v: string) => void
  handleNewRepuestoChange: (field: string, value: string | number) => void
  addCompatibility: (device: string) => void
  removeCompatibility: (device: string) => void
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleSaveRepuesto: () => void
}

export const RepuestosForm: React.FC<RepuestosFormProps> = ({
  isModalOpen, setIsModalOpen,
  newRepuesto, compatibilityInput, setCompatibilityInput,
  handleNewRepuestoChange, addCompatibility, removeCompatibility,
  handleKeyPress, handleSaveRepuesto,
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            Agregar nuevo repuesto
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Nombre del repuesto <span className="text-destructive">*</span>
            </Label>
            <Input id="name" value={newRepuesto.name} onChange={(e) => handleNewRepuestoChange('name', e.target.value)} placeholder="Ej. Pantalla OLED iPhone 14 Pro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku" className="text-sm font-semibold">
              SKU <span className="text-destructive">*</span>
            </Label>
            <Input id="sku" value={newRepuesto.sku} onChange={(e) => handleNewRepuestoChange('sku', e.target.value)} placeholder="Ej. SCR-IP14P-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Categoría <span className="text-destructive">*</span>
            </Label>
            <select
              id="category"
              value={newRepuesto.category}
              onChange={(e) => handleNewRepuestoChange('category', e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Seleccionar categoría</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold">Cantidad inicial</Label>
              <Input id="quantity" type="number" value={newRepuesto.quantity} onChange={(e) => handleNewRepuestoChange('quantity', parseInt(e.target.value) || 0)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold">Precio ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="price" type="number" step="0.01" value={newRepuesto.price} onChange={(e) => handleNewRepuestoChange('price', parseFloat(e.target.value) || 0)} placeholder="0.00" className="pl-8" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Descripción</Label>
            <textarea
              id="description"
              value={newRepuesto.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleNewRepuestoChange('description', e.target.value)}
              placeholder="Detalles adicionales del repuesto..."
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Compatibilidad</Label>
            <div className="flex flex-wrap gap-2 p-3 border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[50px] items-center">
              {newRepuesto.compatibleWith.map((device) => (
                <Badge key={device} variant="secondary" className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5">
                  {device}
                  <button type="button" onClick={() => removeCompatibility(device)} className="hover:text-destructive transition-colors">
                    <X size={14} />
                  </button>
                </Badge>
              ))}
              <div className="flex items-center ml-1">
                <input
                  value={compatibilityInput}
                  onChange={(e) => setCompatibilityInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground p-1 outline-none min-w-[120px]"
                  placeholder="Escribe y presiona Enter..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['iPhone 14', 'PS5', 'Nintendo Switch', 'iPad Pro'].map((device) => (
                <Button key={device} type="button" variant="outline" size="sm" onClick={() => addCompatibility(device)} className="h-8 text-xs">
                  <Plus size={14} className="mr-1" />
                  Agregar {device}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveRepuesto}><Save size={16} className="mr-2" />Guardar repuesto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default RepuestosForm
