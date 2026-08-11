import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Order, OrderItem, StatusChange } from '../types';

export function useOrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [id]);

  const handleMarkAsReceived = () => {
    if (order) {
      const updatedOrder = { ...order, status: 'Recibida' as const, actualDeliveryDate: new Date() };
      setOrder(updatedOrder);
      setStatusHistory(prev => [
        ...prev,
        { status: 'Recibida', date: new Date(), notes: 'Marcada como recibida' },
      ]);
    }
  };

  const handleCancelOrder = () => {
    if (order) {
      const updatedOrder = { ...order, status: 'Cancelada' as const };
      setOrder(updatedOrder);
      setStatusHistory(prev => [
        ...prev,
        { status: 'Cancelada', date: new Date(), notes: 'Orden cancelada' },
      ]);
      setShowCancelDialog(false);
    }
  };

  const canEdit = !!(order && (order.status === 'Pendiente' || order.status === 'Enviada'));
  const canMarkAsReceived = !!(order && order.status === 'Enviada');
  const canCancel = !!(order && (order.status === 'Pendiente' || order.status === 'Enviada'));

  return {
    loading, order, items, statusHistory, showCancelDialog,
    setShowCancelDialog, handleMarkAsReceived, handleCancelOrder,
    canEdit, canMarkAsReceived, canCancel,
  };
}
