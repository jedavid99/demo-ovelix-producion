import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ExpensesHeader } from './components/ExpensesHeader';
import { ExpenseKPIs } from './components/ExpenseKPIs';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseTable } from './components/ExpenseTable';
import { CategorySidebar } from './components/CategorySidebar';
import { useExpenses, useExpenseSummary } from '@/hooks/useExpenses';
import type { Expense } from '@/types/expense.types';

const CATEGORY_COLORS: Record<string, string> = {
  spare_parts: 'blue',
  utilities: 'purple',
  rent: 'rose',
  salaries: 'amber',
  marketing: 'blue',
  other: 'outline',
};

function dateRange(filter: string): { fecha_desde?: string; fecha_hasta?: string } {
  const now = new Date();
  const to = now.toISOString();
  switch (filter) {
    case 'this-month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      return { fecha_desde: from, fecha_hasta: to };
    }
    case 'last-quarter': {
      const from = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
      return { fecha_desde: from, fecha_hasta: to };
    }
    case 'last-30':
    default: {
      const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      return { fecha_desde: from, fecha_hasta: to };
    }
  }
}

function mapExpenseToView(e: Expense) {
  return {
    id: e.id,
    date: formatDate(e.fecha),
    description: e.descripcion,
    category: e.categoria,
    categoryColor: CATEGORY_COLORS[e.categoria] || 'outline',
    supplier: e.proveedor || '—',
    amount: Number(e.monto) || 0,
    status: e.estado === 'pendiente' ? 'Pending' : 'Paid',
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Expenses() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('last-30');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const { data, totalPages, total, loading, error, refetch } = useExpenses({
    page: 1,
    limit: 50,
    ...dateRange(dateFilter),
    categoria: categoryFilter !== 'all' ? categoryFilter : undefined,
    metodo_pago: paymentFilter !== 'all' ? paymentFilter : undefined,
  });
  const { data: summary } = useExpenseSummary();

  const expenses = data.map(mapExpenseToView);

  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <ExpensesHeader onAddNew={() => navigate('/expenses/add')} />
      <ExpenseKPIs
        totalMonth={summary?.totalMonth ?? totalSpent}
        pendingCount={summary?.pendingCount ?? 0}
        pendingApproval={summary?.pendingCount ?? 0}
        topCategory={summary?.topCategory?.categoria}
        totalSpent={summary?.totalSpent ?? totalSpent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <ExpenseFilters
                dateFilter={dateFilter}
                categoryFilter={categoryFilter}
                paymentFilter={paymentFilter}
                onDateChange={setDateFilter}
                onCategoryChange={setCategoryFilter}
                onPaymentChange={setPaymentFilter}
              />
            </CardContent>
          </Card>
          <ExpenseTable
            expenses={expenses}
            onAddNew={() => navigate('/expenses/add')}
            loading={loading}
            error={error}
            onRetry={refetch}
            totalCount={total}
            totalPages={totalPages}
          />
        </div>
        <CategorySidebar expenses={expenses} categoryTotals={summary?.categoryTotals ?? categoryTotals} totalSpent={summary?.totalSpent ?? totalSpent} />
      </div>
    </div>
  );
}
