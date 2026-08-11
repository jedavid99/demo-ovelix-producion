import React from 'react';
import { MdSearch, MdCancel } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { STATUS_FILTERS } from './Budgets.types';

interface BudgetsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const BudgetsFilters: React.FC<BudgetsFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por cliente, dispositivo o ID..."
            aria-label="Buscar por cliente, dispositivo o ID"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => onStatusFilterChange(status)}
            >
              {status === 'all' ? 'Todos' : status}
            </Badge>
          ))}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-muted-foreground"
            onClick={onClearFilters}
          >
            <MdCancel size={14} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>
    </Card>
  );
};
