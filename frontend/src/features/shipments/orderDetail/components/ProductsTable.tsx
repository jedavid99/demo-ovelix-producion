import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '../constants';
import type { Order, OrderItem } from '../types';

interface ProductsTableProps {
  items: OrderItem[];
  total: number;
}

export function ProductsTable({ items, total }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-sm">Producto</th>
                <th className="text-left p-3 font-medium text-sm w-24">Cantidad</th>
                <th className="text-left p-3 font-medium text-sm w-32">Precio unitario</th>
                <th className="text-left p-3 font-medium text-sm w-32">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 font-medium">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2">
                <td colSpan={3} className="p-3 text-right font-medium">Total</td>
                <td className="p-3 font-bold text-lg">{formatCurrency(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
