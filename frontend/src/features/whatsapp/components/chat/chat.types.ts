import type { Contact, Message, AttachmentFile } from '../../whatsapp.types';

export interface ChatAreaProps {
  selectedContact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSendAttachment: (file: AttachmentFile) => void;
  onRemoveAttachment: (index: number) => void;
  attachments: AttachmentFile[];
  onDeleteMessage?: (messageId: string) => void;
  onCopyMessage?: (text: string) => void;
  isTyping?: boolean;
  contactStatus?: 'online' | 'offline' | 'last_seen';
  lastSeen?: Date;
  onSendCatalog?: () => void;
  onRequestQuote?: () => void;
  onSendServiceOrder?: () => void;
  onSendOrder?: () => void;
  onLoadMoreMessages?: () => void;
  hasMoreMessages?: boolean;
  isLoadingMore?: boolean;
  filterDate?: Date | null;
  filterKeyword?: string;
  onFilterDateChange?: (date: Date | null) => void;
  onFilterKeywordChange?: (keyword: string) => void;
  onClearFilters?: () => void;
  loading?: boolean;
}
