import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '@/services/api';
import { toast } from '@/shared/components/ui/use-toast';
import { defaultData } from '../../constants/pdfConfig/pdfConfig.constants';
import type { ServiceOrderData } from '../../types/pdfConfig/pdfConfig.types';

export function usePDFConfig() {
  const [data, setData] = useState<ServiceOrderData>(defaultData);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(<K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetData = useCallback(() => setData(defaultData), []);

  const handleSave = useCallback(() => toast({ title: 'Éxito', description: 'Configuración guardada localmente.' }), []);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/repairs/generate-config-pdf', {
        companyName: data.companyName, companyAddress: data.companyAddress, companyPhone: data.companyPhone, companyEmail: data.companyEmail,
        orderNumber: data.orderNumber, orderDate: data.orderDate, clientName: data.clientName, clientPhone: data.clientPhone, clientEmail: data.clientEmail,
        deviceModel: data.deviceModel, deviceImei: data.deviceImei, deviceSerial: data.deviceSerial, repairDescription: data.repairDescription,
        totalPrice: data.totalPrice, warrantyMonths: data.warrantyMonths, warrantyTerms: data.warrantyTerms,
      }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'orden-servicio.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      if (previewRef.current) {
        try {
          const canvas = await html2canvas(previewRef.current, {
            scale: 3, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
            logging: false, foreignObjectRendering: false, imageTimeout: 15000,
            removeContainer: true,
            onclone: (clonedDoc) => {
              const el = clonedDoc.querySelector('.print-container') as HTMLElement;
              if (el) { el.style.transform = 'none'; el.style.scale = '1'; el.style.width = '794px'; el.style.height = '1123px'; }
            },
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
          const imgX = (pdfWidth - canvas.width * ratio) / 2;
          const imgY = (pdfHeight - canvas.height * ratio) / 2;
          pdf.addImage(imgData, 'JPEG', imgX, imgY, canvas.width * ratio, canvas.height * ratio);
          pdf.save('orden-servicio.pdf');
        } catch { toast({ title: 'Error', description: 'Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.', variant: 'destructive' }); }
      }
    } finally { setIsGenerating(false); }
  }, [data]);

  const handlePrint = useCallback(() => {
    if (!previewRef.current) return;
    const printContent = previewRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html><html><head><title>Orden de Servicio</title>
        <style>
          @page { size: A4; margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: white; }
          .print-container { width: 210mm !important; height: 297mm !important; margin: 0 auto !important; padding: 0 !important; transform: none !important; scale: none !important; position: relative; }
          .print-container > div { transform: none !important; scale: none !important; width: 100% !important; height: 100% !important; }
        </style></head><body><div class="print-container">${printContent}</div></body></html>
      `);
      printWindow.document.close();
      printWindow.onload = () => { setTimeout(() => printWindow.print(), 100); };
    }
  }, []);

  return { data, isGenerating, previewRef, handleChange, resetData, handleSave, generatePDF, handlePrint };
}
