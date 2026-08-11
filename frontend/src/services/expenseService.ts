import api from './api';
import {
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  ExpenseFilters,
  ExpenseListResponse,
  ExpenseSummary,
} from '@/types/expense.types';

export const expenseService = {
  // Listar gastos con paginación y filtros
  list: (filters?: ExpenseFilters): Promise<ExpenseListResponse> => {
    return api.get('/expenses', { params: filters }).then(res => res.data);
  },

  // Obtener un gasto por ID
  getById: (id: string): Promise<Expense> => {
    return api.get(`/expenses/${id}`).then(res => res.data);
  },

  // Crear un nuevo gasto
  create: (data: ExpenseCreate): Promise<Expense> => {
    return api.post('/expenses', data).then(res => res.data);
  },

  // Actualizar un gasto existente
  update: (id: string, data: ExpenseUpdate): Promise<Expense> => {
    return api.put(`/expenses/${id}`, data).then(res => res.data);
  },

  // Eliminar un gasto
  delete: (id: string): Promise<{ message: string }> => {
    return api.delete(`/expenses/${id}`).then(res => res.data);
  },

  // Obtener resumen de gastos (KPIs)
  getSummary: (): Promise<ExpenseSummary> => {
    return api.get('/expenses/summary').then(res => res.data);
  },

  // Obtener categorías de gastos
  getCategories: (): Promise<string[]> => {
    return api.get('/expenses/categories').then(res => res.data);
  },
};
