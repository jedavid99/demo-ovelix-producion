import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface TechnicalActionsProps {
  onNext: () => void
  onBack: () => void
}

const TechnicalActions: React.FC<TechnicalActionsProps> = ({ onNext, onBack }) => {
  return (
    <div className="flex items-center justify-between pt-4">
      <button
        onClick={onBack}
        className="px-6 py-3 border border-border text-muted-foreground font-bold rounded-2xl hover:bg-muted transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Volver a Información del Cliente
      </button>
      <button
        onClick={onNext}
        className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 group"
      >
        Siguiente: Revisión Final
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}

export default TechnicalActions
