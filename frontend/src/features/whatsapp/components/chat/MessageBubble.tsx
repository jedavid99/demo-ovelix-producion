import React from 'react';
import { Download, FileText, Video, Check, CheckCheck, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { formatTime, formatDate } from './chat.utils';
import type { Message } from '../../whatsapp.types';

const renderAttachment = (attachment: NonNullable<Message['attachment']>) => {
  if (attachment.type === 'image') {
    return (
      <div className="relative group rounded-lg overflow-hidden mb-2 shadow-sm">
        <img src={attachment.url} alt={attachment.name} loading="lazy" className="max-w-xs max-h-80 object-cover" />
        <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" aria-label="Descargar">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }
  if (attachment.type === 'pdf') {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg mb-2 border border-green-200/40 dark:border-green-800/30 hover:bg-success/10/70 dark:hover:bg-green-900/30 transition-colors group">
        <div className="h-10 w-10 rounded-lg bg-destructive/100/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground dark:text-muted-foreground truncate">{attachment.name}</p>
          <p className="text-xs text-success/60 dark:text-green-400/60">Documento PDF</p>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-success hover:text-success hover:bg-green-100 dark:hover:bg-green-900/30" aria-label="Descargar">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }
  if (attachment.type === 'video') {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-lg mb-2 border border-green-200/40 dark:border-green-800/30 hover:bg-success/10/70 dark:hover:bg-green-900/30 transition-colors group">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Video className="h-5 w-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground dark:text-muted-foreground truncate">{attachment.name}</p>
          <p className="text-xs text-success/60 dark:text-green-400/60">Video</p>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-success hover:text-success hover:bg-green-100 dark:hover:bg-green-900/30" aria-label="Descargar">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }
  return null;
};

const renderMessageStatus = (status?: Message['status']) => {
  if (!status) return null;
  switch (status) {
    case 'sent': return <Check className="h-3.5 w-3.5" />;
    case 'delivered': return <CheckCheck className="h-3.5 w-3.5" />;
    case 'read': return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
    default: return <Clock className="h-3.5 w-3.5" />;
  }
};

interface MessageBubbleProps {
  message: Message;
  showDate: boolean;
}

export const MessageBubble = ({ message, showDate }: MessageBubbleProps) => (
  <React.Fragment>
    {showDate && (
      <div className="flex justify-center my-3">
        <span className="text-xs text-success/70 dark:text-green-400/70 bg-card/80 dark:bg-card/80 px-3 py-1 rounded-full shadow-sm border border-green-200/40 dark:border-green-800/30 backdrop-blur-sm">
          {formatDate(message.timestamp)}
        </span>
      </div>
    )}
    <div className={cn("flex", message.from === 'me' ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[75%] rounded-2xl p-3 shadow-sm transition-all hover:shadow-md",
        message.from === 'me'
          ? "bg-success text-white rounded-br-sm"
          : "bg-card  border border-green-200/50 dark:border-green-800/30 rounded-bl-sm"
      )}>
        {message.attachment && renderAttachment(message.attachment)}
        {message.text && (
          <p className={cn(
            "text-sm break-words leading-relaxed whitespace-pre-wrap",
            message.from === 'me' ? "text-white" : "text-foreground dark:text-muted-foreground"
          )}>
            {message.text}
          </p>
        )}
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <span className={cn(
            "text-[10px]",
            message.from === 'me' ? "text-white/70" : "text-success/60 dark:text-green-400/60"
          )}>
            {formatTime(message.timestamp)}
          </span>
          {message.from === 'me' && (
            <span className="flex items-center text-white/60">
              {renderMessageStatus(message.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  </React.Fragment>
);
