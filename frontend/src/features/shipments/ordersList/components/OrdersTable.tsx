import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MdReceipt, MdVisibility, MdEdit } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { statusColors, formatCurrency } from '../constants';
import type { Order } from '../types';

interface OrdersTableProps {
  loading: boolean;
  orders: Order[];
  paginatedOrders: Order[];
  filteredOrders: Order[];
}

export function OrdersTable({ loading, orders, paginatedOrders, filteredOrders }: OrdersTableProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/80 backdrop-blur-md sticky top-0">
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-sm">Nº Orden</th>
                <th className="text-left p-4 font-medium text-sm">Proveedor</th>
                <th className="text-left p-4 font-medium text-sm">Fecha emisión</th>
                <th className="text-left p-4 font-medium text-sm">Fecha entrega</th>
                <th className="text-left p-4 font-medium text-sm">Total</th>
                <th className="text-left p-4 font-medium text-sm">Estado</th>
                <th className="text-left p-4 font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <MdReceipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No hay órdenes de compra</p>
                    <Button onClick={() => navigate('/providers/orders/add')}>
                      Crear primera orden
                    </Button>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4">{order.provider}</td>
                    <td className="p-4">{format(order.issueDate, 'dd/MM/yyyy')}</td>
                    <td className="p-4">{format(order.deliveryDate, 'dd/MM/yyyy')}</td>
                    <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <Badge className={statusColors[order.status]}>{order.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/providers/orders/${order.id}`)}>
                          <MdVisibility />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/providers/orders/edit/${order.id}`)}>
                          <MdEdit />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
