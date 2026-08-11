import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import type { StatusFilter } from '../types/clients.types';

interface ClientsFiltersProps {
  query: string;
  onSearch: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilter: (f: StatusFilter) => void;
  totalFiltered: number;
}

export const ClientsFilters = ({ query, onSearch, statusFilter, onStatusFilter, totalFiltered }: ClientsFiltersProps) => (
  <div className="flex flex-wrap gap-4 items-center">
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
      <Input placeholder="Buscar por nombre, DNI o teléfono..." aria-label="Buscar por nombre, DNI o teléfono" value={query} onChange={e => onSearch(e.target.value)} className="pl-10" />
    </div>
    <div className="flex gap-2">
      <Badge variant={statusFilter === 'all' ? 'default' : 'outline'} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onStatusFilter('all')}>Todos</Badge>
      <Badge variant={statusFilter === 'activo' ? 'success' : 'outline'} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onStatusFilter('activo')}>Activos</Badge>
      <Badge variant={statusFilter === 'inactivo' ? 'secondary' : 'outline'} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onStatusFilter('inactivo')}>Inactivos</Badge>
    </div>
    <span className="text-sm text-muted-foreground ml-auto">{totalFiltered} cliente{totalFiltered !== 1 ? 's' : ''}</span>
  </div>
);
