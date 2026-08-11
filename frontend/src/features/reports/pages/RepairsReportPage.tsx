import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ErrorState } from '@/shared/components/async/ErrorState'
import { useRepairsReport } from '../hooks/useRepairsReport'
import RepairsReportFilters from '../components/RepairsReportFilters'
import RepairsReportSummary from '../components/RepairsReportSummary'
import RepairsReportChart from '../components/RepairsReportChart'
import RepairsReportTable from '../components/RepairsReportTable'

function LoadingSkeleton() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" /><Skeleton className="h-96" />
      </div>
      <Skeleton className="h-80" />
    </motion.div>
  )
}

function RepairsReportPage() {
  const {
    loading, error, period, setPeriod, customRange, setCustomRange,
    currentPage, setCurrentPage,
    filteredRepairs, paginatedRepairs, totalPages,
    repairsByStatus, repairsByDevice, timelineData,
    primaryKpis, secondaryKpis, handleRetry,
  } = useRepairsReport()

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState onRetry={handleRetry} />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Reparaciones</h1>
          <p className="text-muted-foreground">Análisis detallado de las reparaciones realizadas</p>
        </div>
      </div>
      <RepairsReportFilters period={period} customRange={customRange} onPeriodChange={setPeriod} onCustomRangeChange={setCustomRange} />
      <RepairsReportSummary primaryKpis={primaryKpis} secondaryKpis={secondaryKpis} />
      <RepairsReportChart repairsByStatus={repairsByStatus} repairsByDevice={repairsByDevice} timelineData={timelineData} />
      <RepairsReportTable
        filteredRepairs={filteredRepairs} paginatedRepairs={paginatedRepairs}
        currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
      />
    </motion.div>
  )
}

export default RepairsReportPage
export { RepairsReportPage as RepairsReport }
