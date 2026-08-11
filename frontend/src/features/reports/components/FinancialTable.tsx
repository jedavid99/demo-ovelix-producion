import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '../constants/financial.constants';
import type { Transaction } from '../types/financial.types';
import FinancialPieChart from './FinancialPieChart';

interface FinancialTableProps {
  filteredTransactions: Transaction[];
  paginatedTransactions: Transaction[];
  currentPage: number;
  totalPages: number;
  pageIncome: number;
  pageExpense: number;
  setCurrentPage: (fn: (p: number) => number) => void;
  expenseData: { name: string; value: number }[];
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  filteredTransactions, paginatedTransactions, currentPage, totalPages,
  pageIncome, pageExpense, setCurrentPage, expenseData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Transacciones</CardTitle></CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No hay transacciones en el período seleccionado"
              className="py-8"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium">Descripción</th>
                      <th className="pb-3 font-medium text-center">Tipo</th>
                      <th className="pb-3 font-medium text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {paginatedTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3">{format(tx.date, 'dd/MM/yyyy', { locale: es })}</td>
                        <td className="py-3">{tx.description}</td>
                        <td className="py-3 text-center">
                          <Badge variant={tx.type === 'Ingreso' ? 'success' : 'destructive'} size="sm">{tx.type}</Badge>
                        </td>
                        <td className={`py-3 text-right font-semibold ${tx.type === 'Ingreso' ? 'text-success' : 'text-destructive'}`}>
                          {tx.type === 'Ingreso' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
                <div><p className="text-xs text-muted-foreground">Ingresos (página)</p><p className="text-sm font-semibold text-success">{formatCurrency(pageIncome)}</p></div>
                <div><p className="text-xs text-muted-foreground">Egresos (página)</p><p className="text-sm font-semibold text-destructive">{formatCurrency(pageExpense)}</p></div>
                <div><p className="text-xs text-muted-foreground">Balance (página)</p><p className={`text-sm font-semibold ${pageIncome - pageExpense >= 0 ? 'text-success' : 'text-destructive'}`}>{formatCurrency(pageIncome - pageExpense)}</p></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, filteredTransactions.length)} de {filteredTransactions.length}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <FinancialPieChart expenseData={expenseData} />
    </div>
  );
};
export default FinancialTable;
