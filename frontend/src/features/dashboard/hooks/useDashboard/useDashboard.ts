import { useCallback, useEffect, useRef, useState } from 'react';
import { useListCache } from '@/shared/hooks/useListCache';
import { useDashboardState } from './useDashboardState';
import { loadDashboardData } from './dashboardDataLoader';

export function useDashboard() {
  const state = useDashboardState();
  const { data, loading, error, refresh } = useListCache(
    `dashboard:by-date:${state.selectedDate}`,
    () => loadDashboardData(state.selectedDate),
  );

  // Sincronizar datos del caché al estado local cuando cambian
  useEffect(() => {
    if (!data) return;
    state.setStats(data.stats);
    state.setKpiTrends(data.kpiTrends);
    state.setTopDevices(data.topDevices);
    state.setSalesBreakdown(data.salesBreakdown);
    state.setRepairStatesData(data.repairStatesData);
    state.setRepairs(data.repairs);
    state.setSalesData(data.salesData);
    state.setPendingDeliveries(data.pendingDeliveries);
    state.setStockAlerts(data.stockAlerts);
    state.setRecentClients(data.recentClients);
    state.setDailyActivities(data.dailyActivities);
    state.setLastUpdated(new Date());
  }, [data]);

  return {
    isModalOpen: state.isModalOpen,
    setIsModalOpen: state.setIsModalOpen,
    isStatesModalOpen: state.isStatesModalOpen,
    setIsStatesModalOpen: state.setIsStatesModalOpen,
    loading: loading,
    error: error,
    lastUpdated: state.lastUpdated,
    selectedDate: state.selectedDate,
    setSelectedDate: state.setSelectedDate,
    repairs: state.repairs,
    dailyActivities: state.dailyActivities,
    salesData: state.salesData,
    pendingDeliveries: state.pendingDeliveries,
    stockAlerts: state.stockAlerts,
    repairStatesData: state.repairStatesData,
    recentClients: state.recentClients,
    topDevices: state.topDevices,
    kpiTrends: state.kpiTrends,
    stats: state.stats,
    salesBreakdown: state.salesBreakdown,
    refreshData: refresh,
  };
}