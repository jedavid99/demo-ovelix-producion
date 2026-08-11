import { dashboardApi } from '../../services/dashboardApi';
import {
  calculateStats, calculateRepairStates, getRecentRepairs,
  calculateSalesData, getPendingDeliveries, getStockAlerts, getRecentClients,
  calculateKpiTrends, getTopDevices, calculateSalesBreakdown,
} from './dashboardCalculations';

const TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const result = await promise;
    return result;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadDashboardData(selectedDate: string) {
  const [repairsResult, movementsResult, stockResult, clientsResult] = await Promise.allSettled([
    withTimeout(dashboardApi.getRepairs(), TIMEOUT_MS),
    withTimeout(dashboardApi.getStockMovements(), TIMEOUT_MS),
    withTimeout(dashboardApi.getStockItems(), TIMEOUT_MS),
    withTimeout(dashboardApi.getClients(), TIMEOUT_MS),
  ]);

  const repairs = repairsResult.status === 'fulfilled' ? repairsResult.value : [];
  const stockMovements = movementsResult.status === 'fulfilled' ? movementsResult.value : [];
  const stockItems = stockResult.status === 'fulfilled' ? stockResult.value : [];
  const clients = clientsResult.status === 'fulfilled' ? clientsResult.value : [];

  const stats = calculateStats(repairs);
  const kpiTrends = calculateKpiTrends(repairs);
  const topDevices = getTopDevices(repairs);
  const repairStatesData = calculateRepairStates(repairs);
  const recentRepairs = getRecentRepairs(repairs);
  const salesData = calculateSalesData(repairs, stockMovements);
  const salesBreakdown = calculateSalesBreakdown(repairs, stockMovements);
  const pendingDeliveries = getPendingDeliveries(repairs);
  const stockAlerts = getStockAlerts(stockItems);
  const recentClients = getRecentClients(clients);

  const dailyActivities = buildDailyActivities(selectedDate, repairs, stockMovements, clients);

  return { stats, kpiTrends, topDevices, repairStatesData, repairs: recentRepairs, salesData, salesBreakdown, pendingDeliveries, stockAlerts, recentClients, dailyActivities, whatsappMovements: [] as any[] };
}

function buildDailyActivities(selectedDate: string, repairs: any[], stockMovements: any[], clients: any[]) {
  const dateStr = selectedDate;

  const stockEntries = stockMovements
    .filter((m: any) => {
      const d = m.createdAt ? new Date(m.createdAt) : null;
      return d && d.toISOString().split('T')[0] === dateStr;
    })
    .map((m: any) => ({
      id: m.id, type: 'Stock' as const,
      description: m.description || m.descripcion || m.product_name || 'Movimiento de stock',
      quantity: m.quantity || m.cantidad || 0,
      time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '\u2014',
    }));

  const repairEntries = repairs
    .filter((r: any) => {
      const d = r.updatedAt || r.fecha_ingreso ? new Date(r.updatedAt || r.fecha_ingreso) : null;
      return d && d.toISOString().split('T')[0] === dateStr;
    })
    .map((r: any) => ({
      id: r.id, type: 'Reparaci\u00F3n' as const,
      description: `Estado: ${r.estado} - ${r.dispositivo}`, quantity: 1,
      time: r.updatedAt ? new Date(r.updatedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '\u2014',
    }));

  const clientEntries = clients
    .filter((c: any) => {
      const d = c.fecha_registro || c.createdAt || c.created_at ? new Date(c.fecha_registro || c.createdAt || c.created_at) : null;
      return d && d.toISOString().split('T')[0] === dateStr;
    })
    .map((c: any) => ({
      id: c.id, type: 'Cliente' as const,
      description: `Nuevo cliente: ${c.nombre_completo || c.nombre}`, quantity: 1,
      time: c.fecha_registro || c.createdAt || c.created_at ? new Date(c.fecha_registro || c.createdAt || c.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '\u2014',
    }));

  return [...stockEntries, ...repairEntries, ...clientEntries]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 20);
}