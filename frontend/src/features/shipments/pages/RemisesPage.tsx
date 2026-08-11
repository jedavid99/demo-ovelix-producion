import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useRemises } from '../hooks/useRemises'
import RemisesSummary from '../components/RemisesSummary'
import RemisesFilters from '../components/RemisesFilters'
import RemisesList from '../components/RemisesList'
import TrackingStatus from '../components/TrackingStatus'
import RemisesForm from '../components/RemisesForm'

function RemisesPage() {
  const {
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    selectedRemise,
    showDetailsModal,
    showAddModal, setShowAddModal,
    currentPage, setCurrentPage,
    newRemise,
    filteredRemises, paginatedRemises, totalPages,
    kpiData,
    getStatusBadge,
    openDetails,
    closeDetailsModal,
    handleInputChange,
    handleSaveRemise,
    clearFilters,
    handleEdit,
    handleDelete,
    confirmDelete,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
  } = useRemises()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Remises</h1>
          <p className="text-muted-foreground">Gestión de vehículos de transporte</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={18} />
          Nuevo remise
        </Button>
      </div>
      <RemisesSummary kpiData={kpiData} />
      <RemisesFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
      />
      <RemisesList
        filteredRemises={filteredRemises}
        paginatedRemises={paginatedRemises}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getStatusBadge={getStatusBadge}
        openDetails={openDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenAdd={() => setShowAddModal(true)}
      />
      {showDetailsModal && (
        <TrackingStatus
          selectedRemise={selectedRemise}
          closeDetailsModal={closeDetailsModal}
        />
      )}
      <RemisesForm
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newRemise={newRemise}
        handleInputChange={handleInputChange}
        handleSaveRemise={handleSaveRemise}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Eliminar remise"
        description="¿Estás seguro de que deseas eliminar este remise?"
        onConfirm={confirmDelete}
      />
    </motion.div>
  )
}

export default RemisesPage
export { RemisesPage as Remises }
