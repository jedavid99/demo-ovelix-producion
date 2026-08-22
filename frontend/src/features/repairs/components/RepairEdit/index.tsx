import React from 'react';
import { useParams } from 'react-router-dom';
import { Save, Loader2, ClipboardList, Package, DollarSign, Settings, Shield, History } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';
import { useRepairEdit } from './useRepairEdit';
import { EditHeader } from './EditHeader';
import { EditStatusForm } from './EditStatusForm';
import { EditPartsForm } from './EditPartsForm';
import { EditCostsForm } from './EditCostsForm';
import { EditAssignmentForm } from './EditAssignmentForm';
import { EditNotesForm } from './EditNotesForm';
import { EditPaymentForm } from './EditPaymentForm';
import { EditSecurityForm } from './EditSecurityForm';
import { EditHardwareForm } from './EditHardwareForm';
import { GarantiaProgress } from '../GarantiaProgress';
import { RepairTimeline } from '../RepairTimeline';

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );
}

export default function RepairEdit() {
  const { id } = useParams<{ id: string }>();

  const {
    loading,
    saving,
    repairData,
    formData,
    setFormData,
    repuestos,
    nuevoRepuesto,
    setNuevoRepuesto,
    agregarRepuesto,
    eliminarRepuesto,
    handleSave,
  } = useRepairEdit(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <main className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pb-28">
        <EditHeader repairData={repairData} formData={formData} setFormData={setFormData} />

        <Accordion
          type="multiple"
          defaultValue={['diagnostico', 'repuestos-costos', 'pago', 'historial']}
          className="space-y-4"
        >
          <AccordionItem value="diagnostico" className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Diagnóstico</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-4">
              <EditStatusForm formData={formData} setFormData={setFormData} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="repuestos-costos" className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Repuestos y Costos</span>
                {repuestos.length > 0 && (
                  <span className="ml-auto mr-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                    {repuestos.length}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-4 space-y-6">
              <EditPartsForm
                repuestos={repuestos}
                nuevoRepuesto={nuevoRepuesto}
                setNuevoRepuesto={setNuevoRepuesto}
                agregarRepuesto={agregarRepuesto}
                eliminarRepuesto={eliminarRepuesto}
              />
              <div className="border-t pt-6">
                <EditCostsForm formData={formData} setFormData={setFormData} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pago" className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
              <div className="flex items-center gap-2.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Pago</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-4">
              <EditPaymentForm formData={formData} setFormData={setFormData} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="avanzado" className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
              <div className="flex items-center gap-2.5">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Configuración Avanzada</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-4 space-y-6">
              <EditAssignmentForm formData={formData} setFormData={setFormData} />
              <div className="border-t pt-6">
                <EditNotesForm formData={formData} setFormData={setFormData} />
              </div>
              <div className="border-t pt-6">
                <EditSecurityForm formData={formData} setFormData={setFormData} />
              </div>
              <div className="border-t pt-6">
                <EditHardwareForm formData={formData} setFormData={setFormData} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {repairData && (
            <AccordionItem value="garantia" className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Garantía</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-4">
                <GarantiaProgress
                  tiene_garantia={repairData.tiene_garantia || false}
                  fecha_inicio_garantia={repairData.fecha_inicio_garantia}
                  fecha_fin_garantia={repairData.fecha_fin_garantia}
                  garantia_duracion={repairData.garantia_duracion}
                  garantia_unidad={repairData.garantia_unidad}
                />
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="historial" className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="px-5 py-4 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b data-[state=open]:border-border">
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-sm">Historial</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-4">
              <RepairTimeline repairId={id || ''} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">
              {repairData?.dispositivo || 'Reparación'}
            </span>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="w-full sm:w-auto px-8 shadow-xl hover:shadow-2xl transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
