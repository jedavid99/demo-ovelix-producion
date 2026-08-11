import { User, Building2, Clock, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { Contact } from '../../../whatsapp.types';

interface ContactListItemProps {
  contact: Contact;
  isSelected: boolean;
  unread?: number;
  isArchived?: boolean;
  formatLastInteraction: (date?: Date) => string;
  onSelect: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
  onDelete?: () => void;
}

export function ContactListItem({
  contact, isSelected, unread = 0, isArchived = false,
  formatLastInteraction, onSelect, onArchive, onUnarchive, onDelete,
}: ContactListItemProps) {
  return (
    <div className="relative group">
      <button onClick={onSelect}
        className={cn(
          "w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200",
          "hover:bg-success/10/70 dark:hover:bg-green-900/20 hover:shadow-md hover:scale-[1.02]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40",
          isSelected
            ? "bg-green-50 dark:bg-green-900/30 shadow-lg ring-1 ring-green-300/50 dark:ring-green-700/50"
            : "bg-transparent"
        )}
      >
        <div className="relative flex-shrink-0">
          <Avatar className="h-11 w-11 ring-2 ring-white dark:ring-gray-800 shadow-sm">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback
              className={cn(
                "text-sm font-medium",
                isSelected
                  ? "bg-success/20 text-success dark:text-green-400"
                  : "bg-gradient-to-br from-green-500/10 to-green-500/5 text-success dark:text-green-400"
              )}
            >
              {contact.type === 'client' ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          {isArchived && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-white  flex items-center justify-center">
              <ArchiveRestore className="h-2.5 w-2.5 text-white" />
            </div>
          )}
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800 shadow-sm">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("font-medium text-sm truncate", isSelected ? "text-green-800 dark:text-green-200" : "text-foreground dark:text-muted-foreground")}>
              {contact.name}
            </span>
            {contact.lastInteraction && (
              <span className={cn("text-[10px] flex items-center gap-1 flex-shrink-0", isSelected ? "text-success/70 dark:text-green-400/70" : "text-muted-foreground/70 dark:text-muted-foreground/70")}>
                <Clock className="h-3 w-3" />
                {formatLastInteraction(contact.lastInteraction)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn("text-xs truncate", isSelected ? "text-green-700/80 dark:text-green-300/80" : "text-muted-foreground/80 dark:text-muted-foreground/80")}>
              {contact.phone}
            </span>
            <Badge variant={isSelected ? "secondary" : "outline"}
              className={cn("text-[10px] px-2 py-0 h-5 font-medium flex-shrink-0 border-0",
                isSelected
                  ? "bg-green-200/60 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                  : "bg-green-100/40 text-success dark:bg-green-900/30 dark:text-green-400 border-green-200/30 dark:border-green-800/30"
              )}
            >
              {contact.type === 'client' ? 'Cliente' : 'Proveedor'}
            </Badge>
          </div>
        </div>

        {isSelected && <div className="w-1.5 h-8 rounded-full bg-success flex-shrink-0" />}
      </button>

      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          {onArchive && (
            <Button size="icon" variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400"
              onClick={(e) => { e.stopPropagation(); onArchive(); }} title="Archivar"
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          )}
          {onUnarchive && (
            <Button size="icon" variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400"
              onClick={(e) => { e.stopPropagation(); onUnarchive(); }} title="Desarchivar"
            >
              <ArchiveRestore className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-destructive dark:text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
