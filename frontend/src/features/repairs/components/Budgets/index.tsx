import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/shared/components/ui/use-toast';
import { useBudgets } from './useBudgets';
import { BudgetsHeader } from './BudgetsHeader';
import { BudgetsKPIs } from './BudgetsKPIs';
import { BudgetsFilters } from './BudgetsFilters';
import { BudgetsTable } from './BudgetsTable';
import { BudgetsChart } from './BudgetsChart';
import { BudgetCreate } from './BudgetCreate';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { ITEMS_PER_PAGE } from './Budgets.types';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

export default function Budgets() {
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    setBudgets,
    paginatedBudgets,
    totalPages,
    totalBudgets,
    totalPending,
    totalApproved,
    totalValue,
    statusData,
    isModalOpen,
    setIsModalOpen,
    newBudget,
    setNewBudget,
    errors,
    setErrors,
    isSubmitting,
    handleExport,
    handleRetry,
    handleNewBudgetChange,
    handleSaveBudget,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    clearFilters,
    taxRates,
    deviceCategories,
  } = useBudgets();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetIdToDelete, setBudgetIdToDelete] = useState<string | null>(null);

  const handleDeleteBudget = (id: string) => {
    setBudgetIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBudget = () => {
    if (budgetIdToDelete) {
      setBudgets(prev => prev.filter(b => b.id !== budgetIdToDelete));
      toast({ title: 'Éxito', description: 'Presupuesto eliminado correctamente.' });
    }
    setDeleteConfirmOpen(false);
    setBudgetIdToDelete(null);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (isModalOpen) {
    return (
      <BudgetCreate
        onClose={() => setIsModalOpen(false)}
        newBudget={newBudget}
        onBudgetChange={handleNewBudgetChange}
        onSave={handleSaveBudget}
        errors={errors}
        isSubmitting={isSubmitting}
        taxRates={taxRates}
        deviceCategories={deviceCategories}
        onItemChange={handleItemChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <BudgetsHeader
        onExport={handleExport}
        onNewBudget={() => setIsModalOpen(true)}
        hasBudgets={totalBudgets > 0}
      />

      {/* KPIs */}
      <BudgetsKPIs
        totalBudgets={totalBudgets}
        totalPending={totalPending}
        totalApproved={totalApproved}
        totalValue={totalValue}
      />

      {/* Filtros */}
      <BudgetsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={searchQuery !== '' || statusFilter !== 'all'}
      />

      {/* Gráfico de estado y tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de presupuestos (ocupa 2 columnas) */}
        <div className="lg:col-span-2">
          <BudgetsTable
            budgets={paginatedBudgets}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalFiltered={totalBudgets}
            onDelete={handleDeleteBudget}
          />
        </div>

        {/* Gráfico de distribución por estado */}
        <div>
          <BudgetsChart statusData={statusData} />
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Eliminar presupuesto"
        description="¿Estás seguro de que deseas eliminar este presupuesto?"
        onConfirm={confirmDeleteBudget}
      />
    </motion.div>
  );
}
