import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

interface FilterPanelProps {
  searchKeyword: string;
  searchDate: Date | null;
  onSearchKeywordChange: (value: string) => void;
  onSearchDateChange: (date: Date | null) => void;
  onApply: () => void;
  onClear: () => void;
}

export const FilterPanel = ({
  searchKeyword,
  searchDate,
  onSearchKeywordChange,
  onSearchDateChange,
  onApply,
  onClear,
}: FilterPanelProps) => (
  <div className="px-4 py-3 border-b border-green-200/30 dark:border-green-800/20 bg-green-50/50 dark:bg-green-950/20">
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder="Buscar mensajes..."
          aria-label="Buscar mensajes"
          value={searchKeyword}
          onChange={(e) => onSearchKeywordChange(e.target.value)}
          className="pl-10 h-9 bg-card/50 border-green-200/70 dark:border-green-700/70"
        />
      </div>
      <div className="flex gap-2">
        <Input
          type="date"
          value={searchDate ? searchDate.toISOString().split('T')[0] : ''}
          onChange={(e) => onSearchDateChange(e.target.value ? new Date(e.target.value) : null)}
          className="h-9 bg-card/50 border-green-200/70 dark:border-green-700/70"
        />
        <Button onClick={onApply} size="sm" className="bg-success hover:bg-success/90 text-white">
          Aplicar
        </Button>
        <Button onClick={onClear} size="sm" variant="outline" className="border-green-200/70 dark:border-green-700/70">
          Limpiar
        </Button>
      </div>
    </div>
  </div>
);
