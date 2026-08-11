import { X, FileText } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { AttachmentFile } from '../../whatsapp.types';

interface AttachmentsBarProps {
  attachments: AttachmentFile[];
  onRemove: (index: number) => void;
}

export const AttachmentsBar = ({ attachments, onRemove }: AttachmentsBarProps) => (
  <div className="p-3 border-t border-green-200/40 dark:border-green-800/30 bg-card/80 dark:bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-card/60 dark:supports-[backdrop-filter]:bg-background/60 flex gap-2 overflow-x-auto">
    {attachments.map((attachment, index) => (
      <div key={index} className="relative flex-shrink-0 group">
        {attachment.type === 'image' ? (
          <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-green-200/50 dark:border-green-800/30 shadow-sm">
            <img src={attachment.preview} alt="Preview" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-16 w-16 bg-green-50/50 dark:bg-green-900/20 rounded-lg flex items-center justify-center border border-green-200/40 dark:border-green-800/30 shadow-sm">
            <FileText className="h-6 w-6 text-success/60" />
          </div>
        )}
        <Button
          size="icon"
          variant="destructive"
          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full shadow-md hover:scale-110 transition-transform bg-destructive/100 hover:bg-destructive"
          onClick={() => onRemove(index)}
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      </div>
    ))}
  </div>
);
