import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface RepuestosActionsProps {
  onOpenModal: () => void
}

export const RepuestosActions: React.FC<RepuestosActionsProps> = ({ onOpenModal }) => {
  return (
    <div className="flex items-center gap-3">
      <Button onClick={onOpenModal}>
        <Plus size={16} className="mr-2" />
        Agregar repuesto
      </Button>
    </div>
  )
}
export default RepuestosActions
