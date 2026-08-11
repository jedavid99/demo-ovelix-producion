import { Search } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { STATUS_OPTIONS, getStatusText } from '../../constants/tracking/tracking.constants'

interface ShipmentFiltersProps {
  searchTerm: string
  filterStatus: string
  onSearchChange: (value: string) => void
  onStatusChange: (status: string) => void
}

export const ShipmentFilters = ({ searchTerm, filterStatus, onSearchChange, onStatusChange }: ShipmentFiltersProps) => (
  <div className="p-4 bg-card rounded-xl border border-border">
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Buscar por ID, cliente, ubicación o transportista..."
          aria-label="Buscar por ID, cliente, ubicación o transportista"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((status) => (
          <Badge
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => onStatusChange(status)}
          >
            {status === 'all' ? 'Todos' : getStatusText(status)}
          </Badge>
        ))}
      </div>
    </div>
  </div>
)
