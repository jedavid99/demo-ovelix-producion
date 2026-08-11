import React, { useState } from 'react'
import {
  Truck, X, Package, User, Phone, Mail, Map, MapPin, ArrowRight,
  Activity, Plus, Minus, RotateCw, ExternalLink, Share2, Download,
  Info, ShoppingBag, Wrench
} from 'lucide-react'
import { getStatusColor, getStatusIcon, getStatusText, getMapUrl } from '../../constants/tracking/tracking.constants'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import type { Shipment } from '../../types/tracking/tracking.types'

interface TrackingModalProps {
  shipment: Shipment
  onClose: () => void
}

const SvgPlus = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)
const SvgMinus = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

export const TrackingModal = ({ shipment, onClose }: TrackingModalProps) => {
  const [modalView, setModalView] = useState<'details' | 'map' | 'timeline'>('details')
  const [mapZoom, setMapZoom] = useState(12)

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent hideClose className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Truck size={20} className="text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                shipment.status === 'delivered' ? 'bg-success' :
                shipment.status === 'transit' ? 'bg-primary' :
                shipment.status === 'delivery' ? 'bg-purple-500' : 'bg-amber-500'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{shipment.id}</h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                  {getStatusText(shipment.status)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{shipment.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex bg-muted rounded-lg p-0.5">
              {(['details', 'map', 'timeline'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setModalView(view)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    modalView === view
                      ? 'bg-card  text-primary shadow-sm'
                      : 'text-foreground dark:text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {view === 'details' ? 'Detalles' : view === 'map' ? 'Mapa' : 'Timeline'}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Cerrar">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

          <div className="p-4 overflow-y-auto flex-1">
            {modalView === 'details' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Progreso</span>
                    <span className="text-sm font-bold">{shipment.progress}%</span>
                  </div>
                  <div className="h-2 bg-card/20 rounded-full overflow-hidden">
                    <div className="h-full bg-card rounded-full transition-all duration-500" style={{ width: `${shipment.progress}%` }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                    <div><span className="opacity-70">Origen</span><br /><span className="font-medium">{shipment.origin}</span></div>
                    <div><span className="opacity-70">Destino</span><br /><span className="font-medium">{shipment.destination}</span></div>
                    <div><span className="opacity-70">Entrega</span><br /><span className="font-medium">{shipment.estimatedDelivery}</span></div>
                    <div><span className="opacity-70">Última act.</span><br /><span className="font-medium">{shipment.lastUpdate}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-muted dark:bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                      <Package size={14} className="text-primary" /> Paquete
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Peso</span><span className="font-medium">{shipment.weight}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Artículos</span><span className="font-medium">{shipment.items} u.</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Transportista</span><span className="font-medium">{shipment.provider}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-bold text-success">{shipment.value}</span></div>
                    </div>
                  </div>
                  <div className="bg-muted dark:bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                      <User size={14} className="text-primary" /> Cliente
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                          <User size={14} className="text-purple-600" />
                        </div>
                        <div><p className="font-medium">{shipment.customer}</p><p className="text-[10px] text-muted-foreground">ID: CLT-{Math.floor(Math.random() * 10000)}</p></div>
                      </div>
                      <div className="flex items-center gap-1.5"><Phone size={12} className="text-muted-foreground" /><span>+1 (555) 123-4567</span></div>
                      <div className="flex items-center gap-1.5"><Mail size={12} className="text-muted-foreground" /><span>{shipment.customer.toLowerCase().replace(' ', '.')}@email.com</span></div>
                    </div>
                  </div>
                  <div className="bg-muted dark:bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                      <Truck size={14} className="text-primary" /> Transportista
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                          <User size={14} className="text-primary" />
                        </div>
                        <div><p className="font-medium">{shipment.driver}</p><p className="text-[10px] text-muted-foreground">Conductor</p></div>
                      </div>
                      <div className="flex items-center gap-1.5"><Truck size={12} className="text-muted-foreground" /><span>{shipment.vehicle}</span></div>
                      <div className="flex items-center gap-1.5"><Phone size={12} className="text-muted-foreground" /><span>+1 (555) 987-6543</span></div>
                    </div>
                  </div>
                  <div className="bg-muted dark:bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                      <Info size={14} className="text-primary" /> Adicional
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${shipment.type === 'Repair' ? 'bg-orange-100 text-orange-700' : 'bg-primary/10 text-primary'}`}>{shipment.type}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Firma</span><span className={shipment.signature ? 'text-success' : 'text-muted-foreground'}>{shipment.signature ? 'Sí' : 'No'}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Seguimiento</span><span className="font-mono font-bold text-primary text-[10px]">{shipment.id}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors">
                    <Phone size={14} /> Contactar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-border  text-sm rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors">
                    <Share2 size={14} className="text-foreground" /> Compartir
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-border  text-sm rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors">
                    <Download size={14} className="text-foreground" /> PDF
                  </button>
                </div>
              </div>
            )}

            {modalView === 'map' && shipment.lat && shipment.lng && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Map size={16} className="text-primary" /><h3 className="text-sm font-semibold">Ubicación en tiempo real</h3></div>
                  <div className="flex gap-1">
                    <button onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><SvgPlus size={14} /></button>
                    <button onClick={() => setMapZoom(Math.max(mapZoom - 1, 5))} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><SvgMinus size={14} /></button>
                    <button onClick={() => setMapZoom(12)} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><RotateCw size={14} /></button>
                  </div>
                </div>
                <div className="relative h-72 w-full bg-muted rounded-xl overflow-hidden">
                  <img src={getMapUrl(shipment.lat, shipment.lng, mapZoom)} alt="Map" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-card/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                    <p className="text-[10px] font-medium text-muted-foreground">Ubicación actual</p>
                    <p className="text-xs font-semibold">{shipment.location}</p>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-6 h-6 bg-destructive rounded-full animate-ping opacity-50 absolute"></div>
                      <div className="w-6 h-6 bg-destructive rounded-full border-2 border-white shadow-lg flex items-center justify-center"><Truck size={12} className="text-white" /></div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-card/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1"><MapPin size={12} className="text-success" /><span>{shipment.origin}</span></div>
                    <ArrowRight size={12} className="text-muted-foreground" />
                    <div className="flex items-center gap-1"><MapPin size={12} className="text-destructive" /><span>{shipment.destination}</span></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div><span>Vehículo en movimiento</span></div>
                  <button className="text-primary hover:text-primary font-medium flex items-center gap-0.5"><ExternalLink size={12} /> Ver en Google Maps</button>
                </div>
              </div>
            )}

            {modalView === 'timeline' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Activity size={16} className="text-primary" /><h3 className="text-sm font-semibold">Historial de seguimiento</h3></div>
                  <span className="text-xs text-muted-foreground">0 eventos</span>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-sm">No hay eventos de seguimiento disponibles</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 p-3 border-t border-border">
            <button onClick={onClose} className="px-3 py-1.5 border border-border  rounded-lg text-sm font-medium hover:bg-muted">Cerrar</button>
            <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover">Descargar comprobante</button>
          </div>
      </DialogContent>
    </Dialog>
  )
}
