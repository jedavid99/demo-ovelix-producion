export interface Message {
  id: string;
  from: 'me' | 'contact';
  text?: string;
  attachment?: {
    type: 'image' | 'pdf' | 'video';
    url: string;
    name: string;
  };
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read' | 'pending';
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'client' | 'provider';
  lastInteraction?: Date;
  avatar?: string;
}

export interface MessagesState {
  [contactId: string]: Message[];
}

export interface AttachmentFile {
  file: File;
  type: 'image' | 'pdf' | 'video';
  preview: string;
}
