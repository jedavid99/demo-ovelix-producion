import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { HARDWARE_ITEMS } from '../constants/technical.constants'

interface TechnicalDetailsProps {
  hardwareChecks: Record<string, boolean>
  onToggle: (key: string) => void
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ hardwareChecks, onToggle }) => {
  return (
    <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 text-primary p-2 rounded-xl">
          <CheckCircle2 size={20} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Chequeo rapido</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {HARDWARE_ITEMS.map((item) => {
          const Icon = item.icon
          const isChecked = hardwareChecks[item.key as keyof typeof hardwareChecks]
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border hover:border-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isChecked ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-sm font-bold text-foreground">{item.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isChecked} onChange={() => onToggle(item.key)} className="sr-only" />
                <div className={`w-11 h-6 rounded-full transition-colors ${isChecked ? 'bg-primary' : 'bg-muted'}`}>
                  <div className={`absolute left-1 top-1 bg-card w-4 h-4 rounded-full transition-transform shadow-sm ${isChecked ? 'translate-x-5' : ''}`} />
                </div>
              </label>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TechnicalDetails
