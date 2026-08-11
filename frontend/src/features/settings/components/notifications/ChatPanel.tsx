import { FormEvent } from 'react';
import { Hash, Phone, MoreVertical, Send, Paperclip, Image, Smile } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DemoNotice } from '@/shared/components/DemoNotice';
import type { ChatMessage } from '../../types/notifications/notifications.types';

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: FormEvent) => void;
}

export const ChatPanel = ({ messages, input, onInputChange, onSend }: ChatPanelProps) => (
  <Card className="flex flex-col h-[calc(100vh-10rem)]">
    <DemoNotice
      title="Chat en modo demo"
      description="El chat de equipo no está conectado al backend. Los mensajes se pierden al recargar."
      className="rounded-none border-x-0 border-t-0"
    />
    <div className="p-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Hash size={18} className="text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Ticket #TK-8842</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              3 activos
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="text-muted-foreground">Samsung S23 Ultra</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Teléfono"><Phone size={16} /></Button>
        <Button variant="ghost" size="icon" aria-label="Más opciones"><MoreVertical size={16} /></Button>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => msg.self ? (
        <div key={msg.id} className="flex gap-3 justify-end">
          <div className="max-w-[70%]">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-xs text-muted-foreground">{msg.time}</span>
              <span className="text-sm font-medium text-foreground">Tú</span>
            </div>
            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">{msg.content}</div>
          </div>
        </div>
      ) : (
        <div key={msg.id} className="flex gap-3">
          <img src={msg.avatar} alt={msg.author} loading="lazy" className="w-8 h-8 rounded-lg object-cover" />
          <div className="max-w-[70%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">{msg.author}</span>
              <span className="text-xs text-muted-foreground">{msg.time}</span>
            </div>
            <div className="bg-muted p-3 rounded-lg rounded-tl-none">{msg.content}</div>
          </div>
        </div>
      ))}
    </div>
    <form onSubmit={onSend} className="p-4 border-t border-border">
      <div className="flex items-end gap-2">
        <textarea value={input} onChange={(e) => onInputChange(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 text-sm" rows={2} />
        <Button type="submit" disabled={!input.trim()} size="icon" className="rounded-lg" aria-label="Enviar mensaje">
          <Send size={18} />
        </Button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Adjuntar archivo"><Paperclip size={14} /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Enviar imagen"><Image size={14} /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Enviar emoji"><Smile size={14} /></Button>
      </div>
    </form>
  </Card>
);
