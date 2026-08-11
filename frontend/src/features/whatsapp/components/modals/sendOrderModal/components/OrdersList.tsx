import type { ReactNode } from 'react';
import { CheckCircle, Clock, AlertCircle, X, User, Smartphone, Calendar, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/utils';
import { ErrorState } from '@/shared/components/async/ErrorState';
import { EmptyState } from '@/shared/components/async/EmptyState';
import type { ServiceOrder } from '../types';

interface OrdersListProps {
  orders: ServiceOrder[];
  selectedOrderId: string | null;
  searchTerm: string;
  loading: boolean;
  error: string | null | undefined;
  open: boolean;
  onSelect: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

export function OrdersList({ orders, selectedOrderId, searchTerm, loading, error, open, onSelect, formatCurrency }: OrdersListProps) {
  return (
    <ScrollArea className="h-64 pr-2 -mr-2">
      {error ? (
        <ErrorState message={error} className="h-full" />
      ) : loading || (open && orders.length === 0) ? (
        <LoadingSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={searchTerm ? 'No se encontraron ordenes' : 'No hay ordenes disponibles'}
          description={searchTerm ? 'Intenta con otra busqueda' : 'Crea una nueva orden de servicio primero'}
          className="h-full"
        />
      ) : (
        <RadioGroup value={selectedOrderId || ''} onValueChange={onSelect}>
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} isSelected={selectedOrderId === order.id}
                onSelect={onSelect} formatCurrency={formatCurrency} />
            ))}
          </div>
        </RadioGroup>
      )}
    </ScrollArea>
  );
}

function OrderItem({ order, isSelected, onSelect, formatCurrency }: {
  order: ServiceOrder; isSelected: boolean; onSelect: (id: string) => void; formatCurrency: (amount: number) => string;
}) {
  const statusConfig = getStatusConfig(order.status);
  return (
    <div className={cn(
      "relative p-4 border rounded-xl transition-all duration-200 cursor-pointer",
      isSelected
        ? "border-primary/50 bg-primary/5 shadow-sm ring-1 ring-primary/20"
        : "border-border/70  hover:bg-muted/80 dark:hover:bg-card/50 hover:shadow-sm"
    )}
      onClick={() => onSelect(order.id)}
    >
      <div className="flex items-start gap-4">
        <RadioGroupItem value={order.id} id={order.id} className="mt-1.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Label htmlFor={order.id} className="font-semibold text-sm cursor-pointer flex items-center gap-2">
              <span className="text-primary">{order.orderNumber}</span>
              <Badge variant={statusConfig.variant} className="text-[10px] px-2 py-0 h-5 font-medium flex items-center gap-1">
                {statusConfig.icon}{statusConfig.label}
              </Badge>
            </Label>
            <span className="text-sm font-bold text-foreground flex-shrink-0">{formatCurrency(order.total)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{order.clientName}</span>
            <span className="flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" />{order.device}</span>
            {order.date && (
              <span className="flex items-center gap-1.5 text-xs">
                <Calendar className="h-3.5 w-3.5" />{new Date(order.date).toLocaleDateString()}
              </span>
            )}
          </div>
          {isSelected && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" /></div>}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-xl">
          <div className="flex items-start gap-4">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-1.5" />
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-4"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3.5 w-24" /></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusConfig(status: string) {
  const normalized = status.toLowerCase();
  const configs: Record<string, { label: string; variant: 'success' | 'warning' | 'default' | 'destructive'; icon: ReactNode }> = {
    completed: { label: 'Completada', variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
    in_progress: { label: 'En progreso', variant: 'default', icon: <Clock className="h-3 w-3" /> },
    pending: { label: 'Pendiente', variant: 'warning', icon: <AlertCircle className="h-3 w-3" /> },
    cancelled: { label: 'Cancelada', variant: 'destructive', icon: <X className="h-3 w-3" /> },
    delivered: { label: 'Entregada', variant: 'success', icon: <CheckCircle className="h-3 w-3" /> },
  };
  return configs[normalized] || { label: status, variant: 'default' as const, icon: <AlertCircle className="h-3 w-3" /> as ReactNode };
}
