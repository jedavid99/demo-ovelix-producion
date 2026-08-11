import { useEffect } from 'react';

export function usePrintStyles() {
  useEffect(() => {
    const styleId = 'print-styles-service-order';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-container {
            width: 210mm !important; height: 297mm !important;
            margin: 0 !important; padding: 0 !important;
            transform: none !important; scale: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
}
