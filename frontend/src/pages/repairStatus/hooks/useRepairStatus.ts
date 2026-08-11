import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';
import type { RepairData } from '../types';

export function useRepairStatus() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const orderFromQR = searchParams.get('order');
    if (orderFromQR) {
      setOrderNumber(orderFromQR);
      handleSearch(undefined, orderFromQR);
    }
  }, [searchParams]);

  const handleSearch = async (e?: React.FormEvent, overrideOrder?: string) => {
    if (e) e.preventDefault();
    const searchOrder = overrideOrder || orderNumber;

    if (!searchOrder.trim()) {
      setError('Por favor ingrese el n\u00FAmero de orden');
      return;
    }

    setIsLoading(true);
    setError('');
    setRepairData(null);

    try {
      const response = await axios.get(`${API_URL}/repairs/public/${searchOrder.trim()}`);
      setRepairData(response.data.data?.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'No se encontr\u00F3 ninguna reparaci\u00F3n con ese n\u00FAmero de orden');
    } finally {
      setIsLoading(false);
    }
  };

  return { orderNumber, setOrderNumber, isLoading, repairData, error, handleSearch };
}
