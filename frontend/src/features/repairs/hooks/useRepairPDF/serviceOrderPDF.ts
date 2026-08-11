import jsPDF from 'jspdf';
import { loadBusinessInfo } from './pdfConfig';
import { defaultColors, setStyle, label, value, wrappedText, measureLines, card } from './pdfHelpers';
import type { PdfColors } from './pdfHelpers';

export async function generateServiceOrderPDF(orderData: any): Promise<jsPDF> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const colors: PdfColors = defaultColors;

  const total = typeof orderData.total_reparacion === 'number'
    ? orderData.total_reparacion.toFixed(2)
    : (orderData.total_reparacion || '0.00');

  const businessInfo = loadBusinessInfo();
  const orderNumber = orderData.numero_reparacion || orderData.id;

  pdf.setProperties({
    title: `Orden de Servicio #${orderNumber}`,
    subject: `Orden de Servicio #${orderNumber}`,
    creator: businessInfo.name || 'TechFix Reparaciones',
  });

  const defaultWarrantyTerms = [
    'Cubre exclusivamente defectos de fabricaci\u00F3n o de la mano de obra en el repuesto/servicio realizado.',
    'No cubre da\u00F1os por humedad, golpes, ca\u00EDdas, mal uso o intervenci\u00F3n de terceros no autorizados.',
    'Queda anulada si se rompe el sello de garant\u00EDa o el equipo presenta manipulaci\u00F3n externa.',
    'V\u00E1lida \u00FAnicamente presentando este comprobante o el n\u00FAmero de orden indicado arriba.',
  ];
  const warrantyMonthsText = orderData.warranty_months
    ? `Vigencia: ${orderData.warranty_months} meses desde la fecha de entrega del equipo.`
    : null;

  let y = margin;

  // HEADER
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(margin, y, 22, 16, 3, 3, 'F');
  setStyle(pdf, 13, 'bold', [255, 255, 255]);
  pdf.text('T', margin + 11, y + 11, { align: 'center' });
  value(pdf, businessInfo.name || 'TechFix Reparaciones', margin + 27, y + 7, { size: 15, bold: true }, colors);
  label(pdf, 'CENTRO DE SERVICIO T\u00C9CNICO AUTORIZADO', margin + 27, y + 13, 'left', colors);
  label(pdf, 'ORDEN DE SERVICIO', pageWidth - margin, y + 4, 'right', colors);
  value(pdf, `#${orderData.numero_reparacion || orderData.id}`, pageWidth - margin, y + 12, { size: 17, bold: true, color: colors.primary, align: 'right' }, colors);
  label(pdf, `Fecha: ${orderData.fecha_ingreso}`, pageWidth - margin, y + 17, 'right', colors);
  y += 21;
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 5;

  // CLIENTE + DISPOSITIVO
  const infoBoxH = 20;
  card(pdf, margin, y, contentWidth, infoBoxH);
  const quarter = contentWidth / 4;
  label(pdf, 'CLIENTE', margin + 4, y + 6, 'left', colors);
  const clientName = orderData.cliente_nombre || orderData.cliente?.nombre_completo || orderData.cliente?.nombre || '\u2014';
  value(pdf, clientName, margin + 4, y + 12, { size: 10, bold: true }, colors);
  value(pdf, orderData.cliente_telefono || orderData.cliente?.telefono || '\u2014', margin + 4, y + 17, { size: 8, color: colors.gray }, colors);
  label(pdf, 'DISPOSITIVO', margin + quarter + 4, y + 6, 'left', colors);
  value(pdf, `${orderData.marca || ''} ${orderData.modelo || ''}`.trim() || orderData.dispositivo || '\u2014', margin + quarter + 4, y + 12, { size: 10, bold: true }, colors);
  value(pdf, `N/S: ${orderData.serial_number || '\u2014'}`, margin + quarter + 4, y + 17, { size: 8, color: colors.gray }, colors);
  label(pdf, 'IMEI', margin + quarter * 2 + 4, y + 6, 'left', colors);
  value(pdf, orderData.imei || '\u2014', margin + quarter * 2 + 4, y + 12, { size: 9 }, colors);
  label(pdf, 'EMAIL', margin + quarter * 3 + 4, y + 6, 'left', colors);
  value(pdf, orderData.cliente_email || '\u2014', margin + quarter * 3 + 4, y + 12, { size: 8 }, colors);
  y += infoBoxH + 5;

  // PROBLEMA REPORTADO
  const problemText = orderData.problema_reportado || '\u2014';
  const problemLines = measureLines(pdf, problemText, contentWidth - 8);
  const problemBoxH = Math.max(14, problemLines * 4 + 10);
  card(pdf, margin, y, contentWidth, problemBoxH);
  label(pdf, 'DESCRIPCI\u00D3N DEL PROBLEMA', margin + 4, y + 6, 'left', colors);
  wrappedText(pdf, problemText, margin + 4, y + 11, contentWidth - 8, 8.5, 4);
  y += problemBoxH + 5;

  // DIAGNÓSTICO
  if (orderData.diagnosis) {
    const diagnosisLines = measureLines(pdf, orderData.diagnosis, contentWidth - 8);
    const diagnosisBoxH = Math.max(14, diagnosisLines * 4 + 10);
    card(pdf, margin, y, contentWidth, diagnosisBoxH);
    label(pdf, 'DIAGN\u00D3STICO', margin + 4, y + 6, 'left', colors);
    wrappedText(pdf, orderData.diagnosis, margin + 4, y + 11, contentWidth - 8, 8.5, 4);
    y += diagnosisBoxH + 5;
  }

  // ESTADO
  const statusBoxH = 12;
  card(pdf, margin, y, contentWidth, statusBoxH);
  label(pdf, 'ESTADO', margin + 4, y + 6, 'left', colors);
  const statusText = orderData.estado || 'Pendiente';
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente', 'diagnosis': 'En Diagn\u00F3stico', 'in_progress': 'En Progreso',
    'waiting_parts': 'Esperando Repuestos', 'ready': 'Listo', 'delivered': 'Entregado',
    'cancelled': 'Cancelado', 'irreparable': 'Irreparable',
  };
  value(pdf, statusMap[statusText.toLowerCase()] || statusText, margin + 4, y + 10, { size: 9, bold: true, color: colors.primary }, colors);
  y += statusBoxH + 5;

  // GARANTÍA Y CONDICIONES
  const warrantyBullets = orderData.warranty_terms
    ? [orderData.warranty_terms, ...defaultWarrantyTerms.slice(1)]
    : defaultWarrantyTerms;
  const bulletMaxWidth = contentWidth - 12;
  const bulletLineHeight = 3.6;
  let warrantyContentH = warrantyMonthsText ? bulletLineHeight + 1 : 0;
  warrantyBullets.forEach((t: string) => {
    warrantyContentH += measureLines(pdf, `\u2022  ${t}`, bulletMaxWidth) * bulletLineHeight + 0.8;
  });
  const warrantyBoxH = warrantyContentH + 12;
  card(pdf, margin, y, contentWidth, warrantyBoxH);
  label(pdf, 'GARANT\u00CDA Y CONDICIONES', margin + 4, y + 6, 'left', colors);
  let warrantyY = y + 11;
  if (warrantyMonthsText) {
    value(pdf, warrantyMonthsText, margin + 4, warrantyY, { size: 8, bold: true, color: colors.primary }, colors);
    warrantyY += bulletLineHeight + 1;
  }
  warrantyBullets.forEach((t: string) => {
    const h = wrappedText(pdf, `\u2022  ${t}`, margin + 4, warrantyY, bulletMaxWidth, 7.5, bulletLineHeight);
    warrantyY += h + 0.8;
  });
  y += warrantyBoxH + 5;

  // TOTAL + AUTORIZACIÓN
  const totalBoxH = 20;
  label(pdf, 'AUTORIZACI\u00D3N DEL CLIENTE', margin, y + 4, 'left', colors);
  pdf.setDrawColor(148, 163, 184);
  pdf.line(margin, y + 16, margin + contentWidth / 2 - 6, y + 16);
  value(pdf, `${orderData.cliente_nombre || '\u2014'} \u2014 Firma`, margin, y + 19.5, { size: 7.5, color: colors.gray }, colors);
  label(pdf, 'TOTAL ESTIMADO', pageWidth - margin, y + 4, 'right', colors);
  value(pdf, `$${total}`, pageWidth - margin, y + 15, { size: 19, bold: true, color: colors.primary, align: 'right' }, colors);
  value(pdf, 'Excl. impuestos aplicables', pageWidth - margin, y + 19.5, { size: 7, color: colors.mutedLabel, align: 'right' }, colors);
  y += totalBoxH + 3;

  // Línea de perforación
  pdf.setDrawColor(115, 118, 134);
  pdf.line(margin, y, pageWidth - margin, y);
  value(pdf, '\u2702 Cortar aqu\u00ED para copia t\u00E9cnica', pageWidth / 2, y + 3, { size: 7, color: [115, 118, 134], align: 'center' }, colors);
  y += 8;

  // SECCIÓN TÉCNICA
  label(pdf, 'COPIA DE RUTA T\u00C9CNICA', margin, y, 'left', colors);
  value(pdf, `#${orderData.numero_reparacion || orderData.id}`, margin, y + 5, { size: 9, bold: true }, colors);
  label(pdf, 'PRIORIDAD', pageWidth - margin - 20, y, 'left', colors);
  pdf.setFillColor(219, 234, 254);
  pdf.roundedRect(pageWidth - margin - 20, y + 1.5, 20, 5.5, 2, 2, 'F');
  value(pdf, 'EST\u00C1NDAR', pageWidth - margin - 10, y + 5.3, { size: 7, color: [30, 64, 175], align: 'center' }, colors);
  y += 10;

  const checklistW = 48;
  const checklistH = 24;
  card(pdf, margin, y, checklistW, checklistH);
  label(pdf, 'VERIFICACI\u00D3N', margin + 4, y + 5, 'left', colors);
  const checklistItems = ['Fuente de Alimentaci\u00F3n', 'Salud de la Bater\u00EDa', 'Placa Madre', 'Refrigeraci\u00F3n'];
  checklistItems.forEach((item, i) => {
    const rowY = y + 10 + i * 4.4;
    pdf.setDrawColor(148, 163, 184);
    pdf.rect(margin + 4, rowY - 2.6, 3, 3);
    value(pdf, item, margin + 9, rowY, { size: 6.8, color: colors.gray }, colors);
  });

  const timeY = y + checklistH + 3;
  const timeH = 15;
  card(pdf, margin, timeY, checklistW, timeH);
  label(pdf, 'TIEMPO', margin + 4, timeY + 5, 'left', colors);
  value(pdf, 'Inicio:', margin + 4, timeY + 11, { size: 7.5, color: colors.gray }, colors);
  pdf.setDrawColor(...colors.border);
  pdf.rect(margin + 17, timeY + 8, 18, 4.5);

  // SEGURIDAD
  const securityY = timeY + timeH + 3;
  const securityH = 25;
  card(pdf, margin, securityY, checklistW, securityH);
  label(pdf, 'SEGURIDAD', margin + 4, securityY + 5, 'left', colors);
  const securityType = orderData.security_type || orderData.tipo_seguridad || 'none';
  const securityPin = orderData.security_pin || orderData.pin || '';
  const securityPattern = orderData.security_pattern || orderData.patron || '';
  if (securityType === 'pin' && securityPin) {
    value(pdf, 'Tipo: PIN/Clave', margin + 4, securityY + 10, { size: 7, color: colors.gray }, colors);
    value(pdf, `Clave: ${securityPin}`, margin + 4, securityY + 15, { size: 8, bold: true, color: colors.primary }, colors);
  } else if (securityType === 'pattern' && securityPattern) {
    value(pdf, 'Tipo: Patr\u00F3n', margin + 4, securityY + 10, { size: 7, color: colors.gray }, colors);
    value(pdf, `Patr\u00F3n: ${securityPattern}`, margin + 4, securityY + 15, { size: 8, bold: true, color: colors.primary }, colors);
  } else if (securityType === 'fingerprint') {
    value(pdf, 'Tipo: Huella Digital', margin + 4, securityY + 10, { size: 7, color: colors.gray }, colors);
    value(pdf, 'Configurada', margin + 4, securityY + 15, { size: 8, bold: true, color: colors.primary }, colors);
  } else {
    value(pdf, 'Sin seguridad', margin + 4, securityY + 10, { size: 7, color: colors.gray }, colors);
  }

  // Tabla de repuestos
  const tableX = margin + checklistW + 5;
  const tableW = contentWidth - checklistW - 5;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(tableX, y, tableW, 7, 'F');
  label(pdf, 'N\u00B0 DE PARTE / DESCRIPCI\u00D3N', tableX + 3, y + 4.8, 'left', colors);
  label(pdf, 'CANT.', tableX + tableW - 26, y + 4.8, 'left', colors);
  label(pdf, 'UBICACI\u00D3N', tableX + tableW - 13, y + 4.8, 'left', colors);
  pdf.setDrawColor(...colors.border);
  pdf.line(tableX, y + 7, tableX + tableW, y + 7);
  const parts = orderData.repuestos || [];
  const rowH = 5.5;
  const rowCount = Math.min(Math.max(parts.length, 3), 4);
  for (let i = 0; i < rowCount; i++) {
    const part = parts[i];
    const rowY = y + 11.5 + i * rowH;
    value(pdf, part?.nombre || '', tableX + 3, rowY, { size: 7.5 }, colors);
    value(pdf, part?.cantidad?.toString() || '', tableX + tableW - 26, rowY, { size: 7.5, color: colors.gray }, colors);
    value(pdf, part?.ubicacion || '', tableX + tableW - 13, rowY, { size: 7.5, color: colors.gray }, colors);
    pdf.setDrawColor(...colors.border);
    pdf.line(tableX, rowY + 2, tableX + tableW, rowY + 2);
  }

  const notesY = y + 11.5 + rowCount * rowH + 2;
  const notesAreaH = checklistH + timeH + securityH + 3 - (11.5 + rowCount * rowH + 2);
  card(pdf, tableX, notesY, tableW, Math.max(notesAreaH, 12));
  label(pdf, 'NOTAS DEL T\u00C9CNICO', tableX + 3, notesY + 5, 'left', colors);
  const notesText = orderData.notas || '[Registrar aqu\u00ED los resultados del diagn\u00F3stico...]';
  wrappedText(pdf, notesText, tableX + 3, notesY + 10, tableW - 6, 7.5, 3.6);

  // Firma
  let footerY = securityY + securityH + 6;
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, footerY, pageWidth - margin, footerY);
  footerY += 6;
  label(pdf, 'FIRMA DEL T\u00C9CNICO', margin, footerY, 'left', colors);
  pdf.setDrawColor(148, 163, 184);
  pdf.line(margin, footerY + 10, margin + contentWidth / 3, footerY + 10);
  value(pdf, `ID T\u00E9cnico: ${orderData.tecnico_nombre || '_________'}`, margin, footerY + 14, { size: 7, color: colors.gray }, colors);
  label(pdf, 'CONTROL DE CALIDAD', pageWidth - margin, footerY, 'right', colors);
  pdf.setDrawColor(148, 163, 184);
  pdf.rect(pageWidth - margin - 16, footerY + 3, 5, 5);
  pdf.rect(pageWidth - margin - 9, footerY + 3, 5, 5);
  value(pdf, 'P', pageWidth - margin - 13.5, footerY + 7, { size: 7, align: 'center' }, colors);
  value(pdf, 'F', pageWidth - margin - 6.5, footerY + 7, { size: 7, align: 'center' }, colors);
  footerY += 20;
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, footerY, pageWidth - margin, footerY);
  value(pdf, businessInfo.name, margin, footerY + 5, { size: 7, bold: true, color: colors.mutedLabel }, colors);
  value(pdf, `${businessInfo.address} | Tel: ${businessInfo.phone} | Email: ${businessInfo.email}`, margin, footerY + 10, { size: 6.5, color: colors.mutedLabel }, colors);
  value(pdf, `CUIT: ${businessInfo.cuit}`, margin, footerY + 14, { size: 6.5, color: colors.mutedLabel }, colors);
  value(pdf, 'Formulario SO-TECH-2024-V2', pageWidth - margin, footerY + 5, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);
  value(pdf, 'Documento Interno Confidencial', pageWidth - margin, footerY + 10, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);
  value(pdf, 'P\u00E1gina 1 de 1', pageWidth - margin, footerY + 14, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);

  if (footerY + 5 > pageHeight - margin) {
    console.warn('El contenido de la orden se acerc\u00F3 al l\u00EDmite de la hoja. Revisar textos muy largos (problema/notas/garant\u00EDa).');
  }

  return pdf;
}
