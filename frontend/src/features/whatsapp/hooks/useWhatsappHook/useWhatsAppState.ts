import { useState } from 'react';
import type { Contact, Message, MessagesState, AttachmentFile } from '../../whatsapp.types';

export function useWhatsAppState() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeChats, setActiveChats] = useState<Contact[]>([]);
  const [archivedChats, setArchivedChats] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<MessagesState>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [serviceOrders, setServiceOrders] = useState<any[]>([]);
  const [messagePagination, setMessagePagination] = useState<Record<string, { page: number; totalPages: number; loading: boolean }>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loadingServiceOrders, setLoadingServiceOrders] = useState(false);
  const [serviceOrdersError, setServiceOrdersError] = useState<string | null>(null);
  const [serviceOrdersCache, setServiceOrdersCache] = useState<{ data: any[]; timestamp: number } | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  return {
    contacts, setContacts,
    activeChats, setActiveChats,
    archivedChats, setArchivedChats,
    selectedContact, setSelectedContact,
    messages, setMessages,
    searchTerm, setSearchTerm,
    attachments, setAttachments,
    serviceOrders, setServiceOrders,
    messagePagination, setMessagePagination,
    isConnected, setIsConnected,
    qrCode, setQrCode,
    qrImageUrl, setQrImageUrl,
    loading, setLoading,
    newChatOpen, setNewChatOpen,
    catalogOpen, setCatalogOpen,
    orderOpen, setOrderOpen,
    showArchived, setShowArchived,
    loadingServiceOrders, setLoadingServiceOrders,
    serviceOrdersError, setServiceOrdersError,
    serviceOrdersCache, setServiceOrdersCache,
    filterDate, setFilterDate,
    filterKeyword, setFilterKeyword,
    loadingContacts, setLoadingContacts,
    loadingMessages, setLoadingMessages,
    connectionError, setConnectionError,
    pairingCode, setPairingCode,
    isLinking, setIsLinking,
  };
}
