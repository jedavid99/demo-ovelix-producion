import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';
import type { RepairData } from '../types';

const getErrorMessage = (err: unknown): string => {
  const status = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return status || 'No se encontr\u00F3 ninguna reparaci\u00F3n con ese n\u00FAmero de orden';
};

export function useRepairStatus() {
  const [searchParams] = useSearchParams();
  const orderFromQR = searchParams.get('order')?.trim() ?? '';
  const [orderNumber, setOrderNumber] = useState(orderFromQR);
  const [isLoading, setIsLoading] = useState(Boolean(orderFromQR));
  const [repairData, setRepairData] = useState<RepairData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderFromQR) return;
    let cancelled = false;
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/repairs/public/${encodeURIComponent(orderFromQR)}`);
        if (cancelled) return;
        setRepairData(response.data.data);
      } catch (err: unknown) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [orderFromQR]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Por favor ingrese el n\u00FAmero de orden');
      return;
    }

    setIsLoading(true);
    setError('');
    setRepairData(null);

    try {
      const response = await axios.get(`${API_URL}/repairs/public/${orderNumber.trim()}`);
      setRepairData(response.data.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { orderNumber, setOrderNumber, isLoading, repairData, error, handleSearch };
}
