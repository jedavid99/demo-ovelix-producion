import { MdAttachMoney, MdCalendarToday, MdBusiness } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '../constants';

interface KPICardsProps {
  pendingOrders: number;
  thisMonthTotal: number;
  nextDeliveryLabel: string;
  activeProviders: number;
}

export function KPICards({ pendingOrders, thisMonthTotal, nextDeliveryLabel, activeProviders }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Órdenes pendientes</span>
            <Badge variant="warning">{pendingOrders}</Badge>
          </div>
          <div className="text-2xl font-bold">{pendingOrders}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total este mes</span>
            <MdAttachMoney className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Próxima entrega</span>
            <MdCalendarToday className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{nextDeliveryLabel}</div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Proveedores activos</span>
            <MdBusiness className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{activeProviders}</div>
        </CardContent>
      </Card>
    </div>
  );
}
