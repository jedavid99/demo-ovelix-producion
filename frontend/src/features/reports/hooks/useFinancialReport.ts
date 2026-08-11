import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, subDays, startOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { financialApi } from '../services/financialApi';
import type { Transaction, CashFlow, EvolutionData, ExpenseCategory, PeriodOption } from '../types/financial.types';

export function useFinancialReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<PeriodOption>('30 días');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const repairsArray = await financialApi.getRepairs();
      let stockMovementsArray: any[] = [];
      try { stockMovementsArray = await financialApi.getStockMovements(); } catch (err) { console.error('Error fetching stock movements:', err); }

      const incomeTx: Transaction[] = repairsArray.map((r: any) => ({
        id: `repair-${r.id}`,
        date: r.fecha_ingreso ? new Date(r.fecha_ingreso) : new Date(r.createdAt),
        description: `Reparación: ${r.dispositivo} - ${r.cliente?.nombre_completo || r.cliente?.nombre || 'Cliente'}`,
        type: 'Ingreso' as const,
        category: 'Reparaciones',
        amount: typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0,
      }));

      const stockTx: Transaction[] = stockMovementsArray.map((m: any) => {
        const isSale = m.type === 'sale' || m.tipo === 'venta' || m.tipo === 'salida';
        const isPurchase = m.type === 'purchase' || m.tipo === 'compra' || m.tipo === 'entrada';
        const total = typeof m.total === 'number' ? m.total : parseFloat(m.total) || 0;
        const quantity = typeof m.quantity === 'number' ? m.quantity : parseFloat(m.quantity) || 0;
        const price = typeof m.price === 'number' ? m.price : parseFloat(m.price) || 0;
        const amount = total || (quantity * price);
        return {
          id: `stock-${m.id}`,
          date: m.createdAt ? new Date(m.createdAt) : new Date(),
          description: m.description || m.descripcion || m.product_name || 'Movimiento de stock',
          type: isSale ? 'Ingreso' as const : 'Egreso' as const,
          category: isSale ? 'Ventas Stock' : isPurchase ? 'Compras Stock' : 'Stock',
          amount,
        };
      });

      const allTx = [...incomeTx, ...stockTx];
      setTransactions(allTx);

      const cashFlowMap = new Map<string, { income: number; expense: number }>();
      allTx.forEach((t) => {
        const monthKey = format(t.date, 'MMM', { locale: es });
        const existing = cashFlowMap.get(monthKey) || { income: 0, expense: 0 };
        if (t.type === 'Ingreso') existing.income += t.amount;
        else existing.expense += t.amount;
        cashFlowMap.set(monthKey, existing);
      });

      setCashFlow(
        Array.from(cashFlowMap.entries())
          .map(([month, data]) => ({ month, income: data.income, expense: data.expense, balance: data.income - data.expense }))
          .slice(-3)
      );
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (period === 'Personalizado' && customRange.start && customRange.end) {
        const transDate = new Date(transaction.date);
        return transDate >= new Date(customRange.start) && transDate <= new Date(customRange.end);
      }
      const now = new Date();
      switch (period) {
        case 'Hoy': return transaction.date.toDateString() === now.toDateString();
        case '7 días': return transaction.date >= subDays(now, 7);
        case '30 días': return transaction.date >= subDays(now, 30);
        case 'Este año': return transaction.date >= startOfYear(now);
        default: return true;
      }
    });
  }, [transactions, period, customRange]);

  const totalIncome = useMemo(() => filteredTransactions.filter(t => t.type === 'Ingreso').reduce((s, t) => s + t.amount, 0), [filteredTransactions]);
  const totalExpense = useMemo(() => filteredTransactions.filter(t => t.type === 'Egreso').reduce((s, t) => s + t.amount, 0), [filteredTransactions]);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const evolutionData: EvolutionData[] = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const dateStr = format(tx.date, 'dd/MM', { locale: es });
      const existing = acc.find(d => d.date === dateStr);
      if (existing) {
        if (tx.type === 'Ingreso') existing.income += tx.amount;
        else existing.expense += tx.amount;
        existing.balance = existing.income - existing.expense;
      } else {
        acc.push({
          date: dateStr,
          income: tx.type === 'Ingreso' ? tx.amount : 0,
          expense: tx.type === 'Egreso' ? tx.amount : 0,
          balance: tx.type === 'Ingreso' ? tx.amount : -tx.amount,
        });
      }
      return acc;
    }, [] as EvolutionData[]).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const expenseData: ExpenseCategory[] = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'Egreso')
      .reduce((acc, tx) => {
        const existing = acc.find(c => c.name === tx.category);
        if (existing) existing.value += tx.amount;
        else acc.push({ name: tx.category, value: tx.amount });
        return acc;
      }, [] as ExpenseCategory[]);
  }, [filteredTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const pageIncome = paginatedTransactions.filter(t => t.type === 'Ingreso').reduce((s, t) => s + t.amount, 0);
  const pageExpense = paginatedTransactions.filter(t => t.type === 'Egreso').reduce((s, t) => s + t.amount, 0);

  const handleRetry = () => loadData();

  return {
    loading, error, period, setPeriod,
    customRange, setCustomRange,
    currentPage, setCurrentPage,
    transactions, cashFlow,
    filteredTransactions, totalIncome, totalExpense, netProfit, profitMargin,
    evolutionData, expenseData,
    totalPages, paginatedTransactions, pageIncome, pageExpense,
    itemsPerPage, handleRetry,
  };
}
