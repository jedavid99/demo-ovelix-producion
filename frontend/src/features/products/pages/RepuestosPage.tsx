import React from 'react'
import { motion } from 'framer-motion'
import { useRepuestos } from '../hooks/useRepuestos'
import StockSummary from '../components/StockSummary'
import RepuestosFilters from '../components/RepuestosFilters'
import RepuestosTable from '../components/RepuestosTable'
import RepuestosForm from '../components/RepuestosForm'
import RepuestosActions from '../components/RepuestosActions'

function RepuestosPage() {
  const {
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    activeStatus, setActiveStatus,
    loading, isModalOpen, setIsModalOpen,
    newRepuesto, compatibilityInput, setCompatibilityInput,
    filteredItems, totalItems, kpiData,
    getStatusBadge,
    handleNewRepuestoChange, addCompatibility, removeCompatibility,
    handleKeyPress, handleSaveRepuesto, clearFilters,
  } = useRepuestos()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Stock de Repuestos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona tu inventario de piezas y componentes de reparación
          </p>
        </div>
        <RepuestosActions onOpenModal={() => setIsModalOpen(true)} />
      </div>
      <StockSummary kpiData={kpiData} />
      <RepuestosFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        activeStatus={activeStatus} setActiveStatus={setActiveStatus}
        clearFilters={clearFilters}
      />
      <RepuestosTable
        loading={loading}
        filteredItems={filteredItems}
        totalItems={totalItems}
        getStatusBadge={getStatusBadge}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <RepuestosForm
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}
        newRepuesto={newRepuesto}
        compatibilityInput={compatibilityInput} setCompatibilityInput={setCompatibilityInput}
        handleNewRepuestoChange={handleNewRepuestoChange}
        addCompatibility={addCompatibility} removeCompatibility={removeCompatibility}
        handleKeyPress={handleKeyPress} handleSaveRepuesto={handleSaveRepuesto}
      />
    </motion.div>
  )
}

export default RepuestosPage
export { RepuestosPage as Repuestos }
