import React from 'react'
import { motion } from 'framer-motion'
import { MdFileDownload } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ErrorState } from '@/shared/components/async/ErrorState'
import { useSalesReport } from '../hooks/useSalesReport'
import SalesReportFilters from '../components/SalesReportFilters'
import SalesReportSummary from '../components/SalesReportSummary'
import SalesReportChart from '../components/SalesReportChart'
import SalesReportTable from '../components/SalesReportTable'

function LoadingSkeleton() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" /><Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
      <Skeleton className="h-80" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" /><Skeleton className="h-96" />
      </div>
      <Skeleton className="h-64" />
    </motion.div>
  )
}

function SalesReportPage() {
  const {
    loading, error, period, setPeriod, customRange, setCustomRange,
    currentPage, setCurrentPage,
    filteredSales, paginatedSales, totalPages,
    totalRevenue, totalSales, avgTicket, topProduct,
    evolutionData, categoryData, topProducts, maxQuantity,
    handleExport, handleRetry,
  } = useSalesReport()

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState onRetry={handleRetry} />

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Ventas</h1>
          <p className="text-muted-foreground">Análisis detallado de las ventas del período</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredSales.length === 0}>
          <MdFileDownload size={18} />
          Exportar
        </Button>
      </div>
      <SalesReportFilters period={period} customRange={customRange} onPeriodChange={setPeriod} onCustomRangeChange={setCustomRange} />
      <SalesReportSummary totalRevenue={totalRevenue} totalSales={totalSales} avgTicket={avgTicket} topProduct={topProduct} hasSales={filteredSales.length > 0} />
      <SalesReportChart evolutionData={evolutionData} categoryData={categoryData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesReportTable
          filteredSales={filteredSales} paginatedSales={paginatedSales}
          currentPage={currentPage} totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <Card>
        <CardHeader><CardTitle>Top 5 Productos Más Vendidos</CardTitle></CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay productos vendidos en el período</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {product.position}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">{product.quantity} u.</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(product.quantity / maxQuantity) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SalesReportPage
export { SalesReportPage as SalesReport }
