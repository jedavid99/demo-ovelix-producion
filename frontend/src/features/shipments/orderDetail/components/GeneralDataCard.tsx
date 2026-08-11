import { format } from 'date-fns';
import { MdCalendarToday, MdLocalShipping, MdCheckCircle, MdBusiness } from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Order } from '../types';

interface GeneralDataCardProps {
  order: Order;
}

export function GeneralDataCard({ order }: GeneralDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos generales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <MdCalendarToday className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha de emisión</p>
              <p className="font-medium">{format(order.issueDate, 'dd/MM/yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MdLocalShipping className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha estimada de entrega</p>
              <p className="font-medium">{format(order.deliveryDate, 'dd/MM/yyyy')}</p>
            </div>
          </div>
          {order.actualDeliveryDate && (
            <div className="flex items-center gap-3">
              <MdCheckCircle className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha de entrega real</p>
                <p className="font-medium">{format(order.actualDeliveryDate, 'dd/MM/yyyy')}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <MdBusiness className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Proveedor</p>
              <p className="font-medium">{order.provider}</p>
            </div>
          </div>
        </div>
        {order.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">Notas</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
