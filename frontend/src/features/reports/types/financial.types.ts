export interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: 'Ingreso' | 'Egreso';
  category: string;
  amount: number;
}

export interface CashFlow {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface EvolutionData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface ExpenseCategory {
  name: string;
  value: number;
}

export type PeriodOption = 'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado';
