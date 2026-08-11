import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { statusColors } from '../constants';
import type { Order } from '../types';

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/providers/orders')}>
          <MdArrowBack />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">{order.provider}</p>
        </div>
      </div>
      <Badge className={statusColors[order.status]}>{order.status}</Badge>
    </div>
  );
}
