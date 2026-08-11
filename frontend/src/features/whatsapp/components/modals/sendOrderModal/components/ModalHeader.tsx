import { FileText } from 'lucide-react';
import { DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export function ModalHeader() {
  return (
    <DialogHeader className="p-6 pb-3 border-b border-border/70  bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
      <DialogTitle className="flex items-center gap-3 text-lg">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="font-semibold">Enviar Orden de Servicio</span>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Selecciona la orden que deseas enviar por WhatsApp
          </p>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
