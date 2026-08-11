import React from 'react'
import { Zap, CheckCircle, Smartphone, Volume2, QrCode } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import type { DeviceState, FunctionalChecks, Damage } from '../types/canje.types'

interface CanjeHistoryProps {
  device: DeviceState
  checks: FunctionalChecks
  damages: Damage[]
  tradeInCredit: number
  onBatteryChange: (v: number) => void
  onCheckToggle: (key: keyof FunctionalChecks) => void
  onAddDamage: (label?: string, amount?: number) => void
  onRemoveDamage: (id: number) => void
  onClearDamages: () => void
}

export const CanjeHistory: React.FC<CanjeHistoryProps> = ({
  device, checks, damages, tradeInCredit,
  onBatteryChange, onCheckToggle, onAddDamage, onRemoveDamage, onClearDamages,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Zap className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Salud de la Batería</h2>
                  <p className="text-xs text-muted-foreground">Capacidad Máxima Reportada en Configuración</p>
                </div>
              </div>
              <div className="text-4xl font-black text-primary">{device.battery}<span className="text-xl">%</span></div>
            </div>
            <div className="relative py-6">
              <input
                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                max="100" min="50" type="range" value={device.battery}
                onChange={e => onBatteryChange(Number(e.target.value))}
              />
              <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>Degradado (50%)</span>
                <span>Óptimo (80%+)</span>
                <span>Nuevo (100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
              <h2 className="text-xl font-bold text-foreground">Inspección Funcional</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(['faceid', 'cameras', 'screen', 'backglass'] as const).map((key) => (
                <label key={key} className="relative group cursor-pointer">
                  <input type="checkbox" checked={checks[key]} onChange={() => onCheckToggle(key)} className="peer hidden" />
                  <div className="flex items-center justify-between p-5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      {key === 'backglass' ? <Volume2 className="text-muted-foreground peer-checked:text-primary w-5 h-5" /> : <Smartphone className="text-muted-foreground peer-checked:text-primary w-5 h-5" />}
                      <span className="font-bold text-sm text-foreground">
                        {key === 'faceid' ? 'FaceID / TouchID' : key === 'cameras' ? 'Todas las Cámaras' : key === 'screen' ? 'Respuesta Táctil' : 'Altavoces / Mic'}
                      </span>
                    </div>
                    <CheckCircle className="text-muted peer-checked:text-primary w-5 h-5" />
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary text-white border-0 shadow-xl shadow-primary/20">
          <CardContent className="p-8 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <CheckCircle className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Crédito Estimado</p>
              <h3 className="text-5xl font-black">${tradeInCredit.toFixed(2)}</h3>
            </div>
            <div className="relative z-10 text-right">
              <div className="inline-flex items-center gap-2 bg-card/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Actualización en Vivo
              </div>
              <p className="text-xs opacity-70 max-w-[180px]">Basado en la evaluación actual. Valor final confirmado después de la inspección.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-5">
        <Card className="h-full">
          <CardContent className="p-8 h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <QrCode className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
                <h2 className="text-xl font-bold text-foreground">Mapeo de Daños</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClearDamages}>Limpiar Marcas</Button>
            </div>
            <p className="text-sm text-muted-foreground mb-8">Toque en el silueta del dispositivo para marcar defectos físicos (rayaduras, grietas o abolladuras).</p>
            <div className="flex flex-col items-center gap-8">
              <div className="relative w-48 h-96 bg-muted rounded-[2.5rem] border-8 border-border shadow-inner">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-border rounded-b-xl"></div>
                {damages.map((dmg, idx) => (
                  <div key={dmg.id} onClick={() => onRemoveDamage(dmg.id)}
                    className="absolute w-6 h-6 bg-destructive/100/80 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform text-[10px] text-white font-bold"
                    style={{ top: `${20 + (idx * 25)}%`, left: `${25 + (idx * 15)}%` }}
                  >{idx + 1}</div>
                ))}
                <div className="absolute inset-2 bg-muted/50 rounded-[1.8rem] flex items-center justify-center">
                  <span className="text-muted-foreground font-bold text-xs uppercase opacity-40">Vista Frontal</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {damages.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Sin daños reportados</p>
                ) : (
                  damages.map((dmg, idx) => (
                    <div key={dmg.id} className="flex items-center justify-between p-3 bg-destructive/10 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center size-5 bg-destructive/100 text-white text-[10px] font-bold rounded-full">{idx + 1}</span>
                        <span className="text-sm font-medium text-foreground">{dmg.label}</span>
                      </div>
                      <span className="text-xs font-bold text-destructive">-${dmg.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => onAddDamage('Grieta fina', 45)}>+ Grieta</Button>
                <Button variant="outline" size="sm" onClick={() => onAddDamage('Rayadura profunda', 15)}>+ Rayadura</Button>
                <Button variant="outline" size="sm" onClick={() => onAddDamage('Abolladura', 30)}>+ Abolladura</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default CanjeHistory
