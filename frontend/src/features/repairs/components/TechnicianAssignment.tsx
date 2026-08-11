import React from 'react'
import { Lock } from 'lucide-react'
import { SECURITY_TYPES } from '../constants/technical.constants'
import type { RepairData } from '../RepairFlow'

interface TechnicianAssignmentProps {
  securityType: string
  accessPin: string
  localDots: boolean[]
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  patternSequence: number[]
  onStartDraw: (idx: number, e: React.PointerEvent) => void
  onEnterDot: (idx: number) => void
  onEndDraw: (e?: React.PointerEvent) => void
  onClearPattern: () => void
  onUpdate: (updates: Partial<RepairData>) => void
}

const TechnicianAssignment: React.FC<TechnicianAssignmentProps> = ({
  securityType, accessPin, localDots, canvasRef, patternSequence,
  onStartDraw, onEnterDot, onEndDraw, onClearPattern, onUpdate,
}) => {
  return (
    <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
          <Lock size={20} />
        </div>
        <h2 className="text-lg font-bold text-foreground">Seguridad y Acceso</h2>
      </div>
      <div className="space-y-6">
        <div className="flex p-1 bg-muted rounded-xl">
          {SECURITY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onUpdate({ securityType: type.id })}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                securityType === type.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        {securityType !== 'Ninguno' && (
          <div className="space-y-4">
            {securityType === 'Pin' && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Accesso por PIN / Clave
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={accessPin}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ accessPin: e.target.value })}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-mono font-bold tracking-widest text-foreground"
                  />
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            )}
            {securityType === 'Patron' && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-4">
                  Patrón de Bloqueo - Arrastra para dibujar
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative bg-card p-8 rounded-3xl border-2 border-blue-200 shadow-md" style={{ width: '280px', height: '280px' }}>
                    <canvas
                      ref={canvasRef}
                      width={280}
                      height={280}
                      className="absolute inset-0 rounded-3xl"
                      style={{ cursor: 'crosshair' }}
                    />
                    <div className="absolute inset-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pointer-events-none">
                      {localDots.map((_, idx) => (
                        <div key={idx} className="w-full h-full" />
                      ))}
                    </div>
                    <div className="absolute inset-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {localDots.map((active, idx) => (
                        <button
                          key={idx}
                          onPointerDown={(e) => onStartDraw(idx, e)}
                          onPointerEnter={() => onEnterDot(idx)}
                          onPointerUp={(e) => onEndDraw(e)}
                          onPointerCancel={() => onEndDraw()}
                          onPointerLeave={() => {}}
                          className={`rounded-full transition-all transform touch-none select-none cursor-pointer relative z-10 ${
                            active
                              ? 'bg-primary shadow-lg shadow-blue-300 scale-110'
                              : 'bg-muted hover:bg-muted/80 hover:scale-105'
                          }`}
                          style={{ width: '50px', height: '50px', margin: 'auto' }}
                        />
                      ))}
                    </div>
                  </div>
                  {patternSequence.length > 0 && (
                    <div className="text-sm text-foreground bg-primary/5 px-4 py-2 rounded-lg border border-blue-100">
                      <span className="font-semibold">Secuencia dibujada:</span> {patternSequence.map(n => n + 1).join(' → ')}
                    </div>
                  )}
                  <button
                    onClick={onClearPattern}
                    className="text-sm text-primary hover:text-primary hover:underline font-bold transition-colors"
                  >
                    Limpiar Patrón
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TechnicianAssignment
