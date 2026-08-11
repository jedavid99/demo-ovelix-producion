import React from 'react'
import { AlertCircle, Check } from 'lucide-react'
import type { RepairData } from '../RepairFlow'

interface TechnicalDiagnosticsProps {
  technicianNotes: string
  onUpdate: (updates: Partial<RepairData>) => void
}

const TechnicalDiagnostics: React.FC<TechnicalDiagnosticsProps> = ({ technicianNotes, onUpdate }) => {
  return (
    <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
          <AlertCircle size={20} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Diagnóstico interno</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Nota del tecnico
          </label>
          <textarea
            value={technicianNotes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ technicianNotes: e.target.value })}
            placeholder="Introduce los hallazgos preliminares, indicadores de humedad, observaciones de daño interno..."
            rows={8}
            className="w-full bg-muted border border-border rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all text-foreground"
          />
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <Check size={20} />
          <span className="text-xs font-semibold">
            Listo para seleccionar piezas y revisión final
          </span>
        </div>
      </div>
    </section>
  )
}

export default TechnicalDiagnostics
