import { motion } from 'framer-motion';
import { MdFileDownload } from 'react-icons/md';
import { PackageSearch } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useStockReport } from '../hooks/useStockReport';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import { StockFilters } from '../components/StockFilters';
import { KpiCards } from '../components/KpiCards';
import { CriticalStockAlerts } from '../components/CriticalStockAlerts';
import { StockChart } from '../components/StockChart';
import { ProductTable } from '../components/ProductTable';
import { NoMovementProducts } from '../components/NoMovementProducts';

export default function StockReportPage() {
  const {
    loading, error, selectedCategory, searchQuery, currentPage,
    filteredProducts, kpis, categoryData, criticalStockProducts,
    noMovementProducts, paginatedProducts, totalPages,
    setSelectedCategory, setSearchQuery, setCurrentPage,
    handleExport, handleRetry, navigate,
  } = useStockReport();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={handleRetry} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Stock</h1>
          <p className="text-muted-foreground">Análisis detallado del inventario</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <MdFileDownload size={18} /> Exportar
        </Button>
      </div>

      <StockFilters
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
      />

      <KpiCards
        totalItems={kpis.totalItems}
        lowStockItems={kpis.lowStockItems}
        totalInventoryValue={kpis.totalInventoryValue}
        inventoryTurnover={kpis.inventoryTurnover}
      />

      <CriticalStockAlerts
        products={criticalStockProducts}
        onNavigateProviders={() => navigate('/providers')}
      />

      <StockChart data={categoryData} />

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No hay productos en el stock"
            description="Ajusta los filtros de búsqueda o agrega productos para comenzar a monitorear el inventario."
            actionLabel="Limpiar filtros"
            onAction={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
          />
        ) : (
          <ProductTable
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            totalFiltered={filteredProducts.length}
            onPageChange={setCurrentPage}
            onNavigateProviders={() => navigate('/providers')}
          />
        )}
      </div>

      <NoMovementProducts products={noMovementProducts} />
    </motion.div>
  );
}
