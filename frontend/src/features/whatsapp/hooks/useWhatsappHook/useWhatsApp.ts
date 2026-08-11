import { useWhatsAppState } from './useWhatsAppState';
import { useWhatsAppConnection } from './useWhatsAppConnection';
import { useWhatsAppMessages } from './useWhatsAppMessages';
import { useWhatsAppContacts } from './useWhatsAppContacts';
import { useWhatsAppServiceOrders } from './useWhatsAppServiceOrders';
import { useWhatsAppFilter } from './useWhatsAppFilter';
import { getContactStatus, getLastSeenText } from './utils';

export function useWhatsApp() {
  const state = useWhatsAppState();

  const { handleLogout, handleGenerateQR, handleRegenerateQR, handleRequestPairingCode } = useWhatsAppConnection({
    isConnected: state.isConnected,
    setIsConnected: state.setIsConnected,
    qrCode: state.qrCode,
    setQrCode: state.setQrCode,
    qrImageUrl: state.qrImageUrl,
    setQrImageUrl: state.setQrImageUrl,
    loading: state.loading,
    setLoading: state.setLoading,
    connectionError: state.connectionError,
    setConnectionError: state.setConnectionError,
    pairingCode: state.pairingCode,
    setPairingCode: state.setPairingCode,
    isLinking: state.isLinking,
    setIsLinking: state.setIsLinking,
  });

  const messagesHandlers = useWhatsAppMessages({
    selectedContact: state.selectedContact,
    setSelectedContact: state.setSelectedContact,
    messages: state.messages,
    setMessages: state.setMessages,
    messagePagination: state.messagePagination,
    setMessagePagination: state.setMessagePagination,
    loadingMessages: state.loadingMessages,
    setLoadingMessages: state.setLoadingMessages,
    activeChats: state.activeChats,
    setActiveChats: state.setActiveChats,
    contacts: state.contacts,
    setContacts: state.setContacts,
    attachments: state.attachments,
    setAttachments: state.setAttachments,
    isConnected: state.isConnected,
  });

  const contactHandlers = useWhatsAppContacts({
    isConnected: state.isConnected,
    selectedContact: state.selectedContact,
    setSelectedContact: state.setSelectedContact,
    contacts: state.contacts,
    setContacts: state.setContacts,
    activeChats: state.activeChats,
    setActiveChats: state.setActiveChats,
    archivedChats: state.archivedChats,
    setArchivedChats: state.setArchivedChats,
    messages: state.messages,
    setMessages: state.setMessages,
    setMessagePagination: state.setMessagePagination,
    setLoadingContacts: state.setLoadingContacts,
  });

  useWhatsAppServiceOrders({
    orderOpen: state.orderOpen,
    selectedContact: state.selectedContact,
    serviceOrders: state.serviceOrders,
    setServiceOrders: state.setServiceOrders,
    loadingServiceOrders: state.loadingServiceOrders,
    setLoadingServiceOrders: state.setLoadingServiceOrders,
    serviceOrdersError: state.serviceOrdersError,
    setServiceOrdersError: state.setServiceOrdersError,
    serviceOrdersCache: state.serviceOrdersCache,
    setServiceOrdersCache: state.setServiceOrdersCache,
  });

  const { getFilteredMessages } = useWhatsAppFilter({
    messages: state.messages,
    filterDate: state.filterDate,
    filterKeyword: state.filterKeyword,
  });

  return {
    contacts: state.contacts,
    setContacts: state.setContacts,
    activeChats: state.activeChats,
    setActiveChats: state.setActiveChats,
    archivedChats: state.archivedChats,
    setArchivedChats: state.setArchivedChats,
    selectedContact: state.selectedContact,
    setSelectedContact: state.setSelectedContact,
    messages: state.messages,
    setMessages: state.setMessages,
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    attachments: state.attachments,
    setAttachments: state.setAttachments,
    serviceOrders: state.serviceOrders,
    setServiceOrders: state.setServiceOrders,
    messagePagination: state.messagePagination,
    setMessagePagination: state.setMessagePagination,
    isConnected: state.isConnected,
    setIsConnected: state.setIsConnected,
    qrCode: state.qrCode,
    setQrCode: state.setQrCode,
    qrImageUrl: state.qrImageUrl,
    loading: state.loading,
    setLoading: state.setLoading,
    newChatOpen: state.newChatOpen,
    setNewChatOpen: state.setNewChatOpen,
    catalogOpen: state.catalogOpen,
    setCatalogOpen: state.setCatalogOpen,
    orderOpen: state.orderOpen,
    setOrderOpen: state.setOrderOpen,
    showArchived: state.showArchived,
    setShowArchived: state.setShowArchived,
    loadingServiceOrders: state.loadingServiceOrders,
    serviceOrdersError: state.serviceOrdersError,
    loadingContacts: state.loadingContacts,
    loadingMessages: state.loadingMessages,
    connectionError: state.connectionError,
    pairingCode: state.pairingCode,
    isLinking: state.isLinking,
    filterDate: state.filterDate,
    setFilterDate: state.setFilterDate,
    filterKeyword: state.filterKeyword,
    setFilterKeyword: state.setFilterKeyword,
    handleLogout,
    handleGenerateQR,
    handleRegenerateQR,
    handleRequestPairingCode,
    ...messagesHandlers,
    ...contactHandlers,
    getFilteredMessages,
    getContactStatus,
    getLastSeenText,
  };
}
