import { CreditCard, DollarSign } from 'lucide-react';
import type { PaymentMethod } from '../../types/sales/sales.types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Tarjeta de crédito/débito', icon: CreditCard },
  { id: 'cash', label: 'Efectivo contra entrega', icon: DollarSign },
];

export const STEPS = [1, 2, 3, 4] as const;

export const calculateTotals = (
  cart: { price: number; quantity: number; id: string }[],
  insurancePlans: { id: string; price: number }[],
  insuranceSelection: Record<string, string>
) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const insuranceTotal = cart.reduce((sum, item) => {
    const plan = insurancePlans.find(p => p.id === insuranceSelection[item.id]);
    return sum + (plan ? plan.price * item.quantity : 0);
  }, 0);
  const total = subtotal + tax + insuranceTotal;
  return { subtotal, tax, insuranceTotal, total };
};
