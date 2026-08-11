import { Search, Archive } from 'lucide-react';

interface EmptyStateProps {
  isArchived: boolean;
  searchTerm?: string;
}

export function EmptyState({ isArchived, searchTerm }: EmptyStateProps) {
  const Icon = isArchived ? Archive : Search;
  const title = isArchived
    ? 'No hay chats archivados'
    : 'No se encontraron contactos';
  const subtitle = isArchived
    ? undefined
    : (searchTerm ? 'Intenta con otra búsqueda' : 'Comienza un nuevo chat');

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
      <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="h-6 w-6 text-green-400/60" />
      </div>
      <p className="text-sm font-medium text-green-700 dark:text-green-300">{title}</p>
      {subtitle && (
        <p className="text-xs text-success/60 dark:text-green-400/60 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
