import type { Message } from '../../whatsapp.types';

interface FilterDeps {
  messages: Record<string, Message[]>;
  filterDate: Date | null;
  filterKeyword: string;
}

export function useWhatsAppFilter(deps: FilterDeps) {
  const { messages, filterDate, filterKeyword } = deps;

  const getFilteredMessages = (contactId: string): Message[] => {
    const contactMessages = messages[contactId] || [];

    if (!filterDate && !filterKeyword) return contactMessages;

    return contactMessages.filter((msg) => {
      if (filterDate) {
        const msgDate = new Date(msg.timestamp);
        const filterDateObj = new Date(filterDate);
        const isSameDay =
          msgDate.getDate() === filterDateObj.getDate() &&
          msgDate.getMonth() === filterDateObj.getMonth() &&
          msgDate.getFullYear() === filterDateObj.getFullYear();
        if (!isSameDay) return false;
      }
      if (filterKeyword) {
        const keywordLower = filterKeyword.toLowerCase();
        if (!msg.text?.toLowerCase().includes(keywordLower)) return false;
      }
      return true;
    });
  };

  return { getFilteredMessages };
}
