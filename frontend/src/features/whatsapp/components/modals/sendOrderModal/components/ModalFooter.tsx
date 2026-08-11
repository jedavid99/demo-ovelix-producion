import { FileText } from 'lucide-react';
import { DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface ModalFooterProps {
  hasSelection: boolean;
  onCancel: () => void;
  onSend: () => void;
}

export function ModalFooter({ hasSelection, onCancel, onSend }: ModalFooterProps) {
  return (
    <DialogFooter className="p-6 pt-3 border-t border-border/70  bg-muted/50 dark:bg-card/50">
      <div className="flex items-center justify-between w-full gap-3">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          Cancelar
        </Button>
        <Button onClick={onSend} disabled={!hasSelection} className="gap-2 min-w-[140px]">
          <FileText className="h-4 w-4" />
          Enviar Orden
        </Button>
      </div>
    </DialogFooter>
  );
}
