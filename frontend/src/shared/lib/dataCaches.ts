import { getListCache } from '@/shared/lib/listCache';
import { clientService } from '@/services/clientService';
import { saleService } from '@/services/saleService';
import { expenseService } from '@/services/expenseService';
import { stockService } from '@/services/stockService';
import { budgetRequestsApi } from '@/features/budgetRequests/services/budgetRequestsApi';
import { repairCostsApi } from '@/features/repairCosts/services/repairCostsApi';
import { settingsApi } from '@/features/settings/services/settingsApi';
import type { Client } from '@/features/clients/types/clients.types';
import type { Sale, SaleFilters, SaleListMeta } from '@/types/sale.types';
import type { Expense, ExpenseFilters, ExpenseListMeta, ExpenseSummary } from '@/types/expense.types';
import type { StockItem } from '@/types/stock.types';
import type { iPhone, SeriesOption } from '@/features/products/iPhoneInventoryList/types';
import type { BudgetRequest } from '@/features/budgetRequests/types/budgetRequests.types';
import type { RepairCost, TaxRate } from '@/features/repairCosts/types/repairCosts.types';

export function clientsCacheKey(): string {
  return 'clients:list';
}

export async function clientsData(): Promise<Client[]> {
  const response = (await clientService.list({ page: 1, limit: 100 })) as unknown as Record<string, unknown>;
  const d = response?.data as Record<string, unknown> | undefined;
  let arr = d?.data as Client[] | undefined;
  if (!Array.isArray(arr)) arr = d?.clientes as Client[] | undefined;
  if (!Array.isArray(arr)) arr = d as unknown as Client[];
  return Array.isArray(arr) ? arr : [];
}

export function salesCacheKey(filters?: SaleFilters): string {
  return `sales:${JSON.stringify(filters ?? {})}`;
}

export async function salesData(filters?: SaleFilters): Promise<{ sales: Sale[]; meta: SaleListMeta | null }> {
  const response = (await saleService.list(filters)) as unknown as Record<string, unknown>;
  const inner = response?.data as Record<string, unknown> | undefined;
  let arr = inner?.data as Sale[] | undefined;
  const innerMeta = (inner?.meta as SaleListMeta | undefined) ?? null;
  if (!Array.isArray(arr)) arr = inner as unknown as Sale[];
  return { sales: Array.isArray(arr) ? arr : [], meta: innerMeta };
}

export function expensesCacheKey(filters?: ExpenseFilters): string {
  return `expenses:${JSON.stringify(filters ?? {})}`;
}

export async function expensesData(filters?: ExpenseFilters): Promise<{ expenses: Expense[]; meta: ExpenseListMeta | null }> {
  const response = (await expenseService.list(filters)) as unknown as Record<string, unknown>;
  const inner = response?.data as Record<string, unknown> | undefined;
  let arr = inner?.data as Expense[] | undefined;
  const innerMeta = (inner?.meta as ExpenseListMeta | undefined) ?? null;
  if (!Array.isArray(arr)) arr = inner as unknown as Expense[];
  return { expenses: Array.isArray(arr) ? arr : [], meta: innerMeta };
}

export function expensesSummaryKey(): string {
  return 'expenses:summary';
}

export async function expensesSummaryData(): Promise<ExpenseSummary> {
  const response = (await expenseService.getSummary()) as unknown as Record<string, unknown>;
  return (response?.data as ExpenseSummary | undefined) ?? (response as unknown as ExpenseSummary);
}

function mapStockItemToIPhone(item: StockItem): iPhone {
  const outOfStock = item.estado !== 'activo' || item.stock_actual <= 0;
  return {
    id: item.id,
    model: item.modelo || item.nombre,
    color: '',
    modelNumber: item.modelo || '',
    storage: '',
    imei: item.codigo,
    battery: 0,
    status: outOfStock ? 'Out of Stock' : 'Available',
    image: null,
  };
}

export function stockIPhoneCacheKey(search: string, series: SeriesOption): string {
  return `stock:iphone:${search}:${series}`;
}

export async function stockIPhoneData(search: string, series: SeriesOption): Promise<iPhone[]> {
  const response = (await stockService.list({
    page: 1,
    limit: 200,
    search: search || undefined,
    categoria: series !== 'All' ? series : undefined,
  })) as unknown as Record<string, unknown>;
  const inner = response?.data as Record<string, unknown> | undefined;
  const arr = (inner?.data as StockItem[] | undefined) ?? (inner as unknown as StockItem[]);
  return (Array.isArray(arr) ? arr : []).map(mapStockItemToIPhone);
}

export function budgetRequestsCacheKey(page: number, limit: number, estado?: string): string {
  return `budget-requests:${page}:${limit}:${estado ?? 'all'}`;
}

export async function budgetRequestsData(
  page: number,
  limit: number,
  estado?: string,
): Promise<{ data: BudgetRequest[]; total: number }> {
  const res = await budgetRequestsApi.getRequests({ page, limit, estado });
  return { data: res.data, total: res.meta.total };
}

export function repairCostsCacheKey(): string {
  return 'repair-costs';
}

export async function repairCostsData(): Promise<{ costs: RepairCost[]; taxRates: TaxRate[] }> {
  const [costsData, ratesData] = await Promise.all([repairCostsApi.getRepairCosts(), settingsApi.getTaxRates()]);
  return {
    costs: costsData,
    taxRates: (ratesData || []).map((r: TaxRate) => ({ ...r, porcentaje: Number(r.porcentaje) || 0 })),
  };
}

export function warmDataCaches(): void {
  getListCache<Client[]>(clientsCacheKey()).fetch(() => clientsData()).catch(() => {});
  getListCache<{ sales: Sale[]; meta: SaleListMeta | null }>(salesCacheKey({ page: 1, limit: 10 }))
    .fetch(() => salesData({ page: 1, limit: 10 }))
    .catch(() => {});
  getListCache<ExpenseSummary>(expensesSummaryKey()).fetch(() => expensesSummaryData()).catch(() => {});
  getListCache<iPhone[]>(stockIPhoneCacheKey('', 'All')).fetch(() => stockIPhoneData('', 'All')).catch(() => {});
  getListCache<{ data: BudgetRequest[]; total: number }>(budgetRequestsCacheKey(1, 20))
    .fetch(() => budgetRequestsData(1, 20))
    .catch(() => {});
  getListCache<{ costs: RepairCost[]; taxRates: TaxRate[] }>(repairCostsCacheKey())
    .fetch(() => repairCostsData())
    .catch(() => {});
}