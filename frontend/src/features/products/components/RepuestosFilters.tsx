import React from 'react'
import { Search, ChevronDown, Filter, X, Monitor, Battery, Cpu, Zap, Wrench } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { categories, statusOptions } from '../constants/repuestos.constants'

interface RepuestosFiltersProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  activeCategory: string
  setActiveCategory: (v: string) => void
  activeStatus: string
  setActiveStatus: (v: string) => void
  clearFilters: () => void
}

export const RepuestosFilters: React.FC<RepuestosFiltersProps> = ({
  searchTerm, setSearchTerm,
  activeCategory, setActiveCategory,
  activeStatus, setActiveStatus,
  clearFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Buscar por nombre o SKU..."
          aria-label="Buscar por nombre o SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 bg-background"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1">
          <Badge
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => setActiveCategory('all')}
          >
            Todos
          </Badge>
          {categories.slice(1).map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-1"
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'pantallas' && <Monitor size={12} />}
              {cat === 'baterías' && <Battery size={12} />}
              {cat === 'componentes' && <Cpu size={12} />}
              {cat === 'cables' && <Zap size={12} />}
              {cat === 'ventiladores' && <Wrench size={12} />}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Badge>
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
              >
                {status === 'all' && 'Todos'}
                {status === 'good' && 'En stock'}
                {status === 'low' && 'Bajo stock'}
                {status === 'out' && 'Agotado'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {(activeCategory !== 'all' || activeStatus !== 'all' || searchTerm) && (
          <Button variant="ghost" size="sm" className="h-9 px-3 text-muted-foreground" onClick={clearFilters}>
            <X size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
export default RepuestosFilters
