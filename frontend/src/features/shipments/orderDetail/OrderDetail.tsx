import { motion } from 'framer-motion';
import { useOrderDetail } from './hooks/useOrderDetail';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { NotFoundState } from './components/NotFoundState';
import { OrderHeader } from './components/OrderHeader';
import { GeneralDataCard } from './components/GeneralDataCard';
import { ProductsTable } from './components/ProductsTable';
import { StatusTimeline } from './components/StatusTimeline';
import { OrderActions } from './components/OrderActions';
import { CancelDialog } from './components/CancelDialog';

const OrderDetail = () => {
  const {
    loading, order, items, statusHistory, showCancelDialog,
    setShowCancelDialog, handleMarkAsReceived, handleCancelOrder,
    canEdit, canMarkAsReceived, canCancel,
  } = useOrderDetail();

  if (loading) return <LoadingState />;
  if (!order) return <NotFoundState />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <OrderHeader order={order} />
      <GeneralDataCard order={order} />
      <ProductsTable items={items} total={order.total} />
      <StatusTimeline history={statusHistory} />
      <OrderActions
        order={order}
        canEdit={canEdit}
        canMarkAsReceived={canMarkAsReceived}
        canCancel={canCancel}
        onMarkAsReceived={handleMarkAsReceived}
        onCancelRequest={() => setShowCancelDialog(true)}
      />
      <CancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelOrder}
      />
    </motion.div>
  );
};

export default OrderDetail;
