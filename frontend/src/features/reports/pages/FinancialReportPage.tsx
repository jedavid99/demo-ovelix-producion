import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { useFinancialReport } from '../hooks/useFinancialReport';
import { FinancialFilters } from '../components/FinancialFilters';
import { FinancialSummary } from '../components/FinancialSummary';
import { FinancialChart } from '../components/FinancialChart';
import { FinancialTable } from '../components/FinancialTable';
import { FinancialCashFlow } from '../components/FinancialCashFlow';
import { FinancialExport } from '../components/FinancialExport';

function LoadingSkeleton() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
      <Skeleton className="h-80" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
      <Skeleton className="h-80" />
    </motion.div>
  );
}

function FinancialReportPage() {
  const {
    loading, error, period, setPeriod, customRange, setCustomRange,
    currentPage, setCurrentPage, cashFlow,
    filteredTransactions, paginatedTransactions, totalIncome, totalExpense,
    netProfit, profitMargin, evolutionData, expenseData,
    totalPages, pageIncome, pageExpense, handleRetry,
  } = useFinancialReport();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={handleRetry} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte Financiero</h1>
          <p className="text-muted-foreground">Análisis detallado de ingresos y egresos</p>
        </div>
        <FinancialExport filteredTransactions={filteredTransactions} />
      </div>
      <FinancialFilters period={period} setPeriod={setPeriod} customRange={customRange} setCustomRange={setCustomRange} />
      <FinancialSummary totalIncome={totalIncome} totalExpense={totalExpense} netProfit={netProfit} profitMargin={profitMargin} hasData={filteredTransactions.length > 0} />
      <FinancialChart evolutionData={evolutionData} />
      <FinancialTable
        filteredTransactions={filteredTransactions} paginatedTransactions={paginatedTransactions}
        currentPage={currentPage} totalPages={totalPages}
        pageIncome={pageIncome} pageExpense={pageExpense}
        setCurrentPage={setCurrentPage} expenseData={expenseData}
      />
      <FinancialCashFlow cashFlow={cashFlow} />
    </motion.div>
  );
}

export default FinancialReportPage;
export { FinancialReportPage as FinancialReport };
