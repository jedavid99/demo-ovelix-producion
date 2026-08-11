import { useNavigate } from 'react-router-dom';
import { MdReceipt } from 'react-icons/md';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export function NotFoundState() {
  const navigate = useNavigate();

  return (
    <Card className="p-12 text-center">
      <MdReceipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Orden no encontrada</h3>
      <Button onClick={() => navigate('/providers/orders')}>
        Volver al listado
      </Button>
    </Card>
  );
}
