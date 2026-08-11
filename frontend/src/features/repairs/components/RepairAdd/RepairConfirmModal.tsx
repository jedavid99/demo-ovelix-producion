import React from 'react';
import { CheckCircle2, DollarSign, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface RepairConfirmModalProps {
  isOpen: boolean;
  selectedClient: { id: string; name: string; phone: string; email?: string } | null;
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  issueDescription: string;
  repairPrice: string;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPriceChange: (price: string) => void;
}

export const RepairConfirmModal: React.FC<RepairConfirmModalProps> = ({
  isOpen,
  selectedClient,
  deviceType,
  brand,
  model,
  serial,
  issueDescription,
  repairPrice,
  submitting,
  onBack,
  onConfirm,
  onPriceChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onBack(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-primary" />
            Confirmar Orden de Servicio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Datos del cliente */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">Datos del Cliente</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Nombre:</span> {selectedClient?.name}</p>
              <p><span className="text-muted-foreground">Teléfono:</span> {selectedClient?.phone}</p>
              <p><span className="text-muted-foreground">Email:</span> {selectedClient?.email || '—'}</p>
            </div>
          </div>

          {/* Datos del dispositivo */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm mb-3">Datos del Dispositivo</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Dispositivo:</span> {deviceType}</p>
              <p><span className="text-muted-foreground">Marca:</span> {brand || '—'}</p>
              <p><span className="text-muted-foreground">Modelo:</span> {model || '—'}</p>
              <p><span className="text-muted-foreground">Serial:</span> {serial || '—'}</p>
              <p><span className="text-muted-foreground">Problema:</span> {issueDescription}</p>
            </div>
          </div>

          {/* Información */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Estado</p>
                <p className="text-lg font-bold text-primary">Pendiente de confirmación</p>
              </div>
              <Badge variant="default" className="text-xs">Pendiente</Badge>
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio de Reparación *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="number"
                value={repairPrice}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onBack}
            disabled={submitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Button
            onClick={onConfirm}
            disabled={submitting}
            className="min-w-[150px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmar Orden
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
