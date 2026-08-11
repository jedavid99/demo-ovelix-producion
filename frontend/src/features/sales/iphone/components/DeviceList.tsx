import React from 'react'
import { Smartphone } from 'lucide-react'
import { EmptyState } from '@/shared/components/async/EmptyState'
import type { DeviceOption } from '../types/canje.types'

interface DeviceListProps {
  devices: DeviceOption[]
  selectedDeviceId: string | null
  onSelect: (dev: DeviceOption) => void
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, selectedDeviceId, onSelect }) => {
  if (devices.length === 0) {
    return (
      <EmptyState
        icon={Smartphone}
        title="No hay dispositivos disponibles"
        description="Agrega dispositivos desde el panel de administración"
      />
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      {devices.map(dev => (
        <div
          key={dev.id}
          onClick={() => onSelect(dev)}
          className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            selectedDeviceId === dev.id
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-border hover:border-primary/40 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground truncate">{dev.name}</span>
              {selectedDeviceId === dev.id && (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{dev.storage}</p>
            <p className="text-lg font-bold text-primary mt-2">${dev.basePrice}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default DeviceList
