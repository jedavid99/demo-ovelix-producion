import type { DashboardStats, RepairStateData, RepairSummary, PendingDelivery, DeviceStat, KpiTrends } from '../../types/dashboard.types';
import { getEstadoConfig } from '@/config/estadosReparacion.config';

function toDate(d: any): Date | null {
  if (!d) return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function calculateStats(repairs: any[]): DashboardStats {
  const activeOrders = repairs.filter((r: any) => r.estado !== 'delivered' && r.estado !== 'cancelled').length;
  const readyToDeliver = repairs.filter((r: any) => r.estado === 'ready').length;
  const totalRepaired = repairs.filter((r: any) => r.estado === 'delivered').length;

  const today = new Date();
  const revenueToday = repairs
    .filter((r: any) => {
      const d = toDate(r.fecha_ingreso);
      return d && isSameDay(d, today) && r.total_reparacion;
    })
    .reduce((sum: number, r: any) => {
      const total = typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0;
      return sum + total;
    }, 0);

  const thirtyDaysAgo = daysAgo(30);
  const totalProfit30d = repairs
    .filter((r: any) => {
      const d = toDate(r.fecha_ingreso);
      return d && d >= thirtyDaysAgo && r.estado === 'delivered' && r.total_reparacion;
    })
    .reduce((sum: number, r: any) => {
      const total = typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0;
      return sum + total;
    }, 0);

  return { totalActiveOrders: activeOrders, totalToDeliver: readyToDeliver, totalRevenueToday: revenueToday, totalRepaired, totalProfit30d };
}

export function calculateKpiTrends(repairs: any[]): KpiTrends {
  const now = new Date();
  const weekAgo = daysAgo(7);
  const twoWeeksAgo = daysAgo(14);

  const current = repairs.filter((r: any) => {
    const d = toDate(r.fecha_ingreso);
    return d && d >= weekAgo;
  });

  const previous = repairs.filter((r: any) => {
    const d = toDate(r.fecha_ingreso);
    return d && d >= twoWeeksAgo && d < weekAgo;
  });

  const curActive = current.filter((r: any) => r.estado !== 'delivered' && r.estado !== 'cancelled').length;
  const prevActive = previous.filter((r: any) => r.estado !== 'delivered' && r.estado !== 'cancelled').length;

  const curRevenue = current
    .filter((r: any) => r.total_reparacion)
    .reduce((s: number, r: any) => s + (typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0), 0);
  const prevRevenue = previous
    .filter((r: any) => r.total_reparacion)
    .reduce((s: number, r: any) => s + (typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0), 0);

  const curDelivered = current.filter((r: any) => r.estado === 'delivered').length;
  const prevDelivered = previous.filter((r: any) => r.estado === 'delivered').length;

  const pct = (cur: number, prev: number) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : cur > 0 ? 100 : 0;

  return {
    ordersTrend: pct(curActive, prevActive),
    revenueTrend: pct(curRevenue, prevRevenue),
    repairedTrend: pct(curDelivered, prevDelivered),
  };
}

export function calculateRepairStates(repairs: any[]): RepairStateData[] {
  const states = repairs.reduce((acc: any, r: any) => {
    const state = r.estado || r.status || r.state || 'unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(states).map(([name, value]) => {
    const config = getEstadoConfig(name);
    return {
      name: config.label,
      value: value as number,
      color: config.color,
    };
  });
}

export function getRecentRepairs(repairs: any[]): RepairSummary[] {
  return repairs.slice(0, 5).map((r: any) => ({
    id: r.numero_reparacion || r.id?.substring(0, 8),
    dispositivo: r.dispositivo || '\u2014',
    estado: r.estado || '\u2014',
  }));
}

export function getTopDevices(repairs: any[]): DeviceStat[] {
  const counts: Record<string, number> = {};
  for (const r of repairs) {
    const name = r.dispositivo;
    if (name && name !== '\u2014') {
      counts[name] = (counts[name] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}

export function calculateSalesData(repairs: any[], stockMovements: any[]): { name: string; ingresos: number; reparaciones: number }[] {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];

    const dayRepairs = repairs.filter((r: any) => {
      const d = toDate(r.fecha_ingreso);
      return d && isSameDay(d, date);
    });

    const repairRevenue = dayRepairs
      .filter((r: any) => r.total_reparacion)
      .reduce((sum: number, r: any) => {
        const total = typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0;
        return sum + total;
      }, 0);

    const stockRevenue = stockMovements
      .filter((m: any) => {
        const d = toDate(m.createdAt);
        const isSale = m.type === 'sale' || m.tipo === 'venta' || m.tipo === 'salida';
        return d && isSameDay(d, date) && isSale;
      })
      .reduce((sum: number, m: any) => {
        const total = typeof m.total === 'number' ? m.total : parseFloat(m.total) || 0;
        const quantity = typeof m.quantity === 'number' ? m.quantity : parseFloat(m.quantity) || 0;
        const price = typeof m.price === 'number' ? m.price : parseFloat(m.price) || 0;
        return sum + (total || quantity * price);
      }, 0);

    result.push({ name: dayName, ingresos: repairRevenue + stockRevenue, reparaciones: dayRepairs.length });
  }

  return result;
}

export function getPendingDeliveries(repairs: any[]): PendingDelivery[] {
  return repairs
    .filter((r: any) => r.estado === 'ready' || r.estado === 'completed')
    .slice(0, 5)
    .map((r: any) => {
      const deliveryDate = r.fecha_estimada_entrega ? new Date(r.fecha_estimada_entrega) : null;
      const refDate = new Date();
      const isToday = deliveryDate && isSameDay(deliveryDate, refDate);
      const tomorrow = new Date(refDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = deliveryDate && isSameDay(deliveryDate, tomorrow);
      const isLate = deliveryDate && deliveryDate < refDate && !isSameDay(deliveryDate, refDate);

      let status = 'Programado';
      if (isToday) status = 'Hoy';
      else if (isTomorrow) status = 'Mañana';
      else if (isLate) status = 'Atrasado';

      return {
        id: r.id,
        client: r.cliente?.nombre_completo || r.cliente_nombre || '\u2014',
        device: r.dispositivo || '\u2014',
        date: deliveryDate ? deliveryDate.toLocaleDateString('es-AR') : '\u2014',
        status,
      };
    });
}

export function getStockAlerts(items: any[]): { id: string; name: string; quantity: number; unit: string }[] {
  return items
    .filter((item: any) => (item.cantidad || item.quantity || 0) < 5)
    .slice(0, 5)
    .map((item: any) => ({
      id: item.id,
      name: item.nombre || item.name || '\u2014',
      quantity: item.cantidad || item.quantity || 0,
      unit: 'uds',
    }));
}

export function getRecentClients(clients: any[]): { id: string; name: string; phone: string; lastVisit: string }[] {
  return clients.slice(0, 5).map((client: any) => ({
    id: client.id,
    name: client.nombre_completo || client.nombre || '\u2014',
    phone: client.telefono || '\u2014',
    lastVisit: client.createdAt ? new Date(client.createdAt).toLocaleDateString('es-AR') : '\u2014',
  }));
}

export interface SalesBreakdown {
  stockSalesTotal: number;
  repairSalesTotal: number;
  stockSalesCount: number;
  dailyBreakdown: { name: string; stock: number; repair: number; stockCount: number }[];
}

export function calculateSalesBreakdown(repairs: any[], stockMovements: any[]): SalesBreakdown {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const dailyBreakdown = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];

    const dayRepairs = repairs.filter((r: any) => {
      const d = toDate(r.fecha_ingreso);
      return d && isSameDay(d, date);
    });
    const repairTotal = dayRepairs
      .filter((r: any) => r.total_reparacion)
      .reduce((sum: number, r: any) => sum + (typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0), 0);

    const dayStock = stockMovements.filter((m: any) => {
      const d = toDate(m.createdAt);
      const isSale = m.type === 'sale' || m.tipo === 'venta' || m.tipo === 'salida';
      return d && isSameDay(d, date) && isSale;
    });
    const stockTotal = dayStock.reduce((sum: number, m: any) => {
      const total = typeof m.total === 'number' ? m.total : parseFloat(m.total) || 0;
      const quantity = typeof m.quantity === 'number' ? m.quantity : parseFloat(m.quantity) || 0;
      const price = typeof m.price === 'number' ? m.price : parseFloat(m.price) || 0;
      return sum + (total || quantity * price);
    }, 0);

    dailyBreakdown.push({ name: dayName, stock: stockTotal, repair: repairTotal, stockCount: dayStock.length });
  }

  const stockSalesTotal = dailyBreakdown.reduce((s, d) => s + d.stock, 0);
  const repairSalesTotal = dailyBreakdown.reduce((s, d) => s + d.repair, 0);
  const stockSalesCount = stockMovements.filter((m: any) => {
    const d = toDate(m.createdAt);
    const isSale = m.type === 'sale' || m.tipo === 'venta' || m.tipo === 'salida';
    return d && d >= daysAgo(7) && isSale;
  }).length;

  return { stockSalesTotal, repairSalesTotal, stockSalesCount, dailyBreakdown };
}