import { useNavigate } from 'react-router-dom';
import { MdEdit, MdCheckCircle, MdCancel } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { Order } from '../types';

interface OrderActionsProps {
  order: Order;
  canEdit: boolean;
  canMarkAsReceived: boolean;
  canCancel: boolean;
  onMarkAsReceived: () => void;
  onCancelRequest: () => void;
}

export function OrderActions({ order, canEdit, canMarkAsReceived, canCancel, onMarkAsReceived, onCancelRequest }: OrderActionsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <Button onClick={() => navigate(`/providers/orders/edit/${order.id}`)}>
              <MdEdit className="mr-2" />
              Editar
            </Button>
          )}
          {canMarkAsReceived && (
            <Button onClick={onMarkAsReceived} variant="default">
              <MdCheckCircle className="mr-2" />
              Marcar como recibida
            </Button>
          )}
          {canCancel && (
            <Button onClick={onCancelRequest} variant="destructive">
              <MdCancel className="mr-2" />
              Cancelar orden
            </Button>
          )}
          <Button onClick={() => navigate('/providers/orders')} variant="outline">
            Volver al listado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
