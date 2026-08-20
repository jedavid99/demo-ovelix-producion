import jsPDF from 'jspdf';
import { loadBusinessInfo } from '../../hooks/useRepairPDF/pdfConfig';
import { defaultColors, setStyle, label, value, wrappedText, measureLines, card } from '../../hooks/useRepairPDF/pdfHelpers';
import type { PdfColors } from '../../hooks/useRepairPDF/pdfHelpers';
import type { Budget } from './Budgets.types';
import { formatCurrency } from './Budgets.types';

const STATUS_LABELS: Record<Budget['status'], string> = {
  Pendiente: 'PENDIENTE',
  Aprobado: 'APROBADO',
  Rechazado: 'RECHAZADO',
  Completado: 'COMPLETADO',
  Vencido: 'VENCIDO',
};

export function generateBudgetPDF(budget: Budget): jsPDF {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const colors: PdfColors = defaultColors;

  const businessInfo = loadBusinessInfo();
  const numero = budget.numero || budget.id;
  const items = budget.items ?? [];
  const total = budget.total ?? 0;
  const baseTotal = budget.baseTotal ?? total;
  const pct = budget.taxRatePorct ?? 0;
  const vigencia = budget.vigenciaDias ?? 7;
  const sumaTotal = budget.sumaTotal ?? true;
  const esAseguradora = budget.esAseguradora ?? false;
  const aseguradoraNombre = budget.aseguradoraNombre || '';
  const itemsList = items as Array<{
    device?: string;
    deviceType?: string;
    price?: number;
    aplica_porcentaje?: boolean;
  }>;
  const anyTaxed = itemsList.some((it) => Boolean(it.aplica_porcentaje) && pct > 0);
  const itemEffPrice = (it: { price?: number; aplica_porcentaje?: boolean }) =>
    (Number(it.price) || 0) * (Boolean(it.aplica_porcentaje) && pct > 0 ? 1 + pct / 100 : 1);

  pdf.setProperties({
    title: `Presupuesto ${numero}`,
    subject: `Presupuesto ${numero} - ${budget.clientName}`,
    creator: businessInfo.name || 'OVELIX',
  });

  let y = margin;

  // HEADER
  const headerH = 24;
  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(margin, y, 21, 21, 3, 3, 'F');
  setStyle(pdf, 16, 'bold', [255, 255, 255]);
  pdf.text('O', margin + 10.5, y + 15, { align: 'center' });

  value(pdf, businessInfo.name || 'OVELIX', margin + 28, y + 6.5, { size: 16, bold: true }, colors);
  value(pdf, businessInfo.address, margin + 28, y + 12, { size: 8, color: colors.gray }, colors);
  const contactParts = [businessInfo.phone && `Tel: ${businessInfo.phone}`, businessInfo.email && `Email: ${businessInfo.email}`]
    .filter(Boolean)
    .join('  \u00B7  ');
  value(pdf, contactParts, margin + 28, y + 16.5, { size: 7.5, color: colors.gray }, colors);

  label(pdf, 'PRESUPUESTO', pageWidth - margin, y + 4, 'right', colors);
  value(pdf, `#${numero}`, pageWidth - margin, y + 13, { size: 18, bold: true, color: colors.primary, align: 'right' }, colors);
  label(pdf, `Fecha: ${budget.date.toLocaleDateString('es-AR')}`, pageWidth - margin, y + 18.5, 'right', colors);
  y += headerH + 4;
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 5;

  // ESTADO
  card(pdf, margin, y, contentWidth, 9);
  label(pdf, 'ESTADO', margin + 4, y + 6, 'left', colors);
  const statusText = STATUS_LABELS[budget.status] ?? budget.status;
  value(pdf, statusText, pageWidth - margin - 4, y + 6, { size: 9, bold: true, color: colors.primary, align: 'right' }, colors);
  y += 14;

  // CLIENTE
  const infoBoxH = 16;
  card(pdf, margin, y, contentWidth, infoBoxH);
  label(pdf, 'CLIENTE', margin + 4, y + 6, 'left', colors);
  value(pdf, budget.clientName, margin + 4, y + 12, { size: 10, bold: true }, colors);
  value(pdf, `${budget.clientDni ? `DNI: ${budget.clientDni} · ` : ''}Tel: ${budget.clientPhone}`, pageWidth - margin - 4, y + 12, { size: 8, color: colors.gray, align: 'right' }, colors);
  y += infoBoxH + 5;

  // ASEGURADORA
  if (esAseguradora && aseguradoraNombre) {
    const asgBoxH = 11;
    pdf.setFillColor(254, 243, 199);
    pdf.roundedRect(margin, y, contentWidth, asgBoxH, 2, 2, 'F');
    label(pdf, 'ASEGURADORA', margin + 4, y + 5.5, 'left', colors);
    value(pdf, aseguradoraNombre, margin + 4, y + 10, { size: 9.5, bold: true }, colors);
    y += asgBoxH + 5;
  }

  // DISPOSITIVO
  card(pdf, margin, y, contentWidth, 14);
  label(pdf, 'DISPOSITIVO', margin + 4, y + 6, 'left', colors);
  value(pdf, `${budget.deviceType ? `${budget.deviceType} · ` : ''}${budget.device}`, margin + 4, y + 11.5, { size: 9.5, bold: true }, colors);
  y += 19;

  // PROBLEMA
  if (budget.issue) {
    const problemLines = measureLines(pdf, budget.issue, contentWidth - 8);
    const problemBoxH = Math.max(12, problemLines * 4 + 8);
    card(pdf, margin, y, contentWidth, problemBoxH);
    label(pdf, 'PROBLEMA REPORTADO', margin + 4, y + 5.5, 'left', colors);
    wrappedText(pdf, budget.issue, margin + 4, y + 10, contentWidth - 8, 8.5, 4);
    y += problemBoxH + 5;
  }

  // TABLA DE ITEMS
  const tableHeaderH = 7;
  pdf.setFillColor(241, 245, 249);
  pdf.rect(margin, y, contentWidth, tableHeaderH, 'F');
  label(pdf, 'DESCRIPCIÓN', margin + 3, y + 4.8, 'left', colors);
  label(pdf, 'IMPORTE', pageWidth - margin - 3, y + 4.8, 'right', colors);
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, y + tableHeaderH, pageWidth - margin, y + tableHeaderH);
  y += tableHeaderH;

  const rowH = 7;
  const visibleItems: Array<{ device?: string; deviceType?: string; price?: number; aplica_porcentaje?: boolean }> =
    items.length > 0 ? items : [{ device: budget.device, price: total }];
  for (const it of visibleItems) {
    const labelText = it.device || it.deviceType || 'Servicio';
    const lines = pdf.splitTextToSize(labelText, contentWidth - 60);
    const linesCount = Math.max(lines.length, 1);
    const itemH = Math.max(rowH, linesCount * 3.6 + 2.4);
    const rowY = y + itemH - 2.5;
    value(pdf, labelText, margin + 3, rowY, { size: 8.5 }, colors);
    const shownPrice = sumaTotal ? (Number(it.price) || 0) : itemEffPrice(it);
    value(pdf, formatCurrency(shownPrice), pageWidth - margin - 3, rowY, { size: 8.5, bold: true, align: 'right' }, colors);
    pdf.setDrawColor(...colors.border);
    pdf.line(margin, y + itemH, pageWidth - margin, y + itemH);
    y += itemH;
  }
  y += 2;

  // TOTALES
  if (!sumaTotal) {
    const noteBoxH = 12;
    card(pdf, margin, y, contentWidth, noteBoxH);
    label(pdf, 'COTIZACIÓN CON OPCIONES', margin + 4, y + 6, 'left', colors);
    value(pdf, 'El cliente elige cuál de los servicios listados realizar.', margin + 4, y + 10.5, { size: 8.5, bold: true }, colors);
    y += noteBoxH + 5;
  } else {
    if (!esAseguradora) {
      value(pdf, 'Subtotal', margin + 3, y, { size: 9, color: colors.gray }, colors);
      value(pdf, formatCurrency(baseTotal), pageWidth - margin - 3, y, { size: 9, align: 'right' }, colors);
      y += 6;
      if (anyTaxed) {
        value(pdf, `Recargo (${pct}%)`, margin + 3, y, { size: 9, color: colors.gray }, colors);
        value(pdf, formatCurrency(total - baseTotal), pageWidth - margin - 3, y, { size: 9, align: 'right' }, colors);
        y += 6;
      }
      y += 2;
    }
    pdf.setFillColor(219, 234, 254);
    pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
    label(pdf, 'TOTAL A PAGAR', margin + 6, y + 9.5, 'left', colors);
    value(pdf, formatCurrency(total), pageWidth - margin - 6, y + 9.5, { size: 16, bold: true, color: colors.primary, align: 'right' }, colors);
    y += 20;
  }

  // VIGENCIA
  const vigenciaBoxH = 22;
  card(pdf, margin, y, contentWidth, vigenciaBoxH);
  label(pdf, 'VIGENCIA', margin + 4, y + 6, 'left', colors);
  const vencText = budget.fechaVencimiento
    ? budget.fechaVencimiento.toLocaleDateString('es-AR')
    : (() => {
        const d = new Date(budget.date);
        d.setDate(d.getDate() + vigencia);
        return d.toLocaleDateString('es-AR');
      })();
  value(pdf, `Este presupuesto es válido por ${vigencia} día${vigencia === 1 ? '' : 's'} (hasta el ${vencText}).`, margin + 4, y + 12, { size: 8.5, bold: true }, colors);
  value(pdf, 'Vencido ese plazo sin aprobación, el presupuesto queda bloqueado y debe emitirse uno nuevo.', margin + 4, y + 16.5, { size: 7.5, color: colors.gray }, colors);
  y += vigenciaBoxH + 5;

  // NOTA DE APROBACIÓN
  if (budget.status === 'Aprobado' && budget.repairNumber) {
    const noteBoxH = 12;
    card(pdf, margin, y, contentWidth, noteBoxH);
    label(pdf, 'APROBADO', margin + 4, y + 6, 'left', colors);
    value(pdf, `Presupuesto aprobado y enviado a reparaciones. Reparación N° ${budget.repairNumber}.`, margin + 4, y + 10.5, { size: 8.5, bold: true, color: colors.primary }, colors);
    y += noteBoxH + 5;
  }

  // CONDICIONES
  const conditions = [
    'Una vez aprobado por el cliente, el precio queda fijado y no podrá ser modificado.',
    'El presupuesto vencido no puede ser modificado ni aprobado.',
    'Incluye únicamente los servicios y repuestos detallados. Cualquier trabajo adicional será presupuestado por separado.',
    'La aceptación del presupuesto implica la conformidad con las condiciones de servicio del taller.',
  ];
  const bulletMaxWidth = contentWidth - 12;
  const bulletLineHeight = 3.8;
  let condH = 8;
  for (const c of conditions) {
    condH += measureLines(pdf, `\u2022  ${c}`, bulletMaxWidth) * bulletLineHeight + 0.8;
  }
  card(pdf, margin, y, contentWidth, condH);
  label(pdf, 'CONDICIONES', margin + 4, y + 6, 'left', colors);
  let condY = y + 11;
  for (const c of conditions) {
    condY += wrappedText(pdf, `\u2022  ${c}`, margin + 4, condY, bulletMaxWidth, 7.5, bulletLineHeight) + 0.8;
  }
  y += condH + 5;

  // FIRMA
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 6;
  label(pdf, 'FIRMA Y CONFORMIDAD DEL CLIENTE', margin, y, 'left', colors);
  pdf.setDrawColor(148, 163, 184);
  pdf.line(margin, y + 9, margin + contentWidth / 2, y + 9);
  value(pdf, budget.clientName, margin, y + 13, { size: 7.5, color: colors.gray }, colors);
  label(pdf, 'ACLARACIÓN', pageWidth - margin, y, 'right', colors);
  pdf.setDrawColor(148, 163, 184);
  pdf.line(pageWidth - margin - contentWidth / 2, y + 9, pageWidth - margin, y + 9);
  y += 18;

  // FOOTER
  pdf.setDrawColor(...colors.border);
  pdf.line(margin, y, pageWidth - margin, y);
  value(pdf, businessInfo.name, margin, y + 5, { size: 7, bold: true, color: colors.mutedLabel }, colors);
  value(pdf, `${businessInfo.address} | Tel: ${businessInfo.phone} | Email: ${businessInfo.email}`, margin, y + 10, { size: 6.5, color: colors.mutedLabel }, colors);
  value(pdf, `CUIT: ${businessInfo.cuit}`, margin, y + 14, { size: 6.5, color: colors.mutedLabel }, colors);
  value(pdf, `Presupuesto ${numero}`, pageWidth - margin, y + 5, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);
  value(pdf, 'Documento no contable', pageWidth - margin, y + 10, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);
  value(pdf, 'Página 1 de 1', pageWidth - margin, y + 14, { size: 6.5, color: colors.mutedLabel, align: 'right' }, colors);

  if (y + 5 > pageHeight - margin) {
    console.warn('El contenido del presupuesto se acercó al límite de la hoja. Revisar textos muy largos.');
  }

  return pdf;
}

export function downloadBudgetPDF(budget: Budget): void {
  const pdf = generateBudgetPDF(budget);
  const filename = `presupuesto-${(budget.numero || budget.id).replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;
  pdf.save(filename);
}