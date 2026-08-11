import { useState } from 'react';
import type {
  RepairSummary, DailyActivity, ChartDataPoint, RepairStateData,
  PendingDelivery, StockAlert, RecentClient, DashboardStats, DeviceStat, KpiTrends,
} from '../../types/dashboard.types';

export interface SalesBreakdownState {
  stockSalesTotal: number;
  repairSalesTotal: number;
  stockSalesCount: number;
  dailyBreakdown: { name: string; stock: number; repair: number; stockCount: number }[];
}

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useDashboardState() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatesModalOpen, setIsStatesModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const [repairs, setRepairs] = useState<RepairSummary[]>([]);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [salesData, setSalesData] = useState<ChartDataPoint[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<PendingDelivery[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [repairStatesData, setRepairStatesData] = useState<RepairStateData[]>([]);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [topDevices, setTopDevices] = useState<DeviceStat[]>([]);
  const [kpiTrends, setKpiTrends] = useState<KpiTrends>({ ordersTrend: 0, revenueTrend: 0, repairedTrend: 0 });

  const [stats, setStats] = useState<DashboardStats>({
    totalActiveOrders: 0,
    totalToDeliver: 0,
    totalRevenueToday: 0,
    totalRepaired: 0,
    totalProfit30d: 0,
  });

  const [salesBreakdown, setSalesBreakdown] = useState<SalesBreakdownState>({
    stockSalesTotal: 0,
    repairSalesTotal: 0,
    stockSalesCount: 0,
    dailyBreakdown: [],
  });

  return {
    isModalOpen, setIsModalOpen,
    isStatesModalOpen, setIsStatesModalOpen,
    loading, setLoading,
    error, setError,
    lastUpdated, setLastUpdated,
    selectedDate, setSelectedDate,
    repairs, setRepairs,
    dailyActivities, setDailyActivities,
    salesData, setSalesData,
    salesBreakdown, setSalesBreakdown,
    pendingDeliveries, setPendingDeliveries,
    stockAlerts, setStockAlerts,
    repairStatesData, setRepairStatesData,
    recentClients, setRecentClients,
    topDevices, setTopDevices,
    kpiTrends, setKpiTrends,
    stats, setStats,
  };
}