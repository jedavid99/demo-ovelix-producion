import { Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { GarantiaProgress } from '../components/GarantiaProgress';
import { useRepairPreview } from './hooks/useRepairPreview';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { OrderCodeCard } from './components/OrderCodeCard';
import { ClientInfoCard } from './components/ClientInfoCard';
import { DeviceInfoCard } from './components/DeviceInfoCard';
import { StatusDatesCards } from './components/StatusDatesCards';
import { ProblemDiagnosisCard } from './components/ProblemDiagnosisCard';
import { RepuestosCard } from './components/RepuestosCard';
import { CostCard } from './components/CostCard';
import { PhotoCard, NotesCard } from './components/PhotoNotesCards';
import type { RepairPreviewModalProps } from './types';

export default function RepairPreviewModal({ isOpen, onClose, repairId }: RepairPreviewModalProps) {
  const {
    loading, repairData, getStatusBadge, getPriorityBadge,
    calculateRepuestosTotal, formatDate, formatCurrency,
  } = useRepairPreview(repairId, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-semibold">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Detalle de Reparación
            </span>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-12"><LoadingState /></div>
        ) : repairData && (
          <div className="divide-y divide-border/60">
            {/* Order code — receipt-style header */}
            <OrderCodeCard code={repairData.numero_reparacion} id={repairData.id} />

            {/* Client + Device — compact two-column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              <ClientInfoCard cliente={repairData.cliente} />
              <DeviceInfoCard
                dispositivo={repairData.dispositivo}
                marca={repairData.marca}
                modelo={repairData.modelo}
              />
            </div>

            {/* Status + Priority + Dates */}
            <StatusDatesCards
              estado={repairData.estado}
              prioridad={repairData.prioridad}
              fecha_ingreso={repairData.fecha_ingreso}
              fecha_estimada_entrega={repairData.fecha_estimada_entrega}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              formatDate={formatDate}
            />

            {/* Problem / Diagnosis / Repair */}
            <ProblemDiagnosisCard
              problema_reportado={repairData.problema_reportado}
              diagnosis={repairData.diagnosis}
              reparacion_realizada={repairData.reparacion_realizada}
            />

            {/* Parts + Cost */}
            {(repairData.repuestos?.length || repairData.total_reparacion) && (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                {repairData.repuestos?.length ? (
                  <RepuestosCard
                    repuestos={repairData.repuestos}
                    formatCurrency={formatCurrency}
                    calculateTotal={calculateRepuestosTotal}
                  />
                ) : <div className="hidden sm:block" />}
                {repairData.total_reparacion ? (
                  <CostCard
                    total_reparacion={repairData.total_reparacion}
                    repuestosTotal={calculateRepuestosTotal()}
                    hasRepuestos={!!(repairData.repuestos?.length)}
                    formatCurrency={formatCurrency}
                  />
                ) : null}
              </div>
            )}

            {/* Photo evidence */}
            {repairData.fotos_antes?.length ? (
              <PhotoCard photos={repairData.fotos_antes} />
            ) : null}

            {/* Notes */}
            {repairData.notas ? (
              <NotesCard notas={repairData.notas} />
            ) : null}

            {/* Warranty */}
            <div className="px-6 py-4">
              <GarantiaProgress
                tiene_garantia={repairData.tiene_garantia || false}
                fecha_inicio_garantia={repairData.fecha_inicio_garantia}
                fecha_fin_garantia={repairData.fecha_fin_garantia}
                garantia_duracion={repairData.garantia_duracion}
                garantia_unidad={repairData.garantia_unidad}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
