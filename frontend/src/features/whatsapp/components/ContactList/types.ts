import type { Contact } from '../../whatsapp.types';

export interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewChat: () => void;
  unreadCounts?: Record<string, number>;
  onArchiveChat?: (contact: Contact) => void;
  onUnarchiveChat?: (contact: Contact) => void;
  onDeleteChat?: (contact: Contact) => void;
  archivedChats?: Contact[];
  showArchived?: boolean;
  onToggleArchived?: () => void;
  loading?: boolean;
}
