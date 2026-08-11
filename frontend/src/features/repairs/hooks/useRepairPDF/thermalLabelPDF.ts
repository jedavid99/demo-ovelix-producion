import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { loadBusinessName } from './pdfConfig';

export async function generateThermalLabelPDF(orderData: any): Promise<jsPDF> {
  const businessName = loadBusinessName();

  const formatDate = (dateString: string) => {
    if (!dateString) return '--/--/----';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const deviceInfo = {
    orden: orderData.numero_reparacion || orderData.id,
    dispositivo: `${orderData.marca || ''} ${orderData.modelo || ''}`.trim() || orderData.dispositivo,
    serial: orderData.serial_number,
    cliente: orderData.cliente_nombre || orderData.cliente?.nombre_completo || orderData.cliente?.nombre,
    telefono: orderData.cliente_telefono || orderData.cliente?.telefono,
    total: orderData.total_reparacion,
  };
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(deviceInfo), { width: 200, margin: 1, errorCorrectionLevel: 'L' });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 80] });
  const orderNumber = orderData.numero_reparacion || orderData.id;
  pdf.setProperties({ title: `Etiqueta T\u00E9rmica #${orderNumber}`, subject: `Etiqueta T\u00E9rmica #${orderNumber}`, creator: businessName || 'TechFix' });

  const pageWidth = 80;
  const margin = 4;
  const maxX = pageWidth - margin;
  let y = margin + 1;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(businessName, pageWidth / 2, y, { align: 'center' });
  y += 5;

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('[ESTADO: EN REPARACION]', pageWidth / 2, y, { align: 'center' });
  y += 5;

  const orderText = `* ORDEN: ${orderNumber} *`;
  const orderWidth = pdf.getTextWidth(orderText) + 6;
  const orderX = (pageWidth - orderWidth) / 2;
  pdf.setFillColor(0, 0, 0);
  pdf.rect(orderX - 2, y - 1.5, orderWidth + 4, 6, 'F' as any);
  pdf.setTextColor(255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text(orderText, pageWidth / 2, y + 3, { align: 'center' });
  pdf.setTextColor(0);
  y += 8;

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CLIENTE', margin, y);
  pdf.text('FECHA', maxX, y, { align: 'right' });
  y += 3.5;
  pdf.setFont('helvetica', 'normal');
  const clientName = orderData.cliente_nombre || orderData.cliente?.nombre_completo || orderData.cliente?.nombre || '---';
  const shortName = clientName.length > 18 ? clientName.substring(0, 16) + '..' : clientName;
  pdf.text(shortName, margin, y);
  pdf.text(formatDate(orderData.fecha_ingreso), maxX, y, { align: 'right' });
  y += 6;

  pdf.setDrawColor(0);
  pdf.setLineWidth(0.2);
  pdf.line(margin, y, maxX, y);
  y += 4;

  const qrSize = 30;
  const qrX = (pageWidth - qrSize) / 2;
  pdf.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
  y += qrSize + 3;

  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80);
  pdf.text('Escanee QR para ver todos los datos', pageWidth / 2, y, { align: 'center' });
  pdf.setTextColor(0);

  pdf.autoPrint();
  return pdf;
}
