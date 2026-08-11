import { MdAdd, MdDelete } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { formatCurrency } from '../constants';
import type { OrderItem } from '../types';

interface OrderItemsTableProps {
  items: OrderItem[];
  errors: Record<string, string>;
  onUpdateItem: (itemId: string, field: keyof OrderItem, value: string | number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddItem: () => void;
}

export function OrderItemsTable({ items, errors, onUpdateItem, onRemoveItem, onAddItem }: OrderItemsTableProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Productos</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
              <tr className="border-b">
                <th className="text-left p-2 font-medium text-sm">Producto</th>
                <th className="text-left p-2 font-medium text-sm w-24">Cantidad</th>
                <th className="text-left p-2 font-medium text-sm w-32">Precio unitario</th>
                <th className="text-left p-2 font-medium text-sm w-32">Subtotal</th>
                <th className="text-left p-2 font-medium text-sm w-16">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    <Select value={item.productId} onValueChange={(v: string) => onUpdateItem(item.id, 'productId', v)}>
                      <SelectTrigger className={errors[`item-${index}-product`] ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">Producto</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors[`item-${index}-product`] && <p className="text-sm text-destructive mt-1">{errors[`item-${index}-product`]}</p>}
                  </td>
                  <td className="p-2">
                    <Input type="number" min="1" value={item.quantity}
                      onChange={e => onUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className={errors[`item-${index}-quantity`] ? 'border-destructive' : ''} />
                    {errors[`item-${index}-quantity`] && <p className="text-sm text-destructive mt-1">{errors[`item-${index}-quantity`]}</p>}
                  </td>
                  <td className="p-2">
                    <Input type="number" min="0" value={item.unitPrice}
                      onChange={e => onUpdateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                      className={errors[`item-${index}-price`] ? 'border-destructive' : ''} />
                    {errors[`item-${index}-price`] && <p className="text-sm text-destructive mt-1">{errors[`item-${index}-price`]}</p>}
                  </td>
                  <td className="p-2 font-medium">{formatCurrency(item.subtotal)}</td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)} disabled={items.length === 1}>
                      <MdDelete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type="button" variant="outline" onClick={onAddItem}>
          <MdAdd className="mr-2" /> Agregar producto
        </Button>
        {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
      </CardContent>
    </Card>
  );
}
