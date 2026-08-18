import { InventoryHeader } from './components/InventoryHeader';
import { KPICards } from './components/KPICards';
import { InventoryFilters } from './components/InventoryFilters';
import { InventoryTable } from './components/InventoryTable';
import { InventoryPagination } from './components/InventoryPagination';
import { BottomSections } from './components/BottomSections';
import { useInventoryState } from './hooks/useInventoryState';

export default function IPhoneInventoryList() {
  const {
    searchQuery, setSearchQuery,
    seriesFilter, setSeriesFilter,
    conditionFilter, setConditionFilter,
    currentPage, setCurrentPage,
    iphones, total, loading, error,
    refetch,
  } = useInventoryState();

  return (
    <div className="flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full">
        <InventoryHeader />
        <KPICards
          totalUnits={total}
          totalValue={iphones.reduce((sum, p) => sum + 0, 0)}
          noStockCount={iphones.filter(p => p.status === 'Out of Stock').length}
        />

        <div className="bg-card  rounded-xl border border-border  shadow-sm">
          <InventoryFilters
            searchQuery={searchQuery}
            seriesFilter={seriesFilter}
            conditionFilter={conditionFilter}
            onSearchChange={setSearchQuery}
            onSeriesChange={setSeriesFilter}
            onConditionChange={setConditionFilter}
          />
          <InventoryTable iphones={iphones} loading={loading} error={error} onRetry={refetch} />
          <InventoryPagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil(total / 10))} total={total} onPageChange={setCurrentPage} />
        </div>

        <BottomSections />
      </main>
    </div>
  );
}
