import React from 'react'
import { AlertCircle, Info } from 'lucide-react'

interface TechnicalTicketSummaryProps {
  selectedClient: { id: string; name: string; phone: string; email: string } | null
  brand: string
  model: string
  serial: string
  functionalCount: number
  totalHardwareItems: number
}

const TechnicalTicketSummary: React.FC<TechnicalTicketSummaryProps> = ({
  selectedClient, brand, model, serial, functionalCount, totalHardwareItems,
}) => {
  const nonFunctional = totalHardwareItems - functionalCount
  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg">Resumen del Ticket</h3>
            <span className="text-[10px] font-bold bg-primary/30 text-blue-300 px-2 py-1 rounded uppercase tracking-widest">
              En Progreso
            </span>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="bg-card/10 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Cliente</p>
                <p className="font-semibold text-sm">{selectedClient?.name || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">{selectedClient?.phone || ''}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-card/10 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-3H7V4h10v13z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Información del Dispositivo</p>
                <p className="font-semibold text-sm">{brand && model ? `${brand} ${model}` : 'N/A'}</p>
                <p className="text-xs text-muted-foreground font-mono">IMEI: {serial || '---'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-card/10 p-2 rounded-lg">
                <AlertCircle size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Estado de Pre-Check</p>
                <p className="font-semibold text-sm text-green-400">{functionalCount}/{totalHardwareItems} Funcionales</p>
                <p className="text-xs text-muted-foreground">
                  {functionalCount === totalHardwareItems
                    ? 'Todos los sistemas operativos'
                    : `${nonFunctional} módulo${nonFunctional > 1 ? 's' : ''} defectuoso`}
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Tarifa de Servicio</span>
                <span className="font-bold text-sm">$</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm">Partes Estimadas</span>
                <span className="font-bold text-sm">$</span>
              </div>
              <div className="flex items-center justify-between text-xl font-bold pt-4 border-t border-white/20">
                <span>Subtotal</span>
                <span className="text-blue-400">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-primary" />
          <span className="text-xs font-bold text-muted-foreground">Ayuda del Proceso</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete el diagnóstico técnico para generar la cotización final del reparación.
          Todas las pruebas de hardware son obligatorias para la validación de garantía.
        </p>
        <p className="text-[10px] text-muted-foreground mt-4 italic">
          Borrador actualizado por última vez a las 10:48 AM
        </p>
      </div>
    </div>
  )
}

export default TechnicalTicketSummary
