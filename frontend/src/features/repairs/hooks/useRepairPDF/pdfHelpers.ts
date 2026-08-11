import type jsPDF from 'jspdf';

export interface PdfColors {
  primary: readonly [number, number, number];
  dark: readonly [number, number, number];
  gray: readonly [number, number, number];
  mutedLabel: readonly [number, number, number];
  bgSoft: readonly [number, number, number];
  border: readonly [number, number, number];
}

export const defaultColors: PdfColors = {
  primary: [37, 99, 235] as const,
  dark: [15, 23, 42] as const,
  gray: [71, 85, 105] as const,
  mutedLabel: [100, 116, 139] as const,
  bgSoft: [248, 250, 252] as const,
  border: [226, 232, 240] as const,
};

export function setStyle(pdf: jsPDF, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', color: readonly [number, number, number] = defaultColors.dark, font: string = 'helvetica') {
  pdf.setFont(font, style);
  pdf.setFontSize(size);
  pdf.setTextColor(...color);
}

export function label(pdf: jsPDF, text: string, x: number, y: number, align: 'left' | 'right' | 'center' = 'left', colors: PdfColors = defaultColors) {
  setStyle(pdf, 7, 'bold', colors.mutedLabel);
  pdf.text(text, x, y, { align });
}

export function value(pdf: jsPDF, text: string, x: number, y: number, opts: { size?: number; bold?: boolean; color?: readonly [number, number, number]; align?: 'left' | 'right' | 'center' } = {}, colors: PdfColors = defaultColors) {
  setStyle(pdf, opts.size ?? 9, opts.bold ? 'bold' : 'normal', opts.color ?? colors.dark);
  pdf.text(text, x, y, { align: opts.align ?? 'left' });
}

export function wrappedText(pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, size = 8.5, lineHeight = 4, color: readonly [number, number, number] = defaultColors.gray) {
  setStyle(pdf, size, 'normal', color);
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return lines.length * lineHeight;
}

export function measureLines(pdf: jsPDF, text: string, maxWidth: number) {
  return pdf.splitTextToSize(text, maxWidth).length;
}

export function card(pdf: jsPDF, x: number, y: number, w: number, h: number, fill: readonly [number, number, number] = defaultColors.bgSoft) {
  pdf.setFillColor(...fill);
  pdf.roundedRect(x, y, w, h, 2, 2, 'F');
}
