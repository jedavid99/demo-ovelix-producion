import { MdBlock } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CancelDialog({ open, onOpenChange, onConfirm }: CancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar orden</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas cancelar esta orden de compra? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            No, mantener orden
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <MdBlock className="mr-2" />
            Sí, cancelar orden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
