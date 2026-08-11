import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MdFileDownload } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import type { Transaction } from '../types/financial.types';
import { exportToCSV } from '@/shared/lib/export';

interface FinancialExportProps {
  filteredTransactions: Transaction[];
}

export const FinancialExport: React.FC<FinancialExportProps> = ({ filteredTransactions }) => {
  const handleExport = () => {
    const csvData = filteredTransactions.map(tx => ({
      Fecha: format(tx.date, 'dd/MM/yyyy', { locale: es }),
      Descripción: tx.description,
      Tipo: tx.type,
      Categoría: tx.category,
      Monto: tx.amount,
    }));
    exportToCSV(csvData, 'reporte-financiero');
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <MdFileDownload size={18} />
      Exportar CSV
    </Button>
  );
};
export default FinancialExport;
