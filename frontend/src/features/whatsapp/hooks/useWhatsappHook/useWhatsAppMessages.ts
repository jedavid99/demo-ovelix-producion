import { useEffect } from 'react';
import * as api from '../../api/whatsapp/whatsappApi';
import type { Contact, Message, AttachmentFile } from '../../whatsapp.types';

interface MessagesDeps {
  selectedContact: Contact | null;
  setSelectedContact: (c: Contact | null) => void;
  messages: Record<string, Message[]>;
  setMessages: (fn: (prev: Record<string, Message[]>) => Record<string, Message[]>) => void;
  messagePagination: Record<string, { page: number; totalPages: number; loading: boolean }>;
  setMessagePagination: (fn: (prev: Record<string, { page: number; totalPages: number; loading: boolean }>) => any) => void;
  loadingMessages: boolean;
  setLoadingMessages: (v: boolean) => void;
  activeChats: Contact[];
  setActiveChats: (fn: (prev: Contact[]) => Contact[]) => void;
  contacts: Contact[];
  setContacts: (fn: (prev: Contact[]) => Contact[]) => void;
  attachments: AttachmentFile[];
  setAttachments: (fn: (prev: AttachmentFile[]) => AttachmentFile[]) => void;
  isConnected: boolean;
}

export function useWhatsAppMessages(deps: MessagesDeps) {
  const {
    selectedContact, setSelectedContact, messages, setMessages,
    messagePagination, setMessagePagination, loadingMessages, setLoadingMessages,
    setActiveChats, contacts, setContacts, attachments, setAttachments, isConnected,
  } = deps;

  useEffect(() => {
    if (!selectedContact) return;

    const pollMessages = async () => {
      try {
        const response = await api.getClientMessages(selectedContact.id);
        const messagesData = response.data?.data?.data || [];

        if (!Array.isArray(messagesData)) {
          console.error('messagesData is not an array:', messagesData);
          setLoadingMessages(false);
          return;
        }

        const formattedMessages: Message[] = messagesData.map((msg: any) => ({
          id: msg.id,
          from: msg.direccion === 'sent' ? 'me' as const : 'contact' as const,
          text: msg.mensaje,
          timestamp: new Date(msg.fecha_envio),
        }));

        setMessages((prev) => {
          const currentMessages = prev[selectedContact.id] || [];
          if (formattedMessages.length > currentMessages.length) {
            setLoadingMessages(false);
            return { ...prev, [selectedContact.id]: formattedMessages };
          }
          setLoadingMessages(false);
          return prev;
        });
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    };

    pollMessages();
    const interval = setInterval(pollMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedContact]);

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setLoadingMessages(true);

    setActiveChats((prev) => {
      if (!prev.find((c) => c.id === contact.id)) return [...prev, contact];
      return prev;
    });

    if (isConnected) {
      try {
        const response = await api.getClientMessages(contact.id);
        const dbMessages = response.data?.data?.data || [];

        if (!Array.isArray(dbMessages)) {
          console.error('dbMessages is not an array:', dbMessages);
          return;
        }

        const formattedMessages: Message[] = dbMessages.map((msg: any) => ({
          id: msg.id,
          from: msg.direccion === 'sent' ? 'me' as const : 'contact' as const,
          text: msg.mensaje,
          timestamp: new Date(msg.fecha_envio),
          status: 'sent' as const,
          attachment: msg.archivo_url ? {
            type: (msg.tipo === 'image' ? 'image' : msg.tipo === 'pdf' ? 'pdf' : 'video') as 'image' | 'pdf' | 'video',
            url: msg.archivo_url,
            name: msg.archivo_url.split('/').pop() || '',
          } : undefined,
        }));

        setMessages((prev) => ({ ...prev, [contact.id]: formattedMessages }));
        setLoadingMessages(false);
      } catch (error) {
        console.error('Error loading message history:', error);
        setMessages((prev) => ({ ...prev, [contact.id]: [] }));
        setLoadingMessages(false);
      }
    } else {
      setMessages((prev) => ({ ...prev, [contact.id]: [] }));
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'me',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id ? { ...c, lastInteraction: new Date() } : c
      )
    );

    setActiveChats((prev) => {
      if (!prev.find((c) => c.id === selectedContact.id)) return [...prev, selectedContact];
      return prev;
    });

    try {
      await api.sendToClient(selectedContact.id, text);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: (prev[selectedContact.id] || []).filter(
          (msg) => msg.id !== newMessage.id
        ),
      }));
    }
  };

  const handleSendAttachment = (attachment: AttachmentFile) => {
    if (!selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'me',
      attachment: {
        type: attachment.type,
        url: attachment.preview || '',
        name: attachment.file.name,
      },
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    setAttachments((prev) => prev.filter((_, i) => i !== attachments.indexOf(attachment)));
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendCatalog = (products: any[]) => {
    if (!selectedContact) return;

    const catalogText = products
      .map((p) => `\u2022 ${p.name} - $${p.price.toLocaleString()} (Stock: ${p.stock})`)
      .join('\n');

    handleSendMessage(`\uD83D\uDCE6 Cat\u00E1logo de productos:\n\n${catalogText}`);
  };

  const handleSendOrder = async (order: any) => {
    if (!selectedContact) return;

    try {
      let statusEmoji = '';
      switch (order.status) {
        case 'Pendiente': statusEmoji = '\u23F3'; break;
        case 'En progreso': statusEmoji = '\uD83D\uDD27'; break;
        case 'Completado': statusEmoji = '\u2705'; break;
        default: statusEmoji = '\uD83D\uDCCC';
      }

      const caption = `\uD83D\uDCCB *\u00A1Hola ${order.clientName}!* Esta es tu Orden de Servicio #${order.orderNumber}.\n\n` +
        `\uD83D\uDC64 *Cliente:* ${order.clientName}\n` +
        `\uD83D\uDCF1 *Dispositivo:* ${order.device}\n` +
        `${statusEmoji} *Estado:* ${order.status}\n` +
        `\uD83D\uDCB0 *Total:* $${order.total.toLocaleString()}\n\n` +
        `\u26A0\uFE0F *Nota importante:* Al momento de retirar tu equipo, por favor muestra la orden de servicio o el n\u00FAmero de la orden. \u00A1Te sugerimos guardar este n\u00FAmero!\n\n` +
        `\uD83D\uDD0D Si quieres saber el estado de tu equipo, ingresa el n\u00FAmero de la orden en el siguiente link:\n\uD83D\uDC49 https://tusitio.com/seguimiento`;

      await api.sendOrderPdf(selectedContact.id, order.id, caption);

      const newMessage: Message = {
        id: Date.now().toString(),
        from: 'me',
        text: caption,
        timestamp: new Date(),
        attachment: {
          type: 'pdf',
          url: '',
          name: `orden-servicio-${order.orderNumber}.pdf`,
        },
      };

      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
      }));

      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id ? { ...c, lastInteraction: new Date() } : c
        )
      );
    } catch (error) {
      console.error('Error sending order PDF:', error);
      const orderText = `\uD83D\uDD27 Orden de Servicio: ${order.orderNumber}\n\n` +
        `Cliente: ${order.clientName}\n` +
        `Dispositivo: ${order.device}\n` +
        `Estado: ${order.status}\n` +
        `Total: $${order.total.toLocaleString()}\n\n` +
        `No se pudo generar el PDF. Por favor, contacta al soporte.`;

      handleSendMessage(orderText);
    }
  };

  const handleLoadMoreMessages = async () => {
    if (!selectedContact) return;

    const pagination = messagePagination[selectedContact.id];
    if (!pagination || pagination.loading || pagination.page >= pagination.totalPages) return;

    setMessagePagination((prev) => ({
      ...prev,
      [selectedContact.id]: { ...pagination, loading: true },
    }));

    try {
      const nextPage = pagination.page + 1;
      const response = await api.getClientMessages(selectedContact.id, nextPage, 20);
      const messagesData = response.data?.data?.data || [];

      if (!Array.isArray(messagesData)) {
        console.error('messagesData is not an array:', messagesData);
        setMessagePagination((prev) => ({
          ...prev,
          [selectedContact.id]: { ...pagination, loading: false },
        }));
        return;
      }

      const formattedMessages: Message[] = messagesData.map((msg: any) => ({
        id: msg.id,
        from: msg.direccion === 'sent' ? 'me' as const : 'contact' as const,
        text: msg.mensaje,
        timestamp: new Date(msg.fecha_envio),
      }));

      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...formattedMessages, ...(prev[selectedContact.id] || [])],
      }));

      setMessagePagination((prev) => ({
        ...prev,
        [selectedContact.id]: { ...pagination, page: nextPage, loading: false },
      }));
    } catch (error) {
      console.error('Error loading more messages:', error);
      setMessagePagination((prev) => ({
        ...prev,
        [selectedContact.id]: { ...pagination, loading: false },
      }));
    }
  };

  return {
    handleSelectContact, handleSendMessage, handleSendAttachment,
    handleRemoveAttachment, handleSendCatalog, handleSendOrder,
    handleLoadMoreMessages,
  };
}
