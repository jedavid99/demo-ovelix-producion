import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, Calendar, Search as SearchIcon } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { formatDate } from './chat/chat.utils';
import { MessageBubble } from './chat/MessageBubble';
import { EmptyChatState } from './chat/EmptyChatState';
import { ChatHeader } from './chat/ChatHeader';
import { FilterPanel } from './chat/FilterPanel';
import { AttachmentsBar } from './chat/AttachmentsBar';
import { QuickActionsToolbar } from './chat/QuickActionsToolbar';
import { ChatInput } from './chat/ChatInput';
import type { ChatAreaProps } from './chat/chat.types';

export type { ChatAreaProps };

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedContact,
  onBack,
  messages,
  onSendMessage,
  onSendAttachment,
  onRemoveAttachment,
  attachments,
  onDeleteMessage: _onDeleteMessage,
  onCopyMessage: _onCopyMessage,
  isTyping = false,
  contactStatus = 'offline',
  lastSeen,
  onSendCatalog,
  onRequestQuote,
  onSendServiceOrder,
  onSendOrder: _onSendOrder,
  onLoadMoreMessages,
  hasMoreMessages = false,
  isLoadingMore = false,
  filterDate = null,
  filterKeyword = '',
  onFilterDateChange,
  onFilterKeywordChange,
  onClearFilters,
  loading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength && !isLoadingMore) {
      scrollToBottom();
    }
    setPrevMessagesLength(messages.length);
  }, [messages.length, isLoadingMore]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !onLoadMoreMessages) return;

    const handleScroll = () => {
      if (isLoadingMore || !hasMoreMessages) return;
      const { scrollTop } = scrollArea;
      if (scrollTop < 50 && !isScrolling) {
        setIsScrolling(true);
        onLoadMoreMessages();
        setTimeout(() => setIsScrolling(false), 500);
      }
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [onLoadMoreMessages, hasMoreMessages, isLoadingMore, isScrolling]);

  const handleSend = () => {
    if (inputText.trim() || attachments.length > 0) {
      if (inputText.trim()) {
        onSendMessage(inputText);
      }
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const type = file.type.startsWith('image/')
        ? 'image'
        : file.type === 'application/pdf'
        ? 'pdf'
        : file.type.startsWith('video/')
        ? 'video'
        : 'image';
      const preview = type === 'image' ? URL.createObjectURL(file) : '';
      onSendAttachment({ file, type, preview });
    }
  };

  const handleApplyFilters = () => {
    onFilterKeywordChange?.(searchKeyword);
    onFilterDateChange?.(searchDate);
    setShowFilterPanel(false);
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSearchDate(null);
    onFilterKeywordChange?.('');
    onFilterDateChange?.(null);
    setShowFilterPanel(false);
  };

  if (!selectedContact) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50/30 via-white to-green-50/30 dark:from-green-950/10 dark:via-gray-950/30 dark:to-green-950/10">
      <ChatHeader
        selectedContact={selectedContact}
        contactStatus={contactStatus}
        lastSeen={lastSeen}
        onBack={onBack}
        filterDate={filterDate}
        filterKeyword={filterKeyword}
        showFilterPanel={showFilterPanel}
        onToggleFilter={() => setShowFilterPanel(!showFilterPanel)}
        onClearFilters={onClearFilters}
      />

      {showFilterPanel && (
        <FilterPanel
          searchKeyword={searchKeyword}
          searchDate={searchDate}
          onSearchKeywordChange={setSearchKeyword}
          onSearchDateChange={setSearchDate}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}

      {(filterDate || filterKeyword) && (
        <div className="px-4 py-2 border-b border-green-200/30 dark:border-green-800/20 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 text-xs">
            {filterDate && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">
                <Calendar className="h-3 w-3 mr-1" />
                {filterDate.toLocaleDateString('es-AR')}
              </Badge>
            )}
            {filterKeyword && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0">
                <SearchIcon className="h-3 w-3 mr-1" />
                {filterKeyword}
              </Badge>
            )}
            <span className="text-success/70 dark:text-green-400/70 ml-2">
              {messages.length} mensajes filtrados
            </span>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground py-12">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-green-400/50" />
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Sin mensajes</p>
                <p className="text-xs text-success/60 dark:text-green-400/60">Envía el primer mensaje para comenzar</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                showDate={index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)}
              />
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card  border border-green-200/40 dark:border-green-800/30 rounded-2xl rounded-bl-sm p-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-green-400/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-green-400/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-green-400/60 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {attachments.length > 0 && (
        <AttachmentsBar attachments={attachments} onRemove={onRemoveAttachment} />
      )}

      <QuickActionsToolbar
        onSendCatalog={onSendCatalog}
        onRequestQuote={onRequestQuote}
        onSendServiceOrder={onSendServiceOrder}
        onFileSelectClick={() => fileInputRef.current?.click()}
      />

      <ChatInput
        inputText={inputText}
        hasAttachments={attachments.length > 0}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        onInputChange={setInputText}
        onSend={handleSend}
        onKeyPress={handleKeyPress}
        onFileSelect={handleFileSelect}
        onFileButtonClick={() => fileInputRef.current?.click()}
      />
    </div>
  );
};