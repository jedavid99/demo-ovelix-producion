import { useContactList } from './hooks/useContactList';
import { ContactListHeader } from './components/ContactListHeader';
import { ContactListItem } from './components/ContactListItem';
import { ContactListSkeleton } from './components/ContactListSkeleton';
import { EmptyState } from './components/EmptyState';
import { ContactListFooter } from './components/ContactListFooter';
import type { ContactListProps } from './types';

export function ContactList({
  contacts, selectedContact, onSelectContact, searchTerm, onSearchChange,
  onNewChat, unreadCounts = {}, onArchiveChat, onUnarchiveChat, onDeleteChat,
  archivedChats = [], showArchived = false, onToggleArchived, loading = false,
}: ContactListProps) {
  const { isFocused, setIsFocused, clearSearch, formatLastInteraction } = useContactList(searchTerm, onSearchChange);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50/50 via-white to-green-50/30 dark:from-green-950/20 dark:via-gray-950/30 dark:to-green-950/10 border-r border-green-200/40 dark:border-green-900/20">
      <ContactListHeader
        showArchived={showArchived} archivedCount={archivedChats.length} filteredCount={filteredContacts.length}
        searchTerm={searchTerm} isFocused={isFocused}
        onSearchChange={onSearchChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        onClearSearch={clearSearch} onNewChat={onNewChat} onToggleArchived={onToggleArchived}
      />

      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-800 scrollbar-track-transparent hover:scrollbar-thumb-green-300 dark:hover:scrollbar-thumb-green-700">
        {loading ? (
          <ContactListSkeleton />
        ) : showArchived ? (
          archivedChats.length === 0 ? (
            <EmptyState isArchived />
          ) : (
            archivedChats.map((contact) => (
              <ContactListItem
                key={contact.id} contact={contact} isSelected={selectedContact?.id === contact.id}
                isArchived formatLastInteraction={formatLastInteraction}
                onSelect={() => onSelectContact(contact)}
                onUnarchive={onUnarchiveChat ? () => onUnarchiveChat(contact) : undefined}
              />
            ))
          )
        ) : filteredContacts.length === 0 ? (
          <EmptyState isArchived={false} searchTerm={searchTerm} />
        ) : (
          filteredContacts.map((contact) => (
            <ContactListItem
              key={contact.id} contact={contact} isSelected={selectedContact?.id === contact.id}
              unread={unreadCounts[contact.id] || 0} formatLastInteraction={formatLastInteraction}
              onSelect={() => onSelectContact(contact)}
              onArchive={onArchiveChat ? () => onArchiveChat(contact) : undefined}
              onDelete={onDeleteChat ? () => onDeleteChat(contact) : undefined}
            />
          ))
        )}
      </div>

      <ContactListFooter
        filteredCount={filteredContacts.length} totalContacts={contacts.length}
        searchTerm={searchTerm}
        activeCount={contacts.filter(c => c.lastInteraction && new Date(c.lastInteraction) > new Date(Date.now() - 60000)).length}
      />
    </div>
  );
}
