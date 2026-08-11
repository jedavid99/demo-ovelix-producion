import { Search, Plus, X, Archive, ArchiveRestore, MessageCircle } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

interface ContactListHeaderProps {
  showArchived: boolean;
  archivedCount: number;
  filteredCount: number;
  searchTerm: string;
  isFocused: boolean;
  onSearchChange: (term: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClearSearch: () => void;
  onNewChat: () => void;
  onToggleArchived?: () => void;
}

export function ContactListHeader({
  showArchived, archivedCount, filteredCount, searchTerm, isFocused,
  onSearchChange, onFocus, onBlur, onClearSearch, onNewChat, onToggleArchived,
}: ContactListHeaderProps) {
  return (
    <div className="p-4 border-b border-green-200/50 dark:border-green-800/30 bg-card/80 dark:bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 dark:supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-success" />
          <h2 className="text-lg font-semibold tracking-tight text-green-700 dark:text-green-400">
            {showArchived ? 'Archivados' : 'Chats'}
          </h2>
          <Badge variant="secondary" className="ml-1 text-xs font-mono bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">
            {showArchived ? archivedCount : filteredCount}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {onToggleArchived && archivedCount > 0 && (
            <Button size="sm" onClick={onToggleArchived} variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400 border-0 shadow-none transition-all"
              title={showArchived ? 'Ver chats activos' : 'Ver chats archivados'}
            >
              {showArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
          )}
          <Button size="sm" onClick={onNewChat}
            className="h-8 w-8 rounded-full bg-success/10 hover:bg-success/20 text-success dark:text-green-400 border-0 shadow-none transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400/70" />
        <Input placeholder="Buscar contacto..." aria-label="Buscar contacto" value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus} onBlur={onBlur}
          className={cn(
            "pl-10 pr-10 h-9 bg-card/80 dark:bg-card/80 border-green-200/50 dark:border-green-800/30",
            "focus-visible:ring-2 focus-visible:ring-green-400/40 focus-visible:border-green-400/40",
            "placeholder:text-muted-foreground/60 transition-all duration-200",
            isFocused && "bg-card shadow-md border-green-300/70"
          )}
        />
        {searchTerm && (
          <button onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-green-400/60" />
          </button>
        )}
      </div>
    </div>
  );
}
