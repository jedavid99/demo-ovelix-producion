export interface RepairSummary {
  id: string;
  dispositivo: string;
  estado: string;
}

export interface DailyActivity {
  id: string;
  type: 'Stock' | 'Reparación' | 'Cliente' | 'WhatsApp' | string;
  description: string;
  quantity: number;
  time: string;
}

export interface ChartDataPoint {
  name: string;
  ingresos: number;
  reparaciones: number;
}

export interface RepairStateData {
  name: string;
  value: number;
  color: string;
}

export interface PendingDelivery {
  id: string;
  client: string;
  device: string;
  date: string;
  status: 'Hoy' | 'Mañana' | 'Atrasado' | string;
}

export interface StockAlert {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecentClient {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
}

export interface DashboardStats {
  totalActiveOrders: number;
  totalToDeliver: number;
  totalRevenueToday: number;
  totalRepaired: number;
  totalProfit30d: number;
}

export interface DeviceStat {
  name: string;
  count: number;
}

export interface KpiTrends {
  ordersTrend: number;
  revenueTrend: number;
  repairedTrend: number;
}
