import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/shared/components/ui/use-toast';
import { useBudgets } from './useBudgets';
import { budgetsApi, dtoToBudget } from './budgetsApi';
import { downloadBudgetPDF } from './budgetPDF';
import { BudgetsHeader } from './BudgetsHeader';
import { BudgetsKPIs } from './BudgetsKPIs';
import { BudgetsFilters } from './BudgetsFilters';
import { BudgetsTable } from './BudgetsTable';
import { BudgetsChart } from './BudgetsChart';
import { BudgetCreate } from './BudgetCreate';
import { BudgetDetail } from './BudgetDetail';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { ITEMS_PER_PAGE, initialNewBudget } from './Budgets.types';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

const getErrorMessage = (err: unknown): string => {
  if (typeof err === 'object' && err !== null) {
    const e = err as { response?: { data?: { message?: unknown } }; message?: unknown };
    const m = e.response?.data?.message ?? e.message;
    if (typeof m === 'string') return m;
  }
  return '';
};

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
    budgets,
    paginatedBudgets,
    totalPages,
    totalBudgets,
    totalPending,
    totalApproved,
    totalValue,
    statusData,
    isModalOpen,
    setIsModalOpen,
    editingBudgetId,
    setEditingBudgetId,
    newBudget,
    setNewBudget,
    errors,
    setErrors,
    isSubmitting,
    handleExport,
    handleRetry,
    handleNewBudgetChange,
    handleSaveBudget,
    handleEditBudget,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    clearFilters,
    taxRates,
    deviceCategories,
  } = useBudgets();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetIdToDelete, setBudgetIdToDelete] = useState<string | null>(null);

  const [detailBudgetId, setDetailBudgetId] = useState<string | null>(null);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [budgetIdToAction, setBudgetIdToAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const detailBudget = detailBudgetId ? budgets.find((b) => b.id === detailBudgetId) ?? null : null;

  const handleDeleteBudget = (id: string) => {
    setBudgetIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteBudget = async () => {
    if (!budgetIdToDelete) return;
    try {
      await budgetsApi.remove(budgetIdToDelete);
      setBudgets((prev) => prev.filter((b) => b.id !== budgetIdToDelete));
      if (detailBudgetId === budgetIdToDelete) setDetailBudgetId(null);
      toast({ title: 'Éxito', description: 'Presupuesto eliminado correctamente.' });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el presupuesto. Verificá la conexión e intentá de nuevo.',
        variant: 'destructive',
      });
    }
    setDeleteConfirmOpen(false);
    setBudgetIdToDelete(null);
  };

  const handleApproveBudget = (id: string) => {
    setBudgetIdToAction(id);
    setApproveConfirmOpen(true);
  };

  const confirmApproveBudget = async () => {
    if (!budgetIdToAction) return;
    setIsProcessing(true);
    try {
      const updated = await budgetsApi.approve(budgetIdToAction);
      const mapped = dtoToBudget(updated);
      setBudgets((prev) => prev.map((b) => (b.id === mapped.id ? mapped : b)));
      toast({
        title: 'Presupuesto aprobado',
        description: mapped.repairNumber
          ? `El precio quedó fijado y se creó la reparación N° ${mapped.repairNumber}.`
          : 'El precio quedó fijado y no puede modificarse.',
      });
    } catch (err) {
      const message = getErrorMessage(err);
      toast({
        title: 'No se pudo aprobar',
        description: message ? message : 'Verificá la conexión e intentá de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setApproveConfirmOpen(false);
      setBudgetIdToAction(null);
    }
  };

  const handleRejectBudget = (id: string) => {
    setBudgetIdToAction(id);
    setRejectConfirmOpen(true);
  };

  const confirmRejectBudget = async () => {
    if (!budgetIdToAction) return;
    setIsProcessing(true);
    try {
      const updated = await budgetsApi.reject(budgetIdToAction);
      const mapped = dtoToBudget(updated);
      setBudgets((prev) => prev.map((b) => (b.id === mapped.id ? mapped : b)));
      toast({ title: 'Éxito', description: 'Presupuesto rechazado correctamente.' });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo rechazar el presupuesto. Verificá la conexión e intentá de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setRejectConfirmOpen(false);
      setBudgetIdToAction(null);
    }
  };

  const handlePrint = (budget: (typeof budgets)[number]) => {
    try {
      downloadBudgetPDF(budget);
      toast({ title: 'PDF generado', description: 'El presupuesto se descargó correctamente.' });
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo generar el PDF del presupuesto.',
        variant: 'destructive',
      });
    }
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
        isEditing={Boolean(editingBudgetId)}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudgetId(null);
          setNewBudget(initialNewBudget);
          setErrors({});
        }}
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
            onView={setDetailBudgetId}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
            onApprove={handleApproveBudget}
            onReject={handleRejectBudget}
            onPrint={handlePrint}
          />
        </div>

        {/* Gráfico de distribución por estado */}
        <div>
          <BudgetsChart statusData={statusData} />
        </div>
      </div>

      <BudgetDetail
        budget={detailBudget}
        open={Boolean(detailBudget)}
        onOpenChange={(open) => {
          if (!open) setDetailBudgetId(null);
        }}
        onApprove={handleApproveBudget}
        onReject={handleRejectBudget}
        onEdit={(id) => {
          setDetailBudgetId(null);
          handleEditBudget(id);
        }}
        onDelete={(id) => {
          setDetailBudgetId(null);
          handleDeleteBudget(id);
        }}
        onPrint={handlePrint}
      />

      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Aprobar presupuesto"
        description="Al aprobar, el precio queda fijado y se crea la reparación automáticamente con los datos de este presupuesto. ¿Continuar?"
        confirmLabel="Aprobar"
        variant="default"
        onConfirm={confirmApproveBudget}
        loading={isProcessing}
      />

      <ConfirmDialog
        open={rejectConfirmOpen}
        onOpenChange={setRejectConfirmOpen}
        title="Rechazar presupuesto"
        description="¿Estás seguro de que deseas rechazar este presupuesto?"
        confirmLabel="Rechazar"
        onConfirm={confirmRejectBudget}
        loading={isProcessing}
      />

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