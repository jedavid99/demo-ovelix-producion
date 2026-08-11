import { repairApi } from '../../services/repairApi';
import { toast } from '@/shared/components/ui/use-toast';
import { generateServiceOrderPDF } from './serviceOrderPDF';
import { generateThermalLabelPDF } from './thermalLabelPDF';

export function useRepairPDF(closeDropdown: () => void) {
  const navigateToPDF = async (repairId: string) => {
    closeDropdown();

    try {
      const orderData = await repairApi.getRepairById(repairId);

      if (!orderData) {
        toast({ title: 'Error', description: 'No se pudieron obtener los datos de la reparaci\u00F3n', variant: 'destructive' });
        return;
      }

      const pdf = await generateServiceOrderPDF(orderData);

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      toast({ title: 'PDF Generado', description: 'El PDF se ha generado correctamente' });
    } catch (error: any) {
      console.error('Error al generar el PDF:', error);
      toast({ title: 'Error', description: 'No se pudo generar el PDF', variant: 'destructive' });
    }
  };

  const navigateToThermalPrint = async (repairId: string) => {
    closeDropdown();

    try {
      const orderData = await repairApi.getRepairById(repairId);

      if (!orderData) {
        toast({ title: 'Error', description: 'No se pudieron obtener los datos de la reparaci\u00F3n', variant: 'destructive' });
        return;
      }

      const pdf = await generateThermalLabelPDF(orderData);

      window.open(pdf.output('bloburl'), '_blank');
      toast({ title: 'Etiqueta generada', description: 'Lista para imprimir (compatible con impresoras t\u00E9rmicas)' });
    } catch (error: any) {
      console.error('Error al generar etiqueta:', error);
      toast({ title: 'Error', description: 'No se pudo generar la etiqueta t\u00E9rmica', variant: 'destructive' });
    }
  };

  return { navigateToPDF, navigateToThermalPrint };
}
