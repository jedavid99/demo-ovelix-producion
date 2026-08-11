import { useEffect, useCallback, useRef } from 'react';
import { useDashboardState } from './useDashboardState';
import { loadDashboardData } from './dashboardDataLoader';

export function useDashboard() {
  const state = useDashboardState();
  const mountedRef = useRef(true);

  const fetchDashboardData = useCallback(async () => {
    state.setError(null);
    state.setLoading(true);
    try {
      const result = await loadDashboardData(state.selectedDate);
      if (!mountedRef.current) return;
      state.setStats(result.stats);
      state.setKpiTrends(result.kpiTrends);
      state.setTopDevices(result.topDevices);
      state.setSalesBreakdown(result.salesBreakdown);
      state.setRepairStatesData(result.repairStatesData);
      state.setRepairs(result.repairs);
      state.setSalesData(result.salesData);
      state.setPendingDeliveries(result.pendingDeliveries);
      state.setStockAlerts(result.stockAlerts);
      state.setRecentClients(result.recentClients);
      state.setDailyActivities(result.dailyActivities);
      state.setLastUpdated(new Date());
    } catch (error) {
      if (!mountedRef.current) return;
      console.error('Error fetching dashboard data:', error);
      state.setError('No se pudieron cargar los datos. Verificá tu conexión e intentá de nuevo.');
    } finally {
      if (mountedRef.current) {
        state.setLoading(false);
      }
    }
  }, [state.selectedDate]);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboardData();
    return () => { mountedRef.current = false; };
  }, [fetchDashboardData]);

  return {
    isModalOpen: state.isModalOpen,
    setIsModalOpen: state.setIsModalOpen,
    isStatesModalOpen: state.isStatesModalOpen,
    setIsStatesModalOpen: state.setIsStatesModalOpen,
    loading: state.loading,
    error: state.error,
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
    refreshData: fetchDashboardData,
  };
}