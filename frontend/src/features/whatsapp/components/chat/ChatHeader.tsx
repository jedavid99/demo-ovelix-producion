import { X, Filter, MoreVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/lib/utils';
import { getStatusColor, getStatusText } from './chat.utils';
import type { Contact } from '../../whatsapp.types';

interface ChatHeaderProps {
  selectedContact: Contact;
  onBack?: () => void;
  contactStatus: 'online' | 'offline' | 'last_seen';
  lastSeen?: Date;
  filterDate: Date | null;
  filterKeyword: string;
  showFilterPanel: boolean;
  onToggleFilter: () => void;
  onClearFilters?: () => void;
}

export const ChatHeader = ({
  selectedContact,
  onBack,
  contactStatus,
  lastSeen,
  filterDate,
  filterKeyword,
  showFilterPanel,
  onToggleFilter,
  onClearFilters,
}: ChatHeaderProps) => (
  <div className="p-4 border-b border-green-200/40 dark:border-green-800/30 bg-card/80 dark:bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 dark:supports-[backdrop-filter]:bg-background/60 shadow-sm flex items-center gap-3">
    {onBack && (
      <Button
        size="icon"
        variant="ghost"
        className="lg:hidden h-9 w-9 shrink-0 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300"
        onClick={onBack}
        aria-label="Volver a la lista de chats"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    )}
    <Avatar className="h-11 w-11 ring-2 ring-green-500/20 shadow-sm shrink-0">
      <AvatarImage src={selectedContact.avatar} />
      <AvatarFallback className="bg-gradient-to-br from-green-500/20 to-green-500/5 text-success dark:text-green-400 font-medium">
        {selectedContact.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold tracking-tight truncate text-green-800 dark:text-green-200">
        {selectedContact.name}
      </h3>
      <div className="flex items-center gap-2">
        <span className={cn("inline-block h-2 w-2 rounded-full", getStatusColor(contactStatus))} />
        <p className="text-xs text-success/70 dark:text-green-400/70 truncate">{getStatusText(contactStatus, lastSeen)}</p>
      </div>
    </div>
    <div className="flex items-center gap-1">
      {(filterDate || filterKeyword) && onClearFilters && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-destructive dark:text-destructive"
          onClick={onClearFilters}
          title="Limpiar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "h-8 w-8 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400",
          (filterDate || filterKeyword) && "bg-green-100 dark:bg-green-900/30"
        )}
        title="Filtrar mensajes"
        onClick={onToggleFilter}
      >
        <Filter className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
