import React from 'react';
import { motion } from 'framer-motion';
import { MdRefresh } from 'react-icons/md';
import { useDashboard } from '../hooks/useDashboard';
import { StatsGrid } from '../components/StatsGrid';
import { RevenueChart } from '../components/RevenueChart';
import RecentDeliveries from '../components/RecentActivityList';
import { QuickActions } from '../components/QuickActions';
import { ProfitChart } from '../components/ProfitChart';
import { SalesSummary } from '../components/SalesSummary';
import { DailyMovements } from '../components/DailyMovements';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ErrorState } from '@/shared/components/async/ErrorState';

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-52 rounded-lg" />
        <Skeleton className="h-52 rounded-lg" />
      </div>
      <Skeleton className="h-80 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-72 rounded-lg" />
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const {
    isModalOpen, setIsModalOpen,
    isStatesModalOpen, setIsStatesModalOpen,
    loading, error, lastUpdated,
    selectedDate, setSelectedDate,
    repairs, dailyActivities, salesData,
    pendingDeliveries, stockAlerts, repairStatesData,
    stats, kpiTrends, salesBreakdown,
    refreshData,
  } = useDashboard();

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refreshData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al panel de administración</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Actualizado {lastUpdated.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={refreshData} className="gap-1">
            <MdRefresh size={16} /> Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <StatsGrid stats={stats} kpiTrends={kpiTrends} loading={false} />

      {/* Gráfico de beneficios (ancho completo) */}
      <ProfitChart totalProfit30d={stats.totalProfit30d} salesData={salesData} loading={false} />

      {/* Fila principal: RevenueChart a la izquierda (3/5) y QuickActions + SalesSummary apilados a la derecha (2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <RevenueChart
            salesData={salesData}
            repairStatesData={repairStatesData}
            repairs={repairs}
            onStatesModalOpen={() => setIsStatesModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-5">
          <QuickActions
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isStatesModalOpen={isStatesModalOpen}
            setIsStatesModalOpen={setIsStatesModalOpen}
            repairStatesData={repairStatesData}
          />
          <SalesSummary
            stockSalesTotal={salesBreakdown.stockSalesTotal}
            stockSalesCount={salesBreakdown.stockSalesCount}
            dailyBreakdown={salesBreakdown.dailyBreakdown}
            loading={false}
          />
        </div>
      </div>

      {/* Fila inferior: entregas recientes y movimientos diarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="h-full">
          <RecentDeliveries
            pendingDeliveries={pendingDeliveries}
            stockAlerts={stockAlerts}
          />
        </div>
        <div className="h-full">
          <DailyMovements
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onRegisterMovementClick={() => setIsModalOpen(true)}
            dailyActivities={dailyActivities}
            loading={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
export { DashboardPage as Dashboard };