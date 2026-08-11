import React from 'react'
import { motion } from 'framer-motion'
import { useCategories } from '../hooks/useCategories'
import { LoadingState } from '@/shared/components/async/LoadingState'
import { ErrorState } from '@/shared/components/async/ErrorState'
import CategoriesFilters from '../components/CategoriesFilters'
import CategoriesSummary from '../components/CategoriesSummary'
import CategoriesList from '../components/CategoriesList'

function CategoriesPage() {
  const {
    loading, error, refetch,
    searchTerm, setSearchTerm,
    currentPage, setCurrentPage,
    filteredCategories, paginatedCategories, totalPages,
    kpiData, clearFilters, hasActiveFilters,
  } = useCategories()

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorías de Gastos</h1>
          <p className="text-muted-foreground">Categorías utilizadas en tus gastos, con su monto acumulado</p>
        </div>
      </div>

      {error && (
        <ErrorState
          title="Error al cargar las categorías"
          message={error}
          onRetry={refetch}
        />
      )}

      {loading && !error && <LoadingState label="Cargando categorías..." />}

      {!loading && !error && (
        <>
          <CategoriesSummary kpiData={kpiData} />
          <CategoriesFilters
            searchTerm={searchTerm}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchTerm}
            onClearFilters={clearFilters}
          />
          <CategoriesList
            filteredCategories={filteredCategories}
            paginatedCategories={paginatedCategories}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </motion.div>
  )
}

export default CategoriesPage
export { CategoriesPage as Categories }