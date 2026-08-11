import { Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { GarantiaProgress } from '../components/GarantiaProgress';
import { useRepairPreview } from './hooks/useRepairPreview';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { OrderCodeCard } from './components/OrderCodeCard';
import { ClientInfoCard } from './components/ClientInfoCard';
import { DeviceInfoCard } from './components/DeviceInfoCard';
import { StatusCard, DatesCard } from './components/StatusDatesCards';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa de Reparación
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingState />
        ) : (
          repairData && (
          <div className="space-y-4">
            <OrderCodeCard code={repairData.numero_reparacion!} id={repairData.id} />
            <ClientInfoCard cliente={repairData.cliente} />
            <DeviceInfoCard dispositivo={repairData.dispositivo} marca={repairData.marca} modelo={repairData.modelo} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatusCard title="Estado" badgeVariant={getStatusBadge(repairData.estado).variant} badgeLabel={getStatusBadge(repairData.estado).label} />
              <StatusCard title="Prioridad" badgeVariant={getPriorityBadge(repairData.prioridad).variant} badgeLabel={getPriorityBadge(repairData.prioridad).label} />
            </div>

            <DatesCard fecha_ingreso={repairData.fecha_ingreso} fecha_estimada_entrega={repairData.fecha_estimada_entrega} formatDate={formatDate} />

            <GarantiaProgress
              tiene_garantia={repairData.tiene_garantia || false}
              fecha_inicio_garantia={repairData.fecha_inicio_garantia}
              fecha_fin_garantia={repairData.fecha_fin_garantia}
              garantia_duracion={repairData.garantia_duracion}
              garantia_unidad={repairData.garantia_unidad}
            />

            <ProblemDiagnosisCard
              problema_reportado={repairData.problema_reportado}
              diagnosis={repairData.diagnosis}
              reparacion_realizada={repairData.reparacion_realizada}
            />

            {repairData.repuestos && repairData.repuestos.length > 0 && (
              <RepuestosCard
                repuestos={repairData.repuestos}
                formatCurrency={formatCurrency}
                calculateTotal={calculateRepuestosTotal}
              />
            )}

            {repairData.total_reparacion && (
              <CostCard
                total_reparacion={repairData.total_reparacion}
                repuestosTotal={calculateRepuestosTotal()}
                hasRepuestos={!!(repairData.repuestos?.length)}
                formatCurrency={formatCurrency}
              />
            )}

            {repairData.foto_evidencia && <PhotoCard src={repairData.foto_evidencia} />}
            {repairData.notas && <NotesCard notas={repairData.notas} />}

            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </div>
          </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
