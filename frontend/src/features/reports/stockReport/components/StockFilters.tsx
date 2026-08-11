import { MdSearch } from 'react-icons/md';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { CATEGORIES } from '../constants';

interface StockFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (query: string) => void;
}

export function StockFilters({ selectedCategory, searchQuery, onCategoryChange, onSearchChange }: StockFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar producto..."
              aria-label="Buscar producto"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
