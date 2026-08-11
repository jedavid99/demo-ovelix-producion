import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { useSendOrderModal } from './hooks/useSendOrderModal';
import { ModalHeader } from './components/ModalHeader';
import { SearchBar } from './components/SearchBar';
import { OrdersList } from './components/OrdersList';
import { ModalFooter } from './components/ModalFooter';
import type { SendOrderModalProps } from './types';

export function SendOrderModal({ open, onClose, onSend, availableOrders, loading = false, error = null }: SendOrderModalProps) {
  const {
    searchTerm, setSearchTerm, selectedOrderId, setSelectedOrderId,
    filteredOrders, handleSend, formatCurrency, clearSearch,
  } = useSendOrderModal({ open, availableOrders, onSend, onClose });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-background border-border  shadow-xl rounded-xl overflow-hidden">
        <ModalHeader />

        <div className="p-6 space-y-4">
          <SearchBar value={searchTerm} onChange={setSearchTerm} onClear={clearSearch} />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {filteredOrders.length} {filteredOrders.length === 1 ? 'orden encontrada' : 'ordenes encontradas'}
            </span>
            {searchTerm && filteredOrders.length === 0 && (
              <span className="text-destructive/70">No coincide con la busqueda</span>
            )}
          </div>

          <OrdersList
            orders={filteredOrders} selectedOrderId={selectedOrderId} searchTerm={searchTerm}
            loading={loading} error={error} open={open}
            onSelect={setSelectedOrderId} formatCurrency={formatCurrency}
          />
        </div>

        <ModalFooter hasSelection={!!selectedOrderId} onCancel={onClose} onSend={handleSend} />
      </DialogContent>
    </Dialog>
  );
}
