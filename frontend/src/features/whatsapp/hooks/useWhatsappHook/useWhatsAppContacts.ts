import { useEffect, useState } from 'react';
import * as api from '../../api/whatsapp/whatsappApi';
import { toast } from '@/shared/components/ui/use-toast';
import { mockContacts } from '../../constants/whatsapp/whatsapp.constants';
import type { Contact, Message } from '../../whatsapp.types';

interface ContactsDeps {
  isConnected: boolean;
  selectedContact: Contact | null;
  setSelectedContact: (c: Contact | null) => void;
  contacts: Contact[];
  setContacts: (value: Contact[] | ((prev: Contact[]) => Contact[])) => void;
  activeChats: Contact[];
  setActiveChats: (fn: (prev: Contact[]) => Contact[]) => void;
  archivedChats: Contact[];
  setArchivedChats: (fn: (prev: Contact[]) => Contact[]) => void;
  messages: Record<string, Message[]>;
  setMessages: (fn: (prev: Record<string, Message[]>) => Record<string, Message[]>) => void;
  setMessagePagination: (fn: (prev: Record<string, { page: number; totalPages: number; loading: boolean }>) => any) => void;
  setLoadingContacts: (v: boolean) => void;
}

export function useWhatsAppContacts(deps: ContactsDeps) {
  const {
    isConnected, selectedContact, setSelectedContact,
    contacts, setContacts,
    setActiveChats, archivedChats, setArchivedChats,
    messages, setMessages, setMessagePagination, setLoadingContacts,
  } = deps;

  useEffect(() => {
    (async () => {
      setLoadingContacts(true);
      try {
        const response = await api.getClients();
        const clients = response.data?.data || [];
        const whatsappContacts: Contact[] = clients.map((client: any) => ({
          id: client.id,
          name: client.nombre_completo,
          phone: client.telefono,
          type: 'client' as const,
          lastInteraction: new Date(client.fecha_registro || Date.now()),
          avatar: undefined,
          status: 'offline' as const,
        }));

        setContacts(whatsappContacts);
        setLoadingContacts(false);

        const activeChatsWithMessages: Contact[] = [];
        const messagePromises = whatsappContacts.map(async (contact) => {
          try {
            const messagesResponse = await api.getClientMessages(contact.id, 1, 20);
            const messagesData = messagesResponse.data?.data?.data || [];
            const meta = messagesResponse.data?.data?.meta || {};

            if (Array.isArray(messagesData) && messagesData.length > 0) {
              return { contact, hasMessages: true, messagesData, meta };
            }
            return { contact, hasMessages: false, messagesData: [], meta };
          } catch (error) {
            console.error(`Error loading messages for contact ${contact.id}:`, error);
            return { contact, hasMessages: false, messagesData: [], meta: {} };
          }
        });

        const results = await Promise.all(messagePromises);

        results.forEach(({ contact, hasMessages, messagesData, meta }) => {
          if (hasMessages) {
            activeChatsWithMessages.push(contact);
            const formattedMessages: Message[] = messagesData.map((msg: any) => ({
              id: msg.id,
              from: msg.direccion === 'sent' ? 'me' as const : 'contact' as const,
              text: msg.mensaje,
              timestamp: new Date(msg.fecha_envio),
            }));
            setMessages((prev) => ({
              ...prev,
              [contact.id]: formattedMessages,
            }));
            setMessagePagination((prev) => ({
              ...prev,
              [contact.id]: {
                page: 1,
                totalPages: meta.totalPages || 1,
                loading: false,
              },
            }));
          }
        });

        setActiveChats(() => activeChatsWithMessages);
      } catch (error) {
        console.error('Error loading clients:', error);
        setContacts(mockContacts);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    (async () => {
      try {
        const response = await api.getChats();
        const chats = response.data.data || [];

        setContacts((prevContacts) =>
          prevContacts.map((contact) => {
            const whatsappChat = chats.find((chat: any) =>
              chat.id.includes(contact.phone) || chat.id.includes(contact.phone.replace(/\D/g, ''))
            );
            if (whatsappChat) {
              return { ...contact, status: 'online' as const, lastInteraction: new Date(whatsappChat.timestamp || Date.now()) };
            }
            return contact;
          })
        );
      } catch (error) {
        console.error('Error loading WhatsApp chats:', error);
      }
    })();
  }, [isConnected]);

  const handleArchiveChat = (contact: Contact) => {
    setActiveChats((prev) => prev.filter((c) => c.id !== contact.id));
    setArchivedChats((prev) => [...prev, contact]);
    if (selectedContact?.id === contact.id) {
      setSelectedContact(null);
    }
  };

  const handleUnarchiveChat = (contact: Contact) => {
    setArchivedChats((prev) => prev.filter((c) => c.id !== contact.id));
    setActiveChats((prev) => [...prev, contact]);
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleDeleteChat = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteChat = async () => {
    const contact = contactToDelete;
    if (!contact) return;

    try {
      setMessages((prev) => {
        const newMessages = { ...prev };
        delete newMessages[contact.id];
        return newMessages;
      });

      setActiveChats((prev) => prev.filter((c) => c.id !== contact.id));
      setArchivedChats((prev) => prev.filter((c) => c.id !== contact.id));

      if (selectedContact?.id === contact.id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error al eliminar chat:', error);
      toast({ title: 'Error', description: 'Error al eliminar el chat. Por favor intenta nuevamente.', variant: 'destructive' });
    } finally {
      setDeleteConfirmOpen(false);
      setContactToDelete(null);
    }
  };

  return { handleArchiveChat, handleUnarchiveChat, handleDeleteChat, confirmDeleteChat, deleteConfirmOpen, setDeleteConfirmOpen, contactToDelete };
}
