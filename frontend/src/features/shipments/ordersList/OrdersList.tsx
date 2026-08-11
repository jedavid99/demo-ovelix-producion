import { motion } from 'framer-motion';
import { useOrdersList } from './hooks/useOrdersList';
import { OrdersListHeader } from './components/OrdersListHeader';
import { OrderFilters } from './components/OrderFilters';
import { KPICards } from './components/KPICards';
import { OrdersTable } from './components/OrdersTable';
import { OrdersPagination } from './components/OrdersPagination';
import { ErrorState } from './components/ErrorState';
import { format } from 'date-fns';
import { exportToCSV } from '@/shared/lib/export';

const OrdersList = () => {
  const {
    loading, error, orders, searchQuery, setSearchQuery,
    selectedStatus, setSelectedStatus, currentPage, setCurrentPage,
    itemsPerPage, filteredOrders, totalPages, paginatedOrders,
    pendingOrders, thisMonthTotal, nextDelivery, activeProviders,
    handleRetry,
  } = useOrdersList();

  if (error) return <ErrorState onRetry={handleRetry} />;

  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      'Nº Orden': order.orderNumber,
      'Proveedor': order.provider,
      'Fecha Emisión': format(order.issueDate, 'dd/MM/yyyy'),
      'Fecha Entrega': format(order.deliveryDate, 'dd/MM/yyyy'),
      'Total': order.total,
      'Estado': order.status,
    }));
    exportToCSV(exportData, 'ordenes-compra');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <OrdersListHeader />
      <OrderFilters
        searchQuery={searchQuery}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchQuery}
        onStatusChange={setSelectedStatus}
        onExport={handleExport}
      />
      <KPICards
        pendingOrders={pendingOrders}
        thisMonthTotal={thisMonthTotal}
        nextDeliveryLabel={nextDelivery ? format(nextDelivery.deliveryDate, 'dd/MM') : '-'}
        activeProviders={activeProviders}
      />
      <OrdersTable
        loading={loading}
        orders={orders}
        paginatedOrders={paginatedOrders}
        filteredOrders={filteredOrders}
      />
      {!loading && filteredOrders.length > 0 && (
        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={(currentPage - 1) * itemsPerPage + 1}
          endIndex={Math.min(currentPage * itemsPerPage, filteredOrders.length)}
          totalFiltered={filteredOrders.length}
          onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        />
      )}
    </motion.div>
  );
};

export default OrdersList;
