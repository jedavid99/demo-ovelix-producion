import { Send, Paperclip } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface ChatInputProps {
  inputText: string;
  hasAttachments: boolean;
  inputRef: React.Ref<HTMLInputElement>;
  fileInputRef: React.Ref<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileButtonClick: () => void;
}

export const ChatInput = ({
  inputText,
  hasAttachments,
  inputRef,
  fileInputRef,
  onInputChange,
  onSend,
  onKeyPress,
  onFileSelect,
  onFileButtonClick,
}: ChatInputProps) => (
  <div className="p-3 border-t border-green-200/40 dark:border-green-800/30 bg-card/80 dark:bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 dark:supports-[backdrop-filter]:bg-background/60 flex items-center gap-2">
    <input type="file" ref={fileInputRef} onChange={onFileSelect} className="hidden" accept="image/*,.pdf,video/*" multiple={false} />
    <Button size="icon" variant="ghost" onClick={onFileButtonClick} aria-label="Adjuntar archivo"
      className="h-9 w-9 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-success dark:text-green-400 transition-colors">
      <Paperclip className="h-4 w-4" />
    </Button>
    <Input
      ref={inputRef}
      placeholder="Escribe un mensaje..."
      value={inputText}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyPress={onKeyPress}
      className="flex-1 h-9 bg-card/80 dark:bg-card/80 border-green-200/50 dark:border-green-800/30 focus-visible:ring-2 focus-visible:ring-green-400/40 focus-visible:border-green-400/40 placeholder:text-green-400/60 dark:placeholder:text-green-400/40 transition-all"
    />
    <Button
      size="icon"
      onClick={onSend}
      aria-label="Enviar mensaje"
      className={cn(
        "h-9 w-9 rounded-full transition-all",
        (inputText.trim() || hasAttachments)
          ? "bg-success hover:bg-success shadow-md hover:shadow-lg"
          : "bg-green-200/50 dark:bg-green-800/30 text-green-400/60 dark:text-green-400/40 cursor-not-allowed"
      )}
      disabled={!inputText.trim() && !hasAttachments}
    >
      <Send className="h-4 w-4" />
    </Button>
  </div>
);
