import { motion } from 'framer-motion';
import { MdRefresh, MdSave } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { useOrderForm } from '../hooks/useOrderForm';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { OrderHeader } from '../components/OrderHeader';
import { OrderDataCard } from '../components/OrderDataCard';
import { OrderItemsTable } from '../components/OrderItemsTable';
import { OrderSummary } from '../components/OrderSummary';

export default function OrderFormPage() {
  const {
    loading, saving, isEditing, errors, orderNumber, providerId, issueDate, deliveryDate, status, notes, items,
    subtotal, total,
    setOrderNumber, setProviderId, setIssueDate, setDeliveryDate, setStatus, setNotes,
    addItem, removeItem, updateItem, handleSubmit, navigate,
  } = useOrderForm();

  if (loading) return <LoadingSkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 max-w-5xl mx-auto">
      <OrderHeader isEditing={isEditing} onBack={() => navigate('/providers/orders')} />
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <OrderDataCard
            orderNumber={orderNumber} providerId={providerId} issueDate={issueDate}
            deliveryDate={deliveryDate} status={status} notes={notes} errors={errors}
            onOrderNumberChange={setOrderNumber} onProviderChange={setProviderId}
            onIssueDateChange={setIssueDate} onDeliveryDateChange={setDeliveryDate}
            onStatusChange={setStatus} onNotesChange={setNotes}
          />
          <OrderItemsTable items={items} errors={errors} onUpdateItem={updateItem} onRemoveItem={removeItem} onAddItem={addItem} />
          <OrderSummary subtotal={subtotal} total={total} />
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/providers/orders')} disabled={saving}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><MdRefresh className="mr-2 animate-spin" /> Guardando...</> : <><MdSave className="mr-2" /> Guardar orden</>}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
