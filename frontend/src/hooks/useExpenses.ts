import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '@/services/expenseService';
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
  const [data, setData] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<ExpenseListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractExpenses = useCallback((response: unknown): { expenses: Expense[]; meta: ExpenseListMeta | null } => {
    const r = response as Record<string, unknown>;
    const inner = r?.data as Record<string, unknown> | undefined;
    let arr = inner?.data as Expense[] | undefined;
    let innerMeta = (inner?.meta as ExpenseListMeta | undefined) || null;
    if (!Array.isArray(arr)) {
      arr = inner as unknown as Expense[];
    }
    if (!Array.isArray(arr)) {
      arr = [];
    }
    return { expenses: arr, meta: innerMeta };
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.list(filters);
      const { expenses, meta: responseMeta } = extractExpenses(response);
      setData(expenses);
      setMeta(responseMeta);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar gastos');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, extractExpenses]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    meta,
    total: meta?.total ?? data.length,
    totalPages: meta?.totalPages ?? 1,
    loading,
    error,
    refetch: fetch,
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
  const [data, setData] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseService.getSummary();
      const r = response as Record<string, unknown>;
      setData((r?.data as ExpenseSummary | undefined) ?? (response as ExpenseSummary));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message || e?.message || 'Error al cargar el resumen de gastos');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
