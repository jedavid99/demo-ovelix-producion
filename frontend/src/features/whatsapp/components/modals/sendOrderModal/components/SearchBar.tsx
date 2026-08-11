import { Search, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
      <Input placeholder="Buscar por numero, cliente o dispositivo..." aria-label="Buscar por numero, cliente o dispositivo"
        value={value} onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-10 bg-muted dark:bg-card/50 border-border/70  focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-200"
      />
      {value && (
        <button onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-muted  transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground/60" />
        </button>
      )}
    </div>
  );
}
