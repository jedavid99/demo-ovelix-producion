import React from 'react'
import { ShoppingBag, QrCode, Settings, Power, Cloud } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { toast } from '@/shared/components/ui/use-toast'
import { COLOR_OPTIONS, STORAGE_OPTIONS } from '../constants/canje.constants'
import type { DeviceState, ColorOption } from '../types/canje.types'
import DeviceList from './DeviceList'
import type { DeviceOption } from '../types/canje.types'

interface CanjeFormProps {
  devices: DeviceOption[]
  selectedDeviceId: string | null
  device: DeviceState
  imei: string
  powerOn: boolean
  icloudLogout: boolean
  deviceColor: string
  selectedDevice: DeviceOption | null
  onSelectDevice: (dev: DeviceOption) => void
  onImeiChange: (v: string) => void
  onPowerChange: (v: boolean) => void
  onIcloudChange: (v: boolean) => void
  onStorageChange: (v: string) => void
  onColorChange: (v: string) => void
}

export const CanjeForm: React.FC<CanjeFormProps> = ({
  devices, selectedDeviceId, device, imei, powerOn, icloudLogout,
  deviceColor, selectedDevice, onSelectDevice, onImeiChange,
  onPowerChange, onIcloudChange, onStorageChange, onColorChange,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
            <h2 className="text-xl font-bold text-foreground">Seleccione su Dispositivo de Canje</h2>
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Buscar modelo, almacenamiento..." aria-label="Buscar modelo" className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
          </div>
          <DeviceList devices={devices} selectedDeviceId={selectedDeviceId} onSelect={onSelectDevice} />
        </CardContent>
      </Card>
      {selectedDeviceId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <QrCode className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
                  <h2 className="text-xl font-bold text-foreground">Especificaciones del Dispositivo</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="capacidad">Capacidad</label>
                      <select id="capacidad" value={device.storage} onChange={e => onStorageChange(e.target.value)} className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12">
                        {STORAGE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-foreground" htmlFor="color">Color</label>
                      <select id="color" value={deviceColor} onChange={e => onColorChange(e.target.value)} className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12">
                        {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground flex justify-between" htmlFor="imei">
                      <span>Número IMEI</span>
                      <span className="text-xs font-normal text-muted-foreground italic">Marque *#06# para encontrar IMEI</span>
                    </label>
                    <div className="relative">
                      <input id="imei" value={imei} onChange={e => onImeiChange(e.target.value)} className="w-full rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12 pl-4" placeholder="Ingrese IMEI de 15 dígitos..." type="text" />
                      <Button variant="outline" size="sm" onClick={() => toast({ title: 'Verificación de IMEI', description: 'El IMEI ingresado es válido.' })} className="absolute right-2 top-2">VERIFICAR</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
                  <h2 className="text-xl font-bold text-foreground">Estado Inicial</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Power className="text-success w-5 h-5" />
                      <div>
                        <p className="font-bold text-sm text-foreground">¿El dispositivo enciende?</p>
                        <p className="text-xs text-muted-foreground">El dispositivo debe llegar a la pantalla de inicio</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={powerOn} onChange={e => onPowerChange(e.target.checked)} className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Cloud className="text-amber-500 w-5 h-5" />
                      <div>
                        <p className="font-bold text-sm text-foreground">¿iCloud cerrado?</p>
                        <p className="text-xs text-muted-foreground">Buscar mi iPhone debe estar desactivado</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked={icloudLogout} onChange={e => onIcloudChange(e.target.checked)} className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
              <CardContent className="p-8 flex flex-col">
                <h3 className="text-lg font-bold mb-6">Canje Estimado</h3>
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Modelo de Dispositivo</p>
                    <p className="text-sm font-bold">{device.model || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80 mb-1">Almacenamiento</p>
                    <p className="text-sm font-bold">{device.storage || '—'}</p>
                  </div>
                  <div className="border-t border-white/20 pt-4 mt-6">
                    <p className="text-xs opacity-70 uppercase font-bold mb-2">Valor Estimado</p>
                    <p className="text-5xl font-black tracking-tight">${selectedDevice?.basePrice || 0}</p>
                    <p className="text-xs opacity-70 mt-2">*Sujeto a evaluación y condición</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
export default CanjeForm
