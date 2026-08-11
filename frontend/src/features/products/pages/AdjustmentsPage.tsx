import React from 'react'
import { motion } from 'framer-motion'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useAdjustments } from '../hooks/useAdjustments'
import AdjustmentsSummary from '../components/AdjustmentsSummary'
import AdjustmentsFilters from '../components/AdjustmentsFilters'
import AdjustmentsList from '../components/AdjustmentsList'
import AdjustmentsForm from '../components/AdjustmentsForm'

function AdjustmentsPage() {
  const {
    searchTerm, setSearchTerm,
    activeType, setActiveType,
    activeStatus, setActiveStatus,
    loading, isModalOpen, setIsModalOpen,
    newAdjustment,
    filteredItems, totalAdjustments, kpiData,
    getTypeBadge, getStatusBadge,
    handleNewAdjustmentChange, handleSaveAdjustment, clearFilters,
  } = useAdjustments()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajustes de Stock</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Registra y gestiona movimientos de inventario
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Nuevo ajuste
          </Button>
        </div>
      </div>
      <AdjustmentsSummary kpiData={kpiData} />
      <AdjustmentsFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeType={activeType} setActiveType={setActiveType}
        activeStatus={activeStatus} setActiveStatus={setActiveStatus}
        clearFilters={clearFilters}
      />
      <AdjustmentsList
        loading={loading}
        filteredItems={filteredItems}
        totalAdjustments={totalAdjustments}
        getTypeBadge={getTypeBadge}
        getStatusBadge={getStatusBadge}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <AdjustmentsForm
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
        newAdjustment={newAdjustment}
        handleNewAdjustmentChange={handleNewAdjustmentChange}
        handleSaveAdjustment={handleSaveAdjustment}
      />
    </motion.div>
  )
}

export default AdjustmentsPage
export { AdjustmentsPage as Adjustments }
