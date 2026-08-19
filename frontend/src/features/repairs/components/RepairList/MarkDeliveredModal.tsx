import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface MarkDeliveredModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const MarkDeliveredModal: React.FC<MarkDeliveredModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isProcessing,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isProcessing) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar como Entregado</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres marcar esta reparación como entregada?
            Esta acción cambiará el estado a "Entregado" y no se podrá deshacer.
            Si el equipo no tiene garantía, se le activará la garantía configurada para la empresa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar Entrega'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
