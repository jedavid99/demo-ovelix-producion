import { useState, useEffect, useMemo } from 'react';
import type { ServiceOrder, SendOrderModalProps } from '../types';

export function useSendOrderModal({ open, availableOrders, onSend, onClose }: SendOrderModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setSelectedOrderId(null);
    }
  }, [open]);

  const filteredOrders = useMemo(() => {
    return availableOrders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.device.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableOrders, searchTerm]);

  const handleSend = () => {
    if (selectedOrderId) {
      const order = availableOrders.find((o) => o.id === selectedOrderId);
      if (order) {
        onSend(order);
        setSelectedOrderId(null);
        onClose();
      }
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm, setSearchTerm, selectedOrderId, setSelectedOrderId,
    filteredOrders, handleSend, formatCurrency, clearSearch,
  };
}
