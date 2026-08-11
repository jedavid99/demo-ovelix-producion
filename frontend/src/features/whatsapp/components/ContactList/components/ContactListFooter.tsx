interface ContactListFooterProps {
  filteredCount: number;
  totalContacts: number;
  searchTerm: string;
  activeCount: number;
}

export function ContactListFooter({ filteredCount, totalContacts, searchTerm, activeCount }: ContactListFooterProps) {
  return (
    <div className="p-3 border-t border-green-200/30 dark:border-green-800/20 bg-card/50 dark:bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between text-xs text-success/60 dark:text-green-400/60">
        <span>{filteredCount} contactos{searchTerm && ' (filtrados)'}</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          {activeCount} activos
        </span>
      </div>
    </div>
  );
}
