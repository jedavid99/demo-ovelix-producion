import React from 'react'
import { Search, X } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { STATUS_FILTERS, STATUS_LABELS } from '../constants/shipments.constants'

interface RemisesFiltersProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  clearFilters: () => void
}

export const RemisesFilters: React.FC<RemisesFiltersProps> = ({
  searchTerm, setSearchTerm, statusFilter, setStatusFilter, clearFilters,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar por placa, conductor o vehículo..."
            aria-label="Buscar por placa, conductor o vehículo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setStatusFilter(status)}
            >
              {STATUS_LABELS[status]}
            </Badge>
          ))}
        </div>
        {(searchTerm || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground" onClick={clearFilters}>
            <X size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </Card>
  )
}
export default RemisesFilters
