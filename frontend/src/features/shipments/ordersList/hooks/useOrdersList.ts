import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Order } from '../types';

export function useOrdersList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === '' ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'Todas' || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
  const thisMonthTotal = orders
    .filter(o => {
      const now = new Date();
      const orderDate = o.issueDate;
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + o.total, 0);
  const nextDelivery = orders
    .filter(o => o.status === 'Enviada' || o.status === 'Pendiente')
    .sort((a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime())[0];
  const activeProviders = new Set(orders.map(o => o.provider)).size;

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
  }, []);

  return {
    loading, error, orders, searchQuery, setSearchQuery,
    selectedStatus, setSelectedStatus, currentPage, setCurrentPage,
    itemsPerPage, filteredOrders, totalPages, paginatedOrders,
    pendingOrders, thisMonthTotal, nextDelivery, activeProviders,
    handleRetry,
  };
}
