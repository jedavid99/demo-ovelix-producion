import { Search, Filter, RotateCcw } from 'lucide-react';

interface InventoryFiltersProps {
  searchQuery: string;
  seriesFilter: string;
  conditionFilter: string;
  onSearchChange: (v: string) => void;
  onSeriesChange: (v: string) => void;
  onConditionChange: (v: string) => void;
}

export function InventoryFilters({ searchQuery, seriesFilter, conditionFilter, onSearchChange, onSeriesChange, onConditionChange }: InventoryFiltersProps) {
  return (
    <div className="p-6 border-b border-border  flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-[300px]">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar IMEI, modelo o n\u00FAmero de serie..."
            aria-label="Buscar IMEI, modelo o número de serie"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted dark:bg-muted border border-border dark:border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select value={seriesFilter} onChange={(e) => onSeriesChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-muted dark:bg-muted border border-border dark:border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
          <option>Series: Todas</option>
          <option>iPhone 15 Series</option>
          <option>iPhone 14 Series</option>
          <option>iPhone 13 Series</option>
        </select>
        <select value={conditionFilter} onChange={(e) => onConditionChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-muted dark:bg-muted border border-border dark:border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm">
          <option>Condici\u00F3n: Todas</option>
          <option>Nuevo</option>
          <option>Usado - Como nuevo</option>
          <option>Usado - Bueno</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors text-muted-foreground">
          <Filter size={18} />
        </button>
        <button className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors text-muted-foreground">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
