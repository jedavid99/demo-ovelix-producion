import React from 'react'
import { Phone, Smartphone, X, CheckCircle, BarChart2, QrCode, Receipt } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { COLOR_OPTIONS } from '../constants/canje.constants'
import type { DeviceState, FunctionalChecks, SelectedNewDevice, ColorOption } from '../types/canje.types'
import CanjeStatusBadge from './CanjeStatusBadge'

interface ValuationSummaryProps {
  device: DeviceState
  deviceColor: string
  checks: FunctionalChecks
  tradeInCredit: number
  selectedNew: SelectedNewDevice
  onFinalize: () => void
  onEdit: () => void
  onCancel: () => void
}

export const ValuationSummary: React.FC<ValuationSummaryProps> = ({
  device, deviceColor, checks, tradeInCredit, selectedNew, onFinalize, onEdit, onCancel,
}) => {
  const colorName = COLOR_OPTIONS.find(c => c.value === deviceColor)?.name || '—'
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Resumen Final de la Transacción</h1>
          <p className="text-muted-foreground mt-1">Por favor revise los detalles del canje y firme para completar la transferencia.</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted-foreground block mb-1">NÚMERO DE REFERENCIA</span>
          <span className="font-mono text-lg font-bold text-foreground">#{Math.floor(Math.random() * 90000) + 10000}-XC</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-border">
                <div className="p-8">
                  <div className="flex items-center gap-2 text-muted-foreground mb-6 uppercase tracking-wider text-[10px] font-bold">
                    <X className="w-4 h-4" />Su Dispositivo (Canje)
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-20 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <Smartphone className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 text-foreground">{device.model || '—'}</h3>
                      <p className="text-sm text-muted-foreground">{colorName}, {device.storage || '—'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {checks.screen && <CanjeStatusBadge variant="success">PANTALLA OK</CanjeStatusBadge>}
                        {checks.faceid && <CanjeStatusBadge variant="success">FACEID OK</CanjeStatusBadge>}
                        <CanjeStatusBadge variant="outline">{device.battery}% BATERÍA</CanjeStatusBadge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Valor Estimado</span>
                      <span className="text-2xl font-black text-foreground">${tradeInCredit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-primary/5">
                  <div className="flex items-center gap-2 text-primary/60 mb-6 uppercase tracking-wider text-[10px] font-bold">
                    <CheckCircle className="w-4 h-4" />Nuevo Dispositivo (Compra)
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-20 rounded-xl bg-card flex items-center justify-center border border-primary/20 shadow-sm">
                      <Phone className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1 text-foreground">{selectedNew.name || '—'}</h3>
                      <p className="text-sm text-muted-foreground">{selectedNew.desc || '—'}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <CanjeStatusBadge variant="default">NUEVO</CanjeStatusBadge>
                        <CanjeStatusBadge variant="outline">EN STOCK</CanjeStatusBadge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-primary/60">Precio de Venta</span>
                      <span className="text-2xl font-black text-foreground">${selectedNew.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Autorización Legal de Transferencia</h3>
                  <p className="text-sm text-muted-foreground mt-1">Certifico que el dispositivo que se está canjeando es de mi propiedad y autorizo la transferencia.</p>
                </div>
                <Button variant="ghost" size="sm">Limpiar Firma</Button>
              </div>
              <div className="signature-pad w-full h-48 border-2 border-dashed border-border rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair group bg-muted/30">
                <span className="text-muted-foreground font-medium group-hover:opacity-0 transition-opacity">Firma del Cliente Requerida</span>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <QrCode className="w-4 h-4" />Use mouse o stylus para firmar
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <Card className="bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
              <CardContent className="p-8">
                <div className="absolute -right-8 -top-8 opacity-5"><Receipt className="w-48 h-48" /></div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
                  <BarChart2 className="w-5 h-5 text-primary" />Resumen Financiero
                </h3>
                <div className="space-y-5 mb-8 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Subtotal Nuevo Dispositivo</span>
                    <span className="font-mono font-medium">${selectedNew.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Crédito de Canje</span>
                    <span className="font-mono font-medium text-green-400">-${tradeInCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Impuesto de Ventas (Aplicado)</span>
                    <span className="font-mono font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-slate-800 pt-6 mt-6">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">Saldo Total a Pagar</span>
                      <span className="text-5xl font-black text-white tracking-tighter leading-none">${Math.max(0, (selectedNew.price - tradeInCredit)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={onFinalize} className="w-full" size="lg">
                  <CheckCircle size={20} className="mr-2" />Completar e Imprimir
                </Button>
                <div className="mt-6 space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />Activa Contrato e Impresión de Factura
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <BarChart2 className="w-4 h-4" />Actualiza Inventario Automáticamente
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col gap-2">
                <Button variant="outline" onClick={onEdit} className="w-full justify-between">
                  Editar Detalles <QrCode size={16} />
                </Button>
                <Button variant="outline" onClick={onCancel} className="w-full justify-between text-destructive hover:text-destructive">
                  Cancelar Transacción <X size={16} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ValuationSummary
