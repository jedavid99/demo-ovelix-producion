import { Package, Truck, Navigation, CheckCircle } from 'lucide-react'
import type { Shipment } from '../../types/tracking/tracking.types'

export const STATUS_OPTIONS = ['all', 'preparation', 'transit', 'delivery', 'delivered'] as const

export const getStatusColor = (status: string) => {
  switch(status) {
    case 'preparation': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'transit': return 'bg-primary/10 text-primary border-blue-200'
    case 'delivery': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
    default: return 'bg-muted text-foreground border-border'
  }
}

export const getStatusIcon = (status: string) => {
  switch(status) {
    case 'preparation': return <Package size={14} />
    case 'transit': return <Truck size={14} />
    case 'delivery': return <Navigation size={14} />
    case 'delivered': return <CheckCircle size={14} />
    default: return null
  }
}

export const getStatusText = (status: string) => {
  switch(status) {
    case 'preparation': return 'Preparación'
    case 'transit': return 'En Tránsito'
    case 'delivery': return 'En Reparto'
    case 'delivered': return 'Entregado'
    default: return status
  }
}

export const buildKpiCards = (shipments: Shipment[]) => [
  { title: 'En Preparación', value: shipments.filter(s => s.status === 'preparation').length, change: 0, icon: <Package size={20} />, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { title: 'En Tránsito', value: shipments.filter(s => s.status === 'transit').length, change: 0, icon: <Truck size={20} />, color: 'text-primary', bgColor: 'bg-primary/10' },
  { title: 'En Reparto', value: shipments.filter(s => s.status === 'delivery').length, change: 0, icon: <Navigation size={20} />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Entregados', value: shipments.filter(s => s.status === 'delivered').length, change: 0, icon: <CheckCircle size={20} />, color: 'text-success', bgColor: 'bg-green-100' },
]

export const getMapUrl = (lat: number, lng: number, zoom: number) => {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=800x500&markers=${lat},${lng},red-pin`
}

export const getTrackingLog = (_shipmentId: string) => {
  return [] as { title: string; detail: string; completed: boolean; time: string; icon?: React.ReactNode }[]
}
