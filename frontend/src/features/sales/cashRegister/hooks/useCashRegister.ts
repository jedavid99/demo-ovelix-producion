import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/components/ui/use-toast';
import { useCashClosingMutations, useCashClosingByDate } from '@/hooks/useCashClosing';
import { cashClosingService } from '@/services/cashClosingService';
import { CashClosingData } from '@/types/cashClosing.types';
import type { CashForm } from '../types';

interface DailySummary {
  total_efectivo: number;
  total_tarjeta: number;
  total_transferencia: number;
  total_ventas: number;
  transactions_count: number;
}

export function useCashRegister() {
  const navigate = useNavigate();
  const { createCashClosing, updateCashClosing } = useCashClosingMutations();
  const today = new Date().toISOString().split('T')[0];
  const { data: existingClosing } = useCashClosingByDate(today);

  const [cash, setCash] = useState<CashForm>({
    bills100: '', bills50: '', bills20: '', bills10: '',
    bills5: '', bills1: '', other: '', notes: '',
  });

  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const data = await cashClosingService.getDailySummary(today);
      setSummary(data);
    } catch {
      setSummary({ total_efectivo: 0, total_tarjeta: 0, total_transferencia: 0, total_ventas: 0, transactions_count: 0 });
    } finally {
      setLoadingSummary(false);
    }
  }, [today]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  useEffect(() => {
    if (existingClosing) {
      const bc = existingClosing.bills_count ?? {};
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCash({
        bills100: bc.bills100?.toString() ?? '',
        bills50: bc.bills50?.toString() ?? '',
        bills20: bc.bills20?.toString() ?? '',
        bills10: bc.bills10?.toString() ?? '',
        bills5: bc.bills5?.toString() ?? '',
        bills1: bc.bills1?.toString() ?? '',
        other: bc.other?.toString() ?? '',
        notes: existingClosing.notes || '',
      });
    }
  }, [existingClosing]);

  const expectedBalance = summary?.total_efectivo ?? 0;
  const transactions = summary?.transactions_count ?? 0;

  const calculateActualTotal = () => {
    const b100 = (parseFloat(cash.bills100) || 0) * 100;
    const b50 = (parseFloat(cash.bills50) || 0) * 50;
    const b20 = (parseFloat(cash.bills20) || 0) * 20;
    const b10 = (parseFloat(cash.bills10) || 0) * 10;
    const b5 = (parseFloat(cash.bills5) || 0) * 5;
    const b1 = (parseFloat(cash.bills1) || 0) * 1;
    const other = parseFloat(cash.other) || 0;
    return b100 + b50 + b20 + b10 + b5 + b1 + other;
  };

  const actualTotal = calculateActualTotal();
  const discrepancy = actualTotal - expectedBalance;
  const hasDiscrepancy = discrepancy !== 0;

  const handleChange = (field: string, value: string) => {
    setCash(prev => ({ ...prev, [field]: value }));
  };

  const buildClosingData = (): CashClosingData => ({
    date: today,
    store_id: '',
    cashier: '',
    expected_balance: expectedBalance,
    actual_balance: actualTotal,
    discrepancy,
    transactions_count: transactions,
    bills_count: {
      bills100: parseFloat(cash.bills100) || 0,
      bills50: parseFloat(cash.bills50) || 0,
      bills20: parseFloat(cash.bills20) || 0,
      bills10: parseFloat(cash.bills10) || 0,
      bills5: parseFloat(cash.bills5) || 0,
      bills1: parseFloat(cash.bills1) || 0,
      other: parseFloat(cash.other) || 0,
    },
    notes: cash.notes,
  });

  const handleSaveProgress = async () => {
    const closingData = buildClosingData();
    if (existingClosing?.id) {
      await updateCashClosing(existingClosing.id, closingData);
    } else {
      await createCashClosing(closingData);
    }
  };

  const handleFinalize = async () => {
    const closingData = buildClosingData();
    const result = existingClosing?.id
      ? await updateCashClosing(existingClosing.id, closingData)
      : await createCashClosing(closingData);
    if (result) {
      toast({ title: 'Éxito', description: `Cierre de caja finalizado. Diferencia: $${discrepancy.toFixed(2)}` });
      navigate('/reports');
    }
  };

  return {
    cash, expectedBalance, transactions, actualTotal, discrepancy, hasDiscrepancy,
    summary, loadingSummary,
    handleChange, handleSaveProgress, handleFinalize,
  };
}
