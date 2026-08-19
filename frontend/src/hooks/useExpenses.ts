import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '@/services/expenseService';
import { useListCache } from '@/shared/hooks/useListCache';
import { expensesCacheKey, expensesData, expensesSummaryKey, expensesSummaryData } from '@/shared/lib/dataCaches';
import { Expense, ExpenseFilters, ExpenseListMeta, ExpenseSummary } from '@/types/expense.types';

interface UseExpensesResult {
  data: Expense[];
  meta: ExpenseListMeta | null;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useExpenses = (filters?: ExpenseFilters): UseExpensesResult => {
  const { data: result, loading, error, refresh } = useListCache<{ expenses: Expense[]; meta: ExpenseListMeta | null }>(
    expensesCacheKey(filters),
    () => expensesData(filters),
  );

  return {
    data: result?.expenses ?? [],
    meta: result?.meta ?? null,
    total: result?.meta?.total ?? result?.expenses.length ?? 0,
    totalPages: result?.meta?.totalPages ?? 1,
    loading,
    error,
    refetch: refresh,
  };
};

export const useExpense = (id: string) => {
  const [data, setData] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getById(id);
      setData(response);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar el gasto');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useExpenseSummary = () => {
  const { data, loading, error, refresh } = useListCache<ExpenseSummary>(
    expensesSummaryKey(),
    () => expensesSummaryData(),
  );

  return { data, loading, error, refetch: refresh };
};
