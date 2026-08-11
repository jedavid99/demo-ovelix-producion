import React from 'react'
import { Search, X } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

interface CategoriesFiltersProps {
  searchTerm: string
  hasActiveFilters: boolean
  onSearchChange: (val: string) => void
  onClearFilters: () => void
}

const CategoriesFilters: React.FC<CategoriesFiltersProps> = ({
  searchTerm, hasActiveFilters, onSearchChange, onClearFilters,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            aria-label="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground" onClick={onClearFilters}>
            <X size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </Card>
  )
}

export default CategoriesFilters