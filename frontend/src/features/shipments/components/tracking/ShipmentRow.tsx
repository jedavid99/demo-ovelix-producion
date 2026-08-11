import { User, MapPin, Package as PackageIcon, Wrench, ShoppingBag, Eye } from 'lucide-react'
import { getStatusColor, getStatusIcon, getStatusText } from '../../constants/tracking/tracking.constants'
import type { Shipment } from '../../types/tracking/tracking.types'

interface ShipmentRowProps {
  shipment: Shipment
  onOpen: (shipment: Shipment) => void
}

export const ShipmentRow = ({ shipment, onOpen }: ShipmentRowProps) => (
  <tr
    className="group hover:bg-muted/50 cursor-pointer transition-all"
    onClick={() => onOpen(shipment)}
  >
    <td className="px-6 py-4">
      <span className="font-mono text-sm font-bold text-primary">{shipment.id}</span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
          <User size={14} className="text-foreground dark:text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-foreground">{shipment.customer}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
        shipment.type === 'Repair' ? 'bg-orange-100 text-orange-700' : 'bg-primary/10 text-primary'
      }`}>
        {shipment.type === 'Repair' ? <Wrench size={12} /> : <ShoppingBag size={12} />}
        {shipment.type}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-muted dark:bg-muted rounded flex items-center justify-center">
          <PackageIcon size={12} className="text-muted-foreground" />
        </div>
        <span className="text-sm text-foreground dark:text-muted-foreground">{shipment.provider}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-1">
        <MapPin size={14} className="text-muted-foreground" />
        <span className="text-sm text-foreground dark:text-muted-foreground">{shipment.location}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
        {getStatusIcon(shipment.status)}
        {getStatusText(shipment.status)}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-24 h-2 bg-muted  rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${shipment.progress}%` }} />
        </div>
        <span className="text-xs font-semibold text-foreground dark:text-muted-foreground">{shipment.progress}%</span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <button
        onClick={(e) => { e.stopPropagation(); onOpen(shipment) }}
        className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors opacity-0 group-hover:opacity-100"
      >
        <Eye size={16} />
      </button>
    </td>
  </tr>
)
