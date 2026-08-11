import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/components/ui/use-toast';
import { expenseService } from '@/services/expenseService';
import type { ExpenseForm } from '../types';
import type { MetodoPagoGasto } from '@/types/expense.types';

const PAYMENT_METHOD_MAP: Record<string, MetodoPagoGasto> = {
  cash: 'efectivo',
  card: 'tarjeta',
  bank: 'transferencia',
};

export function useExpensesAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ExpenseForm>({
    title: '', amount: '', currency: 'USD', date: '', category: '', supplier: '', paymentMethod: 'cash',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'La descripción es obligatoria';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
    if (!form.date) newErrors.date = 'La fecha es obligatoria';
    if (!form.category) newErrors.category = 'La categoría es obligatoria';
    if (!form.supplier) newErrors.supplier = 'El proveedor es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await expenseService.create({
        descripcion: form.title.trim(),
        categoria: form.category,
        proveedor: form.supplier,
        monto: parseFloat(form.amount),
        moneda: form.currency,
        metodo_pago: PAYMENT_METHOD_MAP[form.paymentMethod] || 'efectivo',
        fecha: new Date(form.date).toISOString(),
      });
      toast({ title: 'Éxito', description: 'Gasto registrado correctamente' });
      navigate('/expenses');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast({
        title: 'Error',
        description: e?.response?.data?.message || e?.message || 'No se pudo registrar el gasto',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form, file, isLoading, errors, handleChange, handleFileChange, handleSubmit, navigate,
    setFile,
  };
}
