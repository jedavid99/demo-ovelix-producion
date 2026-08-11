import React from 'react'
import { Search, ChevronDown, Filter, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { adjustmentTypes, statusOptions, typeLabels, filterStatusLabels } from '../constants/adjustments.constants'

interface AdjustmentsFiltersProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  activeType: string
  setActiveType: (v: string) => void
  activeStatus: string
  setActiveStatus: (v: string) => void
  clearFilters: () => void
}

export const AdjustmentsFilters: React.FC<AdjustmentsFiltersProps> = ({
  searchTerm, setSearchTerm, activeType, setActiveType, activeStatus, setActiveStatus, clearFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Buscar por producto, SKU o motivo..."
          aria-label="Buscar por producto, SKU o motivo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 bg-background"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1">
          <Badge
            variant={activeType === 'all' ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => setActiveType('all')}
          >Todos</Badge>
          {adjustmentTypes.slice(1).map((type) => (
            <Badge
              key={type}
              variant={activeType === type ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setActiveType(type)}
            >{typeLabels[type]}</Badge>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter size={14} />
              Estado
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setActiveStatus(status)}
                className={activeStatus === status ? 'bg-primary/10' : ''}
              >{filterStatusLabels[status]}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {(activeType !== 'all' || activeStatus !== 'all' || searchTerm) && (
          <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground" onClick={clearFilters}>
            <X size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
export default AdjustmentsFilters
